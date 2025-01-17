package CarRental.services.wallet.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import CarRental.services.email.EmailService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import CarRental.dto.wallet.TransactionDto;
import CarRental.exception.NotEnoughMoneyException;
import CarRental.models.payment.Transaction;
import CarRental.models.payment.TransactionStatus;
import CarRental.models.payment.TransactionType;
import CarRental.models.payment.Wallet;
import CarRental.models.user.User;
import CarRental.repositories.wallet.TransactionRepository;
import CarRental.repositories.wallet.WalletRepository;
import CarRental.services.wallet.TransactionService;
import CarRental.utils.mapper.payment.TransactionMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final WalletRepository walletRepository;

    private final TransactionRepository transactionRepository;

    private final EmailService emailService;

    private final TransactionMapper transactionMapper;

    @Override
    public Transaction createTransaction(Long walletId, BigDecimal amount, String message, TransactionType type,
            UUID id, TransactionStatus status) {
        Optional<Wallet> optionalWallet = walletRepository.findById(walletId);

        if (optionalWallet.isPresent()) {
            Wallet wallet = optionalWallet.get();
            Transaction transaction = Transaction.builder()
                    .transactionId(id)
                    .amount(amount)
                    .message(message)
                    .timestamp(LocalDateTime.now())
                    .wallet(wallet)
                    .type(type)
                    .status(status)
                    .build();

            // Save the transaction and update the wallet
            transactionRepository.save(transaction);

            return transaction;
        }
        return new Transaction();
    }

    @Override
    @Transactional
    public UUID transfer(User sender, User receiver, BigDecimal amount, String message, Long bookingId) {
        Wallet senderWallet = sender.getWallet();
        Wallet receiverWallet = receiver.getWallet();

        if (senderWallet.getAvailableBalance().compareTo(amount) < 0) {
            throw new NotEnoughMoneyException("Not enough money in the wallet to complete the transaction");
        }

        UUID uuid = UUID.randomUUID();

        Transaction senderTransaction = createTransaction(senderWallet.getId(), amount, message, TransactionType.DEBIT,
                uuid, TransactionStatus.PENDING);

        Transaction receiverTransaction = createTransaction(receiverWallet.getId(), amount, message,
                TransactionType.CREDIT, uuid, TransactionStatus.PENDING);

        // assign the booking id to the transaction
        senderTransaction.setBookingId(bookingId);
        receiverTransaction.setBookingId(bookingId);

        // Update the transaction status to processing
        senderTransaction.setStatus(TransactionStatus.PROCESSING);
        receiverTransaction.setStatus(TransactionStatus.PROCESSING);

        // Update the wallet balance of the sender
        senderWallet.setAvailableBalance(senderWallet.getAvailableBalance().subtract(amount));

        // update the pending balance of the receiver
        receiverWallet.setPendingBalance(receiverWallet.getPendingBalance().add(amount));

        // Save the changes
        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);
        transactionRepository.save(senderTransaction);
        transactionRepository.save(receiverTransaction);

        emailService.sendTransferEmail(sender, receiver, senderTransaction, receiverTransaction);
        return uuid;
    }

    @Override
    @Transactional
    public void completeTransfer(UUID transactionId) {
        Transaction senderTransaction = transactionRepository.findByTransactionIdAndType(transactionId,
                TransactionType.DEBIT);
        Transaction receiverTransaction = transactionRepository.findByTransactionIdAndType(transactionId,
                TransactionType.CREDIT);
        // Convert the pending balance to available balance
        BigDecimal amount = receiverTransaction.getAmount();
        Wallet receiverWallet = receiverTransaction.getWallet();
        receiverWallet.setAvailableBalance(receiverWallet.getAvailableBalance().add(amount));
        receiverWallet.setPendingBalance(receiverWallet.getPendingBalance().subtract(amount));
        // Update the transaction status to completed
        senderTransaction.setStatus(TransactionStatus.COMPLETED);
        receiverTransaction.setStatus(TransactionStatus.COMPLETED);
        // Save the changes
        walletRepository.save(receiverWallet);
        transactionRepository.save(senderTransaction);
        transactionRepository.save(receiverTransaction);
        // TODO: send notification to the receiver
        emailService.sendTransferCompleteEmail(receiverTransaction.getWallet().getUser(), receiverTransaction);
        // Bao receiver la tai khoan da duoc cong tien
    }

    @Override
    @Transactional
    public void refundTransfer(UUID transactionId) {
        Transaction senderTransaction = transactionRepository.findByTransactionIdAndType(transactionId,
                TransactionType.DEBIT);
        Transaction receiverTransaction = transactionRepository.findByTransactionIdAndType(transactionId,
                TransactionType.CREDIT);
        // Transfer the amount back to the sender
        BigDecimal amount = senderTransaction.getAmount();
        Wallet senderWallet = senderTransaction.getWallet();
        senderWallet.setAvailableBalance(senderWallet.getAvailableBalance().subtract(amount));

        Wallet receiverWallet = receiverTransaction.getWallet();
        receiverWallet.setAvailableBalance(receiverWallet.getPendingBalance().subtract(amount));

        // Update the transaction status to refunded
        senderTransaction.setStatus(TransactionStatus.REFUNDED);
        receiverTransaction.setStatus(TransactionStatus.REFUNDED);
        // Save the changes
        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);
        transactionRepository.save(senderTransaction);
        transactionRepository.save(receiverTransaction);

    }

    @Override
    @Transactional
    public void confirmTopUp(Long transactionId) {
        Transaction transaction = transactionRepository.findByIdAndType(transactionId, TransactionType.TOP_UP);
        if (transaction == null) {
            throw new IllegalArgumentException("Transaction not found");
        }
        Wallet wallet = transaction.getWallet();
        wallet.setAvailableBalance(wallet.getAvailableBalance().add(transaction.getAmount()));
        wallet.setPendingBalance(wallet.getPendingBalance().subtract(transaction.getAmount()));
        transaction.setStatus(TransactionStatus.COMPLETED);
        walletRepository.save(wallet);
        transactionRepository.save(transaction);
        // TODO: send notification to the user
        // Bao nguoi dung la giao dich dang duojc xu li, chi can truyen message va
        // status
    }

    @Override
    @Transactional
    public void confirmWithdraw(Long transactionId) {
        Transaction transaction = transactionRepository.findByIdAndType(transactionId, TransactionType.WITHDRAW);
        if (transaction == null) {
            throw new IllegalArgumentException("Transaction not found");
        }
        Wallet wallet = transaction.getWallet();
        wallet.setAvailableBalance(wallet.getAvailableBalance().subtract(transaction.getAmount()));
        wallet.setPendingBalance(wallet.getPendingBalance().add(transaction.getAmount()));
        transaction.setStatus(TransactionStatus.COMPLETED);
        walletRepository.save(wallet);
        transactionRepository.save(transaction);
        // TODO: send notification to the user
        //
    }

    @Override
    public Transaction getByTransactionIdAndType(UUID transactionId, TransactionType type) {
        return transactionRepository.findByTransactionIdAndType(transactionId, type);
    }

    @Override
    public Page<TransactionDto> getAllApprovalTransactions(TransactionType type, LocalDateTime start, LocalDateTime end,
            String sort, String order,
            Pageable pageable) {
        List<Sort.Order> orders = new ArrayList<>();
        if (sort != null) {
            if (order.equals("asc")) {
                orders.add(new Sort.Order(Sort.Direction.ASC, sort));
            } else {
                orders.add(new Sort.Order(Sort.Direction.DESC, sort));
            }
            orders.add(new Sort.Order(Sort.Direction.ASC, Transaction.Fields.id));

        } else {
            orders.add(new Sort.Order(Sort.Direction.DESC, Transaction.Fields.timestamp));
            orders.add(new Sort.Order(Sort.Direction.ASC, Transaction.Fields.id));
        }
        return transactionRepository.findByTypeAndStatusAndDate(type, TransactionStatus.PENDING, start, end, pageable)
                .map(transactionMapper::mapFrom);
    }
}
