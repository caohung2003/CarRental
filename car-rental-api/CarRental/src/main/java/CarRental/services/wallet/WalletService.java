package CarRental.services.wallet;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import CarRental.dto.wallet.TransactionDto;
import CarRental.dto.wallet.WalletDto;
import CarRental.models.user.User;

public interface WalletService {

    WalletDto getWalletByUserId();

    List<TransactionDto> getTransactionsByWalletId();

    void createWallet(User user);

    void topUpByVNPay(BigDecimal amount, UUID transactionCode, String message);

    void withdraw(BigDecimal amount, String message);

}
