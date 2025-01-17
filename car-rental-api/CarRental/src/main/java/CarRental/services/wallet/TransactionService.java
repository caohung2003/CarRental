package CarRental.services.wallet;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import CarRental.models.payment.Transaction;
import CarRental.models.payment.TransactionStatus;
import CarRental.models.payment.TransactionType;
import CarRental.models.user.User;

import CarRental.dto.wallet.TransactionDto;
import java.time.LocalDateTime;

public interface TransactionService {

    Transaction createTransaction(Long walletId, BigDecimal amount, String message, TransactionType type, UUID id,
            TransactionStatus status);

    UUID transfer(User sender, User receiver, BigDecimal amount, String message, Long bookingId);

    void completeTransfer(UUID transactionId);

    void refundTransfer(UUID transactionId);

    void confirmTopUp(Long id);

    void confirmWithdraw(Long transactionId);

    Transaction getByTransactionIdAndType(UUID transactionId, TransactionType type);

    Page<TransactionDto> getAllApprovalTransactions(
            TransactionType type,
            LocalDateTime start,
            LocalDateTime end,
            String sort,
            String order,
            Pageable pageable);
}
