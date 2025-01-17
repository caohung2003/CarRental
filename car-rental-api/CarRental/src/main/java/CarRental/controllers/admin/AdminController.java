package CarRental.controllers.admin;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import CarRental.dto.car.CarBasicDto;
import CarRental.dto.wallet.TransactionDto;
import CarRental.models.payment.TransactionType;
import CarRental.services.car.CarBasicService;
import CarRental.services.wallet.TransactionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {
    private final TransactionService transactionService;

    private final CarBasicService carBasicService;

    @PutMapping("user-wallet/confirm-top-up/{transactionId}")
    public ResponseEntity<Void> confirmTopUp(@PathVariable Long transactionId) {
        transactionService.confirmTopUp(transactionId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("user-wallet/confirm-withdraw/{transactionId}")
    public ResponseEntity<Void> confirmWithdraw(@PathVariable Long transactionId) {
        transactionService.confirmWithdraw(transactionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-approval-car")
    public ResponseEntity<Page<CarBasicDto>> getAllWaitForApprovalCars(
            @RequestParam(value = "licensePlate", required = false) String licensePlate,
            Pageable pageable) {
        return new ResponseEntity<>(carBasicService.getAllWaitForApprovalCars(licensePlate, pageable),
                HttpStatus.OK);
    }

    @GetMapping("/get-approval-transaction")
    public ResponseEntity<Page<TransactionDto>> getAllWaitForApprovalTransaction(
            @RequestParam(value = "type") TransactionType type,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "order", required = false) String order,
            @RequestParam(value = "startDate") LocalDateTime start,
            @RequestParam(value = "endDate") LocalDateTime end,
            Pageable pageable) {
        return new ResponseEntity<>(
                transactionService.getAllApprovalTransactions(type, start, end, sort, order, pageable),
                HttpStatus.OK);
    }

    @PutMapping("/approve-car/{carId}")
    public ResponseEntity<Void> approveCar(
            @PathVariable Long carId, @RequestParam("insuranceStatus") Boolean insuranceStatus) {
        carBasicService.approveCar(carId, insuranceStatus);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/decline-car/{carId}")
    public ResponseEntity<Void> declineCar(@PathVariable Long carId,
            @RequestParam("declinedReason") String declinedReason) {
        carBasicService.declineCar(carId, declinedReason);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}