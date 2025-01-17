package CarRental.services.wallet.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import CarRental.models.payment.Transaction;
import CarRental.models.payment.TransactionStatus;
import CarRental.services.email.EmailService;
import org.springframework.stereotype.Service;

import CarRental.dto.wallet.TransactionDto;
import CarRental.dto.wallet.WalletDto;
import CarRental.exception.NotEnoughMoneyException;
import CarRental.exception.TransactionExistedException;
import CarRental.models.payment.TransactionType;
import CarRental.models.payment.Wallet;
import CarRental.models.user.User;
import CarRental.repositories.wallet.TransactionRepository;
import CarRental.repositories.wallet.WalletRepository;
import CarRental.services.user.UserService;
import CarRental.services.wallet.TransactionService;
import CarRental.services.wallet.WalletService;
import CarRental.utils.mapper.payment.TransactionMapper;
import CarRental.utils.mapper.payment.WalletMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;
    private final WalletMapper walletMapper;
    private final TransactionMapper transactionMapper;
    private final TransactionService transactionService;
    private final EmailService emailService;
    public static final UUID NAMESPACE_X500 = new UUID(0x6ba7b8149dad11d1L, 0x80b400c04fd430c8L);

    @Override
    public WalletDto getWalletByUserId() {
        User user = userService.getUserFromSecurityContext();
        Wallet wallet = walletRepository.findByUserId(user.getId()).get();
        return walletMapper.mapFrom(wallet);
    }

    @Override
    public List<TransactionDto> getTransactionsByWalletId() {
        User user = userService.getUserFromSecurityContext();
        return transactionRepository.findByWalletId(user.getWallet().getId()).stream()
                .map(transactionMapper::mapFrom)
                .collect(Collectors.toList());
    }

    @Override
    public void createWallet(User user) {
        Wallet wallet = new Wallet();
        wallet.setPendingBalance(BigDecimal.valueOf(0));
        wallet.setAvailableBalance(BigDecimal.valueOf(10000));
        wallet.setUser(user);
        walletRepository.save(wallet);
    }

    @Override
    public void topUpByVNPay(BigDecimal amount, UUID transactionCode, String message) {
        User user = userService.getUserFromSecurityContext();
        UUID uuid;
        if (transactionCode == null)
            uuid = UUID.randomUUID();
        else
            uuid = transactionCode;
        if (transactionRepository.findByTransactionIdAndType(transactionCode, TransactionType.TOP_UP) != null) {
            throw new TransactionExistedException("Transaction already existed. Please try again !");
        }
        transactionService.createTransaction(user.getWallet().getId(), amount, message, TransactionType.TOP_UP,
                uuid, TransactionStatus.COMPLETED);
        Wallet wallet = user.getWallet();
        wallet.setAvailableBalance(wallet.getAvailableBalance().add(amount));
        walletRepository.save(wallet);
    }

    @Override
    public void withdraw(BigDecimal amount, String message) {
        User user = userService.getUserFromSecurityContext();
        Wallet wallet = user.getWallet();
        if (wallet.getAvailableBalance().compareTo(amount) < 0) {
            throw new NotEnoughMoneyException("Not enough money in the wallet to complete the transaction");
        }
        UUID uuid = UUID.randomUUID();
        Transaction newTransaction = transactionService.createTransaction(wallet.getId(), amount, message,
                TransactionType.WITHDRAW, uuid, TransactionStatus.PENDING);
        Wallet userWallet = user.getWallet();
        // Convert the available balance to pending balance
        userWallet.setAvailableBalance(userWallet.getAvailableBalance().subtract(amount));
        userWallet.setPendingBalance(userWallet.getPendingBalance().add(amount));
        // Save the changes
        walletRepository.save(userWallet);
        emailService.sendWithdrawalEmail(user, newTransaction);
    }
}
