package CarRental.dto.authentication;

import CarRental.utils.annotation.Password;

public record ChangePasswordRequest(
        String oldPassword,
        @Password String newPassword
) {
    
}
