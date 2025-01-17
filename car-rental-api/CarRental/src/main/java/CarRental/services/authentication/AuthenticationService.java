package CarRental.services.authentication;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import CarRental.dto.authentication.AuthenticationRequest;
import CarRental.dto.authentication.AuthenticationResponse;
import CarRental.dto.authentication.RegisterRequest;
import CarRental.dto.error.ErrorResponse;
import CarRental.exception.AccountNotActivatedException;
import CarRental.exception.AccountResourceException;
import CarRental.exception.EmailAlreadyUsedException;
import CarRental.models.user.Role;
import CarRental.models.user.User;
import CarRental.repositories.user.TokenRepository;
import CarRental.repositories.user.UserRepository;
import CarRental.services.email.EmailService;
import CarRental.services.wallet.WalletService;
import CarRental.utils.RandomUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService mailService;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final WalletService walletService;

    public void register(RegisterRequest request) {
        // check if email is already in use and throw exception if it is
        if (repository.existsByEmail(request.email())) {
            throw new EmailAlreadyUsedException();
        }
        var newUser = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .activated(false)
                .activationKey(RandomUtil.generateActivationKey())
                .build();
        repository.save(newUser);
        //Log the created user using email and id
        log.info("Created Information for User: {}", newUser.getEmail());
        mailService.sendActivationEmail(newUser);
    }

    public void activateRegistration(String key) {
        var activateUser = repository
                .findOneByActivationKey(key)
                .map(user -> {
                    user.setActivated(true);
                    user.setActivationKey(null);
                    return user;
                }).orElseThrow(() -> new AccountResourceException("No user found for this activation key: " + key));
        walletService.createWallet(activateUser);
    }

    public void completePasswordReset(String newPassword, String key) {
        User resetUser = getUserByPasswordResetKey(key);
        resetUser.setPassword(passwordEncoder.encode(newPassword));
        resetUser.setResetKey(null);
        resetUser.setResetDate(null);
        resetUser.setActivated(true);
        if (resetUser.getWallet() == null) {
            walletService.createWallet(resetUser);
        }
    }

    private User getUserByPasswordResetKey(String key) throws AccountResourceException, UsernameNotFoundException{
        User resetUser = repository.findOneByResetKey(key).orElseThrow(() -> new AccountResourceException("Reset key not found"));
        if (resetUser.getResetDate().isBefore(Instant.now().minus(15, ChronoUnit.MINUTES))) {
            throw new AccountResourceException("Reset key expired");
        }
        return resetUser;
    }

    public void checkPasswordResetKey(String key) {
        getUserByPasswordResetKey(key);
    }

    public void requestPasswordReset(String mail) {
        var resetUser = repository
                .findOneByEmailIgnoreCase(mail)
                .map(user -> {
                    user.setResetKey(RandomUtil.generateResetKey());
                    user.setResetDate(Instant.now());
                    return user;
                });
        if (resetUser.isPresent()) {
            mailService.sendPasswordResetEmail(resetUser.orElseThrow());
        } else {
            throw new UsernameNotFoundException("Email not found");
        }
    }

    

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = repository.findOneByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!user.isActivated()) {
            mailService.sendActivationEmail(user);
            throw new AccountNotActivatedException("Account not activated");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var jwtToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user, request.isRememberMe());
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            var errorResponse = new ErrorResponse("Invalid refresh token", "Invalid refresh token",
                    "AUTHENTICATION_FAILED");
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            new ObjectMapper().writeValue(response.getOutputStream(), errorResponse);

        } else {
            refreshToken = authHeader.substring(7);
            userEmail = jwtService.extractUsername(refreshToken);

            var user = userRepository
                    .findOneByEmailIgnoreCase(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!isRefreshTokenValid(refreshToken, user)) {
                // return;
                var errorResponse = new ErrorResponse("Invalid refresh token", "Invalid refresh token",
                        "AUTHENTICATION_FAILED");
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                new ObjectMapper().writeValue(response.getOutputStream(), errorResponse);
            }

            var accessToken = jwtService.generateAccessToken(user);
            var newRefreshToken = jwtService.reGenerateRefreshToken(refreshToken, user);
            var authResponse = AuthenticationResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(newRefreshToken)
                    .build();
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
        }
    }

    private boolean isRefreshTokenValid(String tokenString, User user) {
        return tokenRepository.existsByTokenAndUser(tokenString, user);
    }

}