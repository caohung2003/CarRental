package CarRental.dto.authentication;

import org.hibernate.validator.constraints.Length;

import CarRental.utils.annotation.Password;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @Length(min = 2, max = 50) String firstName,
        @Length(min = 2, max = 50) String lastName,
        @Email @NotBlank String email,
        @Password @NotBlank String password) {
}
