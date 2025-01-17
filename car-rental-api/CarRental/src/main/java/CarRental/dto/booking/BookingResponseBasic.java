package CarRental.dto.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record BookingResponseBasic(
        Long id,
        Long userId,
        Long carId,
        LocalDateTime pickUpDateTime,
        LocalDateTime returnDateTime,
        BigDecimal basePrice,
        BigDecimal deposit,
        BigDecimal total,
        String status,
        LocalDateTime createdAt,
        Integer numberOfDays,
        String renterMessage,
        String carOwnerMessage,
        String paymentType,
        Long wardId,
        String road,
        LocalDateTime actualPickUpAt,
        LocalDateTime actualReturnAt
) {
}