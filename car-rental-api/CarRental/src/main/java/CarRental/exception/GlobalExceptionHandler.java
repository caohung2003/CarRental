package CarRental.exception;

import java.io.IOException;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.amazonaws.AmazonServiceException;

import CarRental.dto.error.ErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.extern.log4j.Log4j2;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

@ControllerAdvice
@Log4j2
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<ErrorResponse> handleEmailAlreadyUsedException(EmailAlreadyUsedException e) {
        return new ResponseEntity<>(new ErrorResponse("Email already used", e.getMessage(), "BAD_REQUEST"),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
        return new ResponseEntity<>(new ErrorResponse("Wrong password", ex.getMessage(), "UNAUTHORIZED"),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFoundException(UsernameNotFoundException e) {
        return new ResponseEntity<>(new ErrorResponse("Email not found", e.getMessage(), "NOT_FOUND"),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AccountResourceException.class)
    public ResponseEntity<ErrorResponse> handleAccountResourceException(AccountResourceException e) {
        return new ResponseEntity<>(new ErrorResponse("Account not found", e.getMessage(), "NOT_FOUND"),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse> handleDisabledException(DisabledException e) {
        return new ResponseEntity<>(new ErrorResponse("User disabled", e.getMessage(), "FORBIDDEN"),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AccountNotActivatedException.class)
    public ResponseEntity<ErrorResponse> handleUserNotActivatedException(AccountNotActivatedException e) {
        return new ResponseEntity<>(new ErrorResponse("Account not activated", e.getMessage(), "FORBIDDEN"),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleExpiredJwtException(ExpiredJwtException e) {
        return new ResponseEntity<>(new ErrorResponse("Expired JWT", e.getMessage(), "UNAUTHORIZED"),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleJwtException(JwtException e) {
        return new ResponseEntity<>(new ErrorResponse("Invalid token", e.getMessage(), "UNAUTHORIZED"),
                HttpStatus.UNAUTHORIZED);
    }

    // handle InvalidPasswordException
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPasswordException(InvalidPasswordException e) {
        return new ResponseEntity<>(new ErrorResponse("Invalid password", e.getMessage(), "BAD_REQUEST"),
                HttpStatus.BAD_REQUEST);
    }

    // handle ValidationException
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult().getAllErrors().stream()
                .map(error -> {
                    if (error instanceof FieldError) {
                        FieldError fieldError = (FieldError) error;
                        return fieldError.getField() + ": " + error.getDefaultMessage();
                    } else {
                        return error.getObjectName() + ": " + error.getDefaultMessage();
                    }
                })
                .collect(Collectors.joining(", "));

        return new ResponseEntity<>(new ErrorResponse("Validation error", errorMessage, "VALIDATION_ERROR"),
                HttpStatus.BAD_REQUEST);
    }

    // handle CarResourceException
    @ExceptionHandler(CarResourceException.class)
    public ResponseEntity<ErrorResponse> handleCarNotFoundException(CarResourceException e) {
        return new ResponseEntity<>(new ErrorResponse("Car Not found", e.getMessage(), "NOT_FOUND"),
                HttpStatus.NOT_FOUND);
    }

    // handle IOException
    @ExceptionHandler(IOException.class)
    public ResponseEntity<ErrorResponse> handleIOException(IOException e) {
        return new ResponseEntity<>(new ErrorResponse("IO error", e.getMessage(), "INTERNAL_SERVER_ERROR"),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // handle WalletResourceException
    @ExceptionHandler(WalletResourceException.class)
    public ResponseEntity<ErrorResponse> handleWalletResourceException(WalletResourceException e) {
        return new ResponseEntity<>(new ErrorResponse("Wallet Not found", e.getMessage(), "NOT_FOUND"),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FeedbackResourceException.class)
    public ResponseEntity<ErrorResponse> handleFeedbackExpiredException(FeedbackResourceException e) {
        return new ResponseEntity<>(new ErrorResponse(e.getMessage(), e.getMessage(), "BAD_REQUEST"),
                HttpStatus.BAD_REQUEST);
    }

    // handle AmazonServiceException
    @ExceptionHandler(AmazonServiceException.class)
    public ResponseEntity<ErrorResponse> handleAmazonServiceException(AmazonServiceException e) {
        return new ResponseEntity<>(new ErrorResponse("Amazon Service error", e.getMessage(), "INTERNAL_SERVER_ERROR"),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // handle ForbiddenOperationException
    @ExceptionHandler(ForbiddenOperationException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedOperationException(ForbiddenOperationException e) {
        return new ResponseEntity<>(new ErrorResponse("Unauthorized operation", e.getMessage(), "FORBIDDEN"),
                HttpStatus.FORBIDDEN);
    }

    // handle InvalidStepException
    @ExceptionHandler(InvalidStepException.class)
    public ResponseEntity<ErrorResponse> handleInvalidStepException(InvalidStepException e) {
        return new ResponseEntity<>(new ErrorResponse("Invalid step", e.getMessage(), "BAD_REQUEST"),
                HttpStatus.BAD_REQUEST);
    }

    // handle InvalidOperationException
    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<ErrorResponse> handleInvalidOperationException(InvalidOperationException e) {
        return new ResponseEntity<>(new ErrorResponse("Invalid operation", e.getMessage(), "BAD_REQUEST"),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        // log the stack trace of the exception
        log.error(e.getMessage(), e);
        return new ResponseEntity<>(new ErrorResponse("Internal server error",
                e.getMessage(), "INTERNAL_SERVER_ERROR"), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // handle invalid json
    @ExceptionHandler(JsonParseException.class)
    public ResponseEntity<ErrorResponse> handleInvalidJsonParseException(JsonParseException e) {
        return new ResponseEntity<>(new ErrorResponse("Invalid information", e.getMessage(), "BAD_REQUEST"),
                HttpStatus.BAD_REQUEST);
    }

    // handle existed transaction for top up or withdrawal
    @ExceptionHandler(TransactionExistedException.class)
    public ResponseEntity<ErrorResponse> handleTransactionExisted(TransactionExistedException e) {
        return new ResponseEntity<>(
                new ErrorResponse("Transaction already existed. Please try again !", e.getMessage(), "BAD_REQUEST"),
                HttpStatus.BAD_REQUEST);
    }

}
