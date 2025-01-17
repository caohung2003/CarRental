package CarRental.dto.wallet;

import java.time.LocalDateTime;

import CarRental.models.payment.TransactionStatus;
import CarRental.models.payment.TransactionType;
import CarRental.models.payment.Wallet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDto {
    private Long bookingId;

    private Long id;

    private Long walletId;

    private Long transactionId;

    private Long amount;

    private String message;

    private LocalDateTime timestamp;

    private TransactionType type;

    private TransactionStatus status;
}
