package CarRental.services.booking;

import java.time.LocalDateTime;
import java.util.List;

import CarRental.dto.search.SearchRequest;
import CarRental.models.booking.Decision;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import CarRental.dto.booking.BookingRequest;
import CarRental.dto.booking.BookingResponse;
import CarRental.dto.booking.BookingResponseBasic;
import CarRental.dto.payment.BankPaymentInitResponse;
import CarRental.dto.payment.PaymentInitResponse;
import CarRental.models.booking.Booking;
import CarRental.models.booking.BookingStatus;
import CarRental.models.car.CarBasic;

public interface BookingService {
    public BookingResponseBasic createBooking(BookingRequest bookingRequest);

    public BookingResponse getBookingResponseBookingId(Long id);

    public Booking getBookingById(Long id);

    public void editBooking(BookingRequest bookingRequest);

    public void cancelBooking(Long bookingId);

    public PaymentInitResponse getDepositPayment(Long bookingId);

    public BookingResponseBasic payDepositByWallet(Long bookingId);

    public BankPaymentInitResponse payDepositByBanking(Long bookingId);

    public BookingResponseBasic payDepositByCash(Long bookingId);

    public PaymentInitResponse getRemainingPayment(Long bookingId);

    public BookingResponseBasic payRemainingByWallet(Long bookingId);

    public Page<BookingResponseBasic> getBookingsByUser(List<BookingStatus> statuses, Pageable pageable);

    public int getNumberOfDaysOfBooking(CarBasic car, LocalDateTime startDate, LocalDateTime endDate);

    public void confirmDeposit(Long bookingId);

    public void confirmPickUp(Long bookingId);

    public BookingStatus returnCar(Long bookingId);

    public void confirmBooking(Long bookingId, Decision decision);

    public void autoCancelBooking();

    public int calculateNumberOfPendingBooking(Long carId);

    public int calculateNumberOfInProgressBookingByCarId(Long carId);

    public Page<BookingResponseBasic> getAllBookings(SearchRequest searchRequest, Pageable pageable);

    public List<Long> getAllBookingsOverlappedTime(Long bookingId, BookingStatus status);

    public BookingResponseBasic findBookingByUserIdAndOverlapTimeBooking(LocalDateTime start, LocalDateTime end);

}