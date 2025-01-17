package CarRental.dto.booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record BookingResponse(
        Long id,
        Long userId,
        Long carId,
        String renterFirstName,
        String renterLastName,
        LocalDate renterDob,
        String renterEmail,
        String renterPhone,
        Long renterWardId,
        String renterLocation,
        String renterNationalId,
        String renterDriverLicenseImageUrl,
        // driver information
        String driverFirstName,
        String driverLastName,
        LocalDate driverDob,
        String driverEmail,
        String driverPhone,
        Long driverWardId,
        String driverLocation,
        String driverNationalId,
        String driverLicenseImageImageUrl,
        // booking information
        LocalDateTime pickUpDateTime,
        LocalDateTime returnDateTime,
        Integer numberOfDays,
        Long pickUpWardId,
        String pickUpLocation,
        BigDecimal basePrice,
        BigDecimal deposit,
        BigDecimal total,
        String status,
        LocalDateTime createdAt,
        String renterMessage,
        String carOwnerMessage,
        String paymentType) {

}
