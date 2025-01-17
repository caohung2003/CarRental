package CarRental.dto.user;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import CarRental.utils.annotation.PhoneNumber;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record UserProfileDto(
    Long id, 
    @NotBlank String firstName,
    @NotBlank String lastName,
    @Email String email,
    LocalDate dob,
    @PhoneNumber String phone,
    String nationalId,
    MultipartFile avatarImage,
    MultipartFile driverLicenseImage,
    Long wardId,
    String address
) {

}