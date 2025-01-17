package CarRental.controllers.booking;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import CarRental.dto.booking.BookingRequest;
import CarRental.dto.booking.BookingResponse;
import CarRental.dto.booking.BookingResponseBasic;
import CarRental.dto.search.SearchRequest;
import CarRental.models.booking.BookingStatus;
import CarRental.models.booking.Decision;
import CarRental.models.payment.PaymentType;
import CarRental.services.booking.BookingService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/booking")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<BookingResponseBasic> createBooking(@ModelAttribute BookingRequest bookingRequest) {
        return ResponseEntity.ok().body(bookingService.createBooking(bookingRequest));
    }

    @PutMapping("/edit")
    public ResponseEntity<Void> editBooking(@ModelAttribute BookingRequest bookingRequest) {
        bookingService.editBooking(bookingRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/owner-confirm/{bookingId}")
    public ResponseEntity<Void> ownerConfirmBooking(@PathVariable Long bookingId, @RequestParam Decision decision) {
        bookingService.confirmBooking(bookingId, decision);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pay-deposit/init/{bookingId}")
    public ResponseEntity<?> getPayment(@PathVariable Long bookingId) {
        return ResponseEntity.ok().body(bookingService.getDepositPayment(bookingId));
    }

    @PutMapping("/pay-deposit/{bookingId}/{type}")
    public ResponseEntity<?> payForBooking(@PathVariable Long bookingId, @PathVariable PaymentType type) {
        switch (type) {
            case BANKING:
                return ResponseEntity.ok().body(bookingService.payDepositByBanking(bookingId));
            case CASH:
                return ResponseEntity.ok().body(bookingService.payDepositByCash(bookingId));
            case WALLET:
            default:
                return ResponseEntity.ok().body(bookingService.payDepositByWallet(bookingId));
        }

    }

    @GetMapping("/pay-payment/init/{bookingId}")
    public ResponseEntity<?> getPaymentForRemaining(@PathVariable Long bookingId) {
        return ResponseEntity.ok().body(bookingService.getRemainingPayment(bookingId));
    }

    @PutMapping("/pay-payment/{bookingId}/{type}")
    public ResponseEntity<?> payForTheRemaining(@PathVariable Long bookingId, @PathVariable PaymentType type) {
        return ResponseEntity.ok().body(bookingService.payRemainingByWallet(bookingId));
    }

    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-bookings")
    public ResponseEntity<Page<BookingResponseBasic>> getMyBookings(
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) List<BookingStatus> statuses) {
        Sort.Direction direction = (sortOrder.equalsIgnoreCase("asc")) ? Direction.ASC : Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, direction, sortBy);
        return ResponseEntity.ok().body(bookingService.getBookingsByUser(statuses, pageable));
    }

    @GetMapping("/user-booking/{bookingId}")
    public ResponseEntity<BookingResponse> getMyBookingById(@PathVariable Long bookingId) {
        return ResponseEntity.ok().body(bookingService.getBookingResponseBookingId(bookingId));
    }

    @PutMapping("/confirm-pick-up/{bookingId}")
    public ResponseEntity<Void> confirmPickUp(@PathVariable Long bookingId) {
        bookingService.confirmPickUp(bookingId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/return-car/{bookingId}")
    public ResponseEntity<BookingStatus> returnCar(@PathVariable Long bookingId) {
        return new ResponseEntity<>(bookingService.returnCar(bookingId), HttpStatus.OK);
    }

    @GetMapping("/get/number/pending-booking")
    public ResponseEntity<Integer> getNumberOfPendingBookings(
            @RequestParam(value = "carId", required = false) Long carId) {
        return new ResponseEntity<>(bookingService.calculateNumberOfPendingBooking(carId), HttpStatus.OK);
    }

    @GetMapping("/get/number/inprogress-booking")
    public ResponseEntity<Integer> getNumberOfInProgressBookings(
            @RequestParam(value = "carId", required = false) Long carId) {
        return new ResponseEntity<>(bookingService.calculateNumberOfInProgressBookingByCarId(carId), HttpStatus.OK);
    }

    @PostMapping("/get/all/booking")
    public ResponseEntity<Page<BookingResponseBasic>> getAllBookingsByUser(
            @RequestBody SearchRequest searchRequest,
            Pageable pageable) {
        return new ResponseEntity<>(bookingService.getAllBookings(searchRequest, pageable), HttpStatus.OK);
    }

    @GetMapping("/get/all/bookings-overlap-time/{bookingId}")
    public ResponseEntity<List<Long>> getAllBookingsOverlapItem(
            @PathVariable Long bookingId,
            @RequestParam(value = "status") BookingStatus bookingStatus) {
        return new ResponseEntity<>(bookingService.getAllBookingsOverlappedTime(bookingId, bookingStatus),
                HttpStatus.OK);
    }

    @GetMapping("/get/booking-overlap-time/pending")
    public ResponseEntity<BookingResponseBasic> getBookingByUserIdAndOverlappTimeBooking(
            @RequestParam(value = "start") LocalDateTime start,
            @RequestParam(value = "end") LocalDateTime end) {
        return new ResponseEntity<>(bookingService.findBookingByUserIdAndOverlapTimeBooking(start, end), HttpStatus.OK);
    }
}
