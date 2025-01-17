package CarRental.repositories.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import CarRental.models.user.Token;
import CarRental.models.user.User;


public interface TokenRepository extends JpaRepository<Token, Long>{
    Optional<Token> findOneByToken(String token);
    boolean existsByTokenAndUser(String token, User user);
    List<Token> findAllByExpiryTimeBefore(LocalDateTime expirationDate);
}
