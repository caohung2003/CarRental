package CarRental.controllers.authentication;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import CarRental.dto.authentication.AuthenticationRequest;
import CarRental.dto.authentication.AuthenticationResponse;
import CarRental.dto.authentication.KeyAndPasswordVM;
import CarRental.dto.authentication.RegisterRequest;
import CarRental.dto.authentication.ResetPasswordRequest;
import CarRental.exception.AccountResourceException;
import CarRental.exception.EmailAlreadyUsedException;
import CarRental.exception.InvalidPasswordException;
import CarRental.services.authentication.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;

    /**
     * Registers a new user.
     *
     * @param managedUserVM the managed user View Model.
     * @throws InvalidPasswordException        {@code 400 (Bad Request)} if the
     *                                         password is incorrect.
     * @throws EmailAlreadyUsedException       {@code 400 (Bad Request)} if the
     *                                         email is already used.
     * @throws MethodArgumentNotValidException {@code 400 (Bad Request)} if any
     *                                         field is not valid.
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(
            @Valid @RequestBody RegisterRequest request) {
        service.register(request);
    }

    @GetMapping("/activate")
    public void activateAccount(@RequestParam(value = "key") String key) {
        service.activateRegistration(key);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        service.refreshToken(request, response);
    }

    /**
     * {@code POST   /reset-password/init} : Send an email to reset the
     * password of the user.
     *
     * @param mail the mail of the user.
     * @throws RuntimeException {@code 400 (Bad Request)} if the email address is
     *                          not found.
     */
    @PostMapping(path = "/reset-password/init")
    public void requestPasswordReset(@RequestBody ResetPasswordRequest request) {
        service.requestPasswordReset(request.email());

    }

    @PostMapping(path = "/reset-password/check-key")
    public void checkPasswordResetKey(@RequestParam String key) {
        service.checkPasswordResetKey(key);
    }

    /**
     * {@code POST   /reset-password/finish} : Finish to reset the password
     * of the user.
     *
     * @param keyAndPassword the generated key and the new password.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is
     *                                  incorrect.
     * @throws RuntimeException         {@code 500 (Internal Server Error)} if the
     *                                  password could not be reset.
     * @throws AccountResourceException {@code 400 (Bad Request)} if no user was
     *                                  found
     */
    @PostMapping(path = "/reset-password/finish")
    public void finishPasswordReset(@RequestBody @Valid KeyAndPasswordVM keyAndPassword) {
        service.completePasswordReset(keyAndPassword.newPassword(), keyAndPassword.key());
    }

}
