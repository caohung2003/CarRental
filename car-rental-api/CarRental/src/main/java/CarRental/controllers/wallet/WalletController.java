package CarRental.controllers.wallet;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import CarRental.dto.wallet.TransactionDto;
import CarRental.dto.wallet.WalletDto;
import CarRental.services.vnpay.VnPayService;
import CarRental.services.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;

@Log
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/wallet")
public class WalletController {
    private final WalletService walletService;

    private final VnPayService vnPayService;

    @GetMapping("/my-wallet")
    public ResponseEntity<WalletDto> getMyWallet() {
        return ResponseEntity.ok().body(walletService.getWalletByUserId());
    }

    @GetMapping("/my-transaction")
    public ResponseEntity<List<TransactionDto>> getMyTransaction() {
        return ResponseEntity.ok().body(walletService.getTransactionsByWalletId());
    }

    @PutMapping("my-wallet/top-up-vnpay/{amount}")
    public ResponseEntity<Void> topUp(@PathVariable BigDecimal amount,
            @RequestParam(value = "transactionCode", required = false) UUID transactionCode,
            @RequestBody(required = false) String message) {
        walletService.topUpByVNPay(amount, transactionCode, message);
        return ResponseEntity.ok().build();
    }

    @PutMapping("my-wallet/withdraw/{amount}")
    public ResponseEntity<Void> withdraw(@PathVariable BigDecimal amount, @RequestBody String message) {
        walletService.withdraw(amount, message);
        return ResponseEntity.ok().build();
    }

    @GetMapping("my-wallet/create-payment/{amount}")
    public ResponseEntity<String> createPayment(
            @PathVariable BigDecimal amount,
            @RequestParam(value = "returnedUrl", required = false) String returnedUrl

    ) {
        String paymentUrl = vnPayService.createPayment(amount, returnedUrl);
        return new ResponseEntity<>(paymentUrl, HttpStatus.OK);
    }

    @PutMapping("my-wallet/get-payment/{amount}")
    public ResponseEntity<Void> getPayment(@PathVariable BigDecimal amount) {
        vnPayService.getPayment(amount);
        return ResponseEntity.ok().build();
    }

}
