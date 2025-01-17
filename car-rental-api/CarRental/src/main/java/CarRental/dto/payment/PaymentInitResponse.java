package CarRental.dto.payment;

import java.math.BigDecimal;
import java.util.List;

import CarRental.models.payment.PaymentType;
import lombok.Builder;

@Builder
public record PaymentInitResponse (
    List<PaymentType> paymentTypesAvailable,
    BigDecimal amount,
    Long bookingId,
    BigDecimal availableBalance
) {
    
}
