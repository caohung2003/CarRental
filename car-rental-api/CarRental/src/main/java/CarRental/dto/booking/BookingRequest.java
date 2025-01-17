package CarRental.dto.booking;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

import CarRental.utils.annotation.PhoneNumber;
import CarRental.utils.annotation.ValidDate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record BookingRequest(
                Long id,
                @NotNull Long carId,
                //Renter information
                @Length(min = 1, max = 50) String renterFirstName,
                @Length(min = 1, max = 50) String renterLastName,
                @ValidDate(message = "Invalid date") LocalDate renterDob,
                @Email String renterEmail,
                @PhoneNumber String renterPhone,
                Long renterWardId,
                String renterLocation,
                @Length(min = 9, max = 12) String renterNationalId,
                MultipartFile renterDriverLicense,
                //driver information
                @Length(min = 1, max = 50) String driverFirstName,
                @Length(min = 1, max = 50) String driverLastName,
                @ValidDate(message = "Invalid date") LocalDate driverDob,
                @Email String driverEmail,
                @PhoneNumber String driverPhone,
                Long driverWardId,
                String driverLocation,
                @Length(min = 9, max = 12) String driverNationalId,
                MultipartFile driverDriverLicense,
                //Booking information
                LocalDateTime pickUpDateTime,
                LocalDateTime returnDateTime,
                Long pickUpWardId,
                String pickUpLocation) {
}
