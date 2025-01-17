package CarRental.repositories.wallet;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import CarRental.models.payment.Transaction;
import CarRental.models.payment.TransactionStatus;
import CarRental.models.payment.TransactionType;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByWalletId(Long walletId);

    List<Transaction> findByTransactionId(UUID transactionId);

    Transaction findByTransactionIdAndType(UUID transactionId, TransactionType type);

    Transaction findByIdAndType(Long id, TransactionType type);

    @Query("SELECT t FROM Transaction t WHERE t.type = :type AND t.status = :status AND (t.timestamp >= :start AND t.timestamp <= :end)")
    Page<Transaction> findByTypeAndStatusAndDate(
            @Param("type") TransactionType type,
            @Param("status") TransactionStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable);
}
