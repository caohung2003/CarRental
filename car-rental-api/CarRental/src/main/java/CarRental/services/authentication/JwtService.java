package CarRental.services.authentication;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import CarRental.models.user.Token;
import CarRental.models.user.TokenType;
import CarRental.models.user.User;
import CarRental.repositories.user.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class JwtService {

    private final TokenRepository tokenRepository;

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    @Value("${application.security.jwt.refresh-token.expiration-remember-me}")
    private long refreshExpirationRememberMe;

    public String extractUsername(String token) throws ExpiredJwtException, JwtException {
        return extractClaim(token, Claims::getSubject);
    }

    public Boolean extractRememberMe(String token) throws ExpiredJwtException, JwtException {
        return extractClaim(token, claims -> claims.get("remember", Boolean.class));
    }

    public TokenType extractTokenType(String token) throws ExpiredJwtException, JwtException {
        return extractClaim(token, claims -> TokenType.valueOf(claims.get("type", String.class)));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver)
            throws ExpiredJwtException, JwtException {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateAccessToken(UserDetails userDetails) {
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("type", TokenType.ACCESS);
        return buildToken(claims, userDetails, jwtExpiration);
    }

    public String generateTokenWithExtraClaim(
            Map<String, Object> extraClaims,
            UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    @Transactional
    public String generateRefreshToken(
            User user,
            boolean rememberMe) {
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("remember", rememberMe);
        claims.put("type", TokenType.REFRESH);
        String tokenString = buildToken(claims, user, rememberMe ? refreshExpirationRememberMe : refreshExpiration);
        LocalDateTime expiryTime = LocalDateTime.now().plusSeconds(rememberMe ? refreshExpirationRememberMe : refreshExpiration);
        Token token = Token.builder()
                .token(tokenString)
                .user(user)
                .expiryTime(expiryTime)
                .build(); 
        tokenRepository.save(token);
        return tokenString;
    }


    public String reGenerateRefreshToken(String tokenString, User user) {
        tokenRepository.findOneByToken(tokenString).ifPresent(tokenRepository::delete);
        return generateRefreshToken(user, extractRememberMe(tokenString));
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isAccessTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) &&  extractTokenType(token) == TokenType.ACCESS;
        } catch (JwtException e) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) throws ExpiredJwtException, JwtException {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Transactional
    @Scheduled(cron = "0 0 0 */7 * ?") 
    public void removeExpiredTokens() {
        tokenRepository.findAllByExpiryTimeBefore(LocalDateTime.now())
                .forEach(tokenRepository::delete);
    }
}
