package CarRental.services.booking.impl;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import CarRental.dto.booking.BookingRequest;
import CarRental.dto.booking.BookingResponse;
import CarRental.dto.booking.BookingResponseBasic;
import CarRental.dto.payment.BankPaymentInitResponse;
import CarRental.dto.payment.PaymentInitResponse;
import CarRental.dto.search.SearchRequest;
import CarRental.exception.BookingResourceException;
import CarRental.exception.ForbiddenOperationException;
import CarRental.exception.InvalidOperationException;
import CarRental.exception.InvalidStepException;
import CarRental.models.booking.Booking;
import CarRental.models.booking.BookingStatus;
import CarRental.models.booking.Decision;
import CarRental.models.car.CarBasic;
import CarRental.models.car.enums.CarStatus;
import CarRental.models.location.Ward;
import CarRental.models.payment.PaymentType;
import CarRental.models.payment.Wallet;
import CarRental.models.specification.GenericSpecification;
import CarRental.models.user.User;
import CarRental.repositories.booking.BookingRepository;
import CarRental.repositories.car.CarBasicRepository;
import CarRental.repositories.user.UserRepository;
import CarRental.services.booking.BookingService;
import CarRental.services.car.CarBasicService;
import CarRental.services.car.CarBusyCalendarService;
import CarRental.services.email.EmailService;
import CarRental.services.image.ImageService;
import CarRental.services.location.LocationService;
import CarRental.services.user.UserService;
import CarRental.services.wallet.TransactionService;
import CarRental.utils.mapper.booking.BookingResponseMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final CarBasicRepository carBasicRepository;
    private final UserService userService;
    private final BookingRepository bookingRepository;
    private final BookingResponseMapper bookingResponseMapper;
    private final TransactionService transactionService;
    private final ImageService imageService;
    private final LocationService locationService;
    private final CarBasicService carService;
    private final EmailService emailService;
    private final CarBusyCalendarService calendarService;
    private final UserRepository userRepository;

    @Override
    public BookingResponse getBookingResponseBookingId(Long id) {
        return bookingResponseMapper.mapFrom(getBookingById(id));
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElseThrow(
                () -> new BookingResourceException("Booking not found"));
    }

    @Override
    public Page<BookingResponseBasic> getBookingsByUser(List<BookingStatus> statuses, Pageable pageable) {
        var user = userService.getUserFromSecurityContext();
        return bookingRepository.findBookingByStatusAndUser(statuses, user, pageable)
                .map(bookingResponseMapper::mapFromBasic);
    }

    @Override
    public BookingResponseBasic createBooking(BookingRequest bookingRequest) {
        var user = userService.getUserFromSecurityContext();
        CarBasic car = carService.getCarBasicById(bookingRequest.carId());
        // check if the car owner is the same as the user
        if (car.getOwner().equals(user)) {
            throw new InvalidOperationException("Can't book your own car.");
        }
        // check in calendar
        carService.validateCarAvailabilityToBooking(bookingRequest.carId(), bookingRequest.pickUpDateTime(),
                bookingRequest.returnDateTime());

        Ward pickupWard = locationService.getWardById(bookingRequest.pickUpWardId());
        Ward driverWard = locationService.getWardById(bookingRequest.driverWardId());
        Ward renterWard = locationService.getWardById(bookingRequest.renterWardId());

        int numberOfDay = getNumberOfDaysOfBooking(car, bookingRequest.pickUpDateTime(),
                bookingRequest.returnDateTime());
        BigDecimal basePrice = car.getCarPricingEntity().getBasePrice();

        new Booking();

        Booking booking = Booking.builder()
                .car(car)
                .user(user)
                // renter information
                .renterFirstName(bookingRequest.renterFirstName())
                .renterLastName(bookingRequest.renterLastName())
                .renterEmail(bookingRequest.renterEmail())
                .renterPhone(bookingRequest.renterPhone())
                .renterDob(bookingRequest.renterDob())
                .renterNationalId(bookingRequest.renterNationalId())
                .renterWard(renterWard)
                .renterLocation(bookingRequest.renterLocation())

                // driver information
                .driverFirstName(bookingRequest.driverFirstName())
                .driverLastName(bookingRequest.driverLastName())
                .driverEmail(bookingRequest.driverEmail())
                .driverPhone(bookingRequest.driverPhone())
                .driverDob(bookingRequest.driverDob())
                .driverNationalId(bookingRequest.driverNationalId())
                .driverWard(driverWard)
                .driverLocation(bookingRequest.driverLocation())
                .pickUpAt(bookingRequest.pickUpDateTime())
                .returnAt(bookingRequest.returnDateTime())
                .pickUpWard(pickupWard)
                .pickUpLocation(bookingRequest.pickUpLocation())
                .basePrice(basePrice)
                .numberOfDays(numberOfDay)
                .total(basePrice.multiply(BigDecimal.valueOf(numberOfDay)))
                .createdAt(LocalDateTime.now())
                .cancelledAt(LocalDateTime.now().plusHours(car.getAutoCancelHoursAfterPending()))
                .status(BookingStatus.PENDING)
                .renterMessage("The booking is created and waiting for confirmation")
                .carOwnerMessage("The booking is created and waiting for confirmation")
                .build();
        booking.setDeposit(car.getCarPricingEntity().getRequiredDeposit());
        var createdBooking = bookingRepository.save(booking);

        // upload images (not required)
        if (bookingRequest.driverDriverLicense() != null) {
            createdBooking.setDriverLicenseImageKey("booking_driver_license_" + createdBooking.getId());
            imageService.uploadImage(bookingRequest.driverDriverLicense(), createdBooking.getDriverLicenseImageKey());
        }
        if (bookingRequest.renterDriverLicense() != null) {
            createdBooking.setRenterLicenseImageKey("booking_renter_license_" + createdBooking.getId());
            imageService.uploadImage(bookingRequest.renterDriverLicense(), createdBooking.getRenterLicenseImageKey());
        }
        bookingRepository.save(createdBooking);
        emailService.sendBookingConfirmationEmail(createdBooking, user, car.getOwner());
        return bookingResponseMapper.mapFromBasic(createdBooking);
    }

    @Override
    public void editBooking(BookingRequest bookingRequest) {
        var booking = getBookingById(bookingRequest.id());
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidStepException("Can't edit booking that is not pending.");
        }
        carService.validateCarAvailabilityToBooking(bookingRequest.carId(), bookingRequest.pickUpDateTime(),
                bookingRequest.returnDateTime());
        Ward pickupWard = locationService.getWardById(bookingRequest.pickUpWardId());
        Ward driverWard = locationService.getWardById(bookingRequest.driverWardId());
        Ward renterWard = locationService.getWardById(bookingRequest.renterWardId());
        // renter information
        booking.setRenterFirstName(bookingRequest.renterFirstName());
        booking.setRenterLastName(bookingRequest.renterLastName());
        booking.setRenterEmail(bookingRequest.renterEmail());
        booking.setRenterPhone(bookingRequest.renterPhone());
        booking.setRenterDob(bookingRequest.renterDob());
        booking.setRenterNationalId(bookingRequest.renterNationalId());
        booking.setRenterWard(renterWard);
        booking.setRenterLocation(bookingRequest.renterLocation());
        // driver information
        booking.setDriverFirstName(bookingRequest.driverFirstName());
        booking.setDriverLastName(bookingRequest.driverLastName());
        booking.setDriverEmail(bookingRequest.driverEmail());
        booking.setDriverPhone(bookingRequest.driverPhone());
        booking.setDriverDob(bookingRequest.driverDob());
        booking.setDriverNationalId(bookingRequest.driverNationalId());
        booking.setDriverWard(driverWard);
        booking.setDriverLocation(bookingRequest.driverLocation());
        // booking information
        booking.setPickUpAt(bookingRequest.pickUpDateTime());
        booking.setReturnAt(bookingRequest.returnDateTime());
        booking.setNumberOfDays(getNumberOfDaysOfBooking(booking.getCar(), bookingRequest.pickUpDateTime(),
                bookingRequest.returnDateTime()));
        booking.setPickUpWard(pickupWard);
        booking.setPickUpLocation(bookingRequest.pickUpLocation());
        // update image if it is not null
        if (bookingRequest.driverDriverLicense() != null) {
            if (booking.getDriverLicenseImageKey() == null) {
                booking.setDriverLicenseImageKey("booking_driver_license_" + booking.getId());
            }
            imageService.uploadImage(bookingRequest.driverDriverLicense(), booking.getDriverLicenseImageKey());
        }
        if (bookingRequest.renterDriverLicense() != null) {
            if (booking.getRenterLicenseImageKey() == null) {
                booking.setRenterLicenseImageKey("booking_renter_license_" + booking.getId());
            }
            imageService.uploadImage(bookingRequest.renterDriverLicense(), booking.getRenterLicenseImageKey());
        }
        bookingRepository.save(booking);
    }

    @Override
    public void confirmBooking(Long bookingId, Decision decision) {
        var booking = getBookingById(bookingId);
        validateCarOwner(booking);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidStepException("Can't confirm booking that is not pending.");
        }
        carService.validateCarAvailabilityToBooking(booking.getCar().getId(),
                booking.getPickUpAt(),
                booking.getReturnAt());

        switch (decision) {
            case ACCEPTED:
                acceptBooking(booking);
                break;
            case DECLINED:
                declineBooking(booking);
                break;
        }
    }

    private void acceptBooking(Booking booking) {
        CarBasic car = booking.getCar();

        car.setStatus(CarStatus.IN_USE);
        booking.setCancelledAt(LocalDateTime.now().plusHours(car.getAutoCancelHoursAfterConfirmation()));
        if (booking.getDeposit().compareTo(BigDecimal.ZERO) > 0) {
            booking.setStatus(BookingStatus.PENDING_DEPOSIT);
            booking.setCarOwnerMessage("The booking is accepted and waiting for deposit payment.");
        } else {
            booking.setStatus(BookingStatus.PENDING_PICK_UP);
            booking.setCarOwnerMessage("The booking is accepted and waiting for pick up confirmation.");
        }
        // decline other booking which is overlapped
        List<Booking> otherBookings = bookingRepository.findPendingBookingByAndBookingIdDifferentCarIdAndTimeRange(
                booking.getId(), booking.getCar().getId(), BookingStatus.PENDING,
                booking.getPickUpAt(),
                booking.getReturnAt());
        // add the busy period to the car busy calendar
        emailService.sendAcceptedBookingEmail(booking, booking.getUser(),
                booking.getCar().getOwner());

        booking = bookingRepository.save(booking);

        calendarService.addCarBusyTime(booking.getCar().getId(),
                booking.getPickUpAt(), booking.getReturnAt(), booking);
        otherBookings.stream().forEach(b -> declineBooking(b));

    }

    private void declineBooking(Booking booking) {
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setRenterMessage("The booking is declined by car owner.");
        emailService.sendDeclinedBookingEmail(booking, booking.getUser(),
                booking.getCar().getOwner());
        // bookingRepository.save(booking);

    }

    @Scheduled(cron = "0 */10 * * * *") // The task will run every 10 minutes
    public void autoCancelBooking() {
        List<BookingStatus> statuses = List.of(BookingStatus.PENDING, BookingStatus.PENDING_DEPOSIT);
        List<Booking> bookings = bookingRepository.findBookingByStatusInAndCancelledAtBefore(statuses,
                LocalDateTime.now());
        bookings.stream().forEach(booking -> {
            switch (booking.getStatus()) {
                case PENDING:
                    booking.setStatus(BookingStatus.CANCELLED);
                    booking.setRenterMessage(
                            "The booking is canceled because car owner doesn't confirm the booking in time.");
                    break;
                case PENDING_DEPOSIT:
                    booking.setStatus(BookingStatus.CANCELLED);
                    booking.setRenterMessage(
                            "The booking is cancelled because renter doesn't pay the deposit in time.");
                    break;
                default:
                    break;
            }
            bookingRepository.save(booking);
            emailService.sendAutoBookingCancelledEmail(booking, booking.getUser(), booking.getCar().getOwner());
        });
    }

    @Override
    public PaymentInitResponse getDepositPayment(Long bookingId) {
        var booking = getBookingById(bookingId);
        validateBookingOwner(booking);
        User user = userService.getUserFromSecurityContext();
        Wallet wallet = user.getWallet();
        if (booking.getStatus() != BookingStatus.PENDING_DEPOSIT) {
            throw new InvalidStepException("Can't make payment for booking that is not pending deposit.");
        }
        var payment = PaymentInitResponse
                .builder()
                .paymentTypesAvailable(List.of(PaymentType.WALLET, PaymentType.BANKING, PaymentType.CASH))
                .availableBalance(wallet.getAvailableBalance())
                .bookingId(booking.getId())
                .amount(booking.getDeposit())
                .build();
        return payment;
    }

    @Override
    public BookingResponseBasic payDepositByWallet(Long bookingId) {
        var booking = getBookingById(bookingId);
        validateBookingStatusForDeposit(booking);
        User carOwner = booking.getCar().getOwner();
        String message = "Booking deposit for booking id: " + booking.getId();
        var depositTransactionId = transactionService.transfer(booking.getUser(), carOwner, booking.getDeposit(),
                message, bookingId);
        booking.setDepositTransactionId(depositTransactionId);
        booking.setStatus(BookingStatus.PENDING_PICK_UP);
        booking.setPaymentType(PaymentType.WALLET);
        booking.setRenterMessage("The deposit is paid and waiting for pick up confirmation");
        booking.setCarOwnerMessage("Check your wallet to see the deposit amount.");
        bookingRepository.save(booking);
        // send email to car owner to check the wallet
        emailService.sendBookingDepositConfirmationEmail(booking, booking.getUser(), carOwner);
        return bookingResponseMapper.mapFromBasic(booking);
    }

    @Override
    public BankPaymentInitResponse payDepositByBanking(Long bookingId) {
        // This is the feature that we will implement in the future
        var booking = getBookingById(bookingId);
        validateBookingStatusForDeposit(booking);
        booking.setPaymentType(PaymentType.BANKING);
        booking.setStatus(BookingStatus.PENDING_DEPOSIT);
        bookingRepository.save(booking);
        return null;
    }

    @Override
    public BookingResponseBasic payDepositByCash(Long bookingId) {
        var booking = getBookingById(bookingId);
        validateBookingStatusForDeposit(booking);
        booking.setStatus(BookingStatus.PENDING_PICK_UP);
        booking.setPaymentType(PaymentType.CASH);
        bookingRepository.save(booking);
        return bookingResponseMapper.mapFromBasic(booking);
    }

    private void validateBookingStatusForDeposit(Booking booking) {
        if (booking.getStatus() != BookingStatus.PENDING_DEPOSIT) {
            throw new InvalidStepException("Can't pay deposit for booking that is not pending deposit.");
        }
    }

    @Override
    public void confirmDeposit(Long bookingId) {
        var booking = getBookingById(bookingId);
        validateCarOwner(booking);
        if (booking.getStatus() != BookingStatus.PENDING_DEPOSIT) {
            throw new InvalidStepException("Can't confirm deposit for booking that is not pending deposit.");
        }
        booking.setStatus(BookingStatus.PENDING_PICK_UP);
        bookingRepository.save(booking);
    }

    @Override
    public void confirmPickUp(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        validateCarOwner(booking);
        if (booking.getStatus() != BookingStatus.PENDING_PICK_UP
                && !(booking.getStatus() == BookingStatus.PENDING_DEPOSIT
                        && booking.getPaymentType() != PaymentType.WALLET)) {
            throw new InvalidStepException("Can't confirm pick up for booking that is not pending pick up.");
        }
        booking.setStatus(BookingStatus.IN_PROGRESS);
        booking.setActualPickUpAt(LocalDateTime.now());

        emailService.sendBookingPickUpConfirmationEmail(booking, booking.getUser(), booking.getCar().getOwner());

        booking = bookingRepository.save(booking);
        var car = booking.getCar();
        car.setStatus(CarStatus.IN_USE);
        carBasicRepository.save(car);
    }

    @Override
    public BookingStatus returnCar(Long bookingId) {
        User user = userService.getUserFromSecurityContext();
        Booking booking = getBookingById(bookingId);
        validateCarOwner(booking);

        if (booking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new InvalidStepException("Can't return car for booking that is not in progress.");
        }
        // handle if the payment method is wallet
        if (booking.getPaymentType() == PaymentType.WALLET) {
            // complete the deposit transaction
            transactionService.completeTransfer(booking.getDepositTransactionId());
            // check the different between deposit and total
            BigDecimal different = booking.getTotal().subtract(booking.getDeposit());
            if (different.compareTo(BigDecimal.ZERO) > 0) {
                // change the status to pending payment
                booking.setStatus(BookingStatus.PENDING_PAYMENT);

            } else if (different.compareTo(BigDecimal.ZERO) < 0) {
                // make a new transaction to return the difference to the user
                String message = "Offset the difference of the payment for booking id: " + booking.getId();
                var paymentTransactionId = transactionService.transfer(booking.getCar().getOwner(), booking.getUser(),
                        different.abs(), message, bookingId);
                booking.setPaymentTransactionId(paymentTransactionId);
                transactionService.completeTransfer(paymentTransactionId);
                booking.setStatus(BookingStatus.COMPLETED);
            }
        } else {
            booking.setStatus(BookingStatus.COMPLETED);
        }
        booking.setActualReturnAt(LocalDateTime.now());
        // Update the busy time of the car
        calendarService.updateCarBusyTimeRelatedToBooking(booking, booking.getActualPickUpAt(),
                booking.getActualReturnAt());
        bookingRepository.save(booking);
        emailService.sendBookingReturnCarConfirmationEmail(booking, booking.getUser(), booking.getCar().getOwner());
        var car = booking.getCar();
        car.setNoRides(car.getNoRides() + 1);
        car.setStatus(CarStatus.AVAILABLE);
        user.setNoBooking(user.getNoBooking() + 1);

        carBasicRepository.save(car);
        userRepository.save(user);
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            return BookingStatus.COMPLETED;
        } else {
            return BookingStatus.PENDING_PAYMENT;
        }
    }

    @Override
    public PaymentInitResponse getRemainingPayment(Long bookingId) {
        var booking = getBookingById(bookingId);
        validateBookingOwner(booking);
        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new InvalidStepException("Can't make payment for booking that is not pending payment.");
        }
        User user = booking.getUser();
        Wallet wallet = user.getWallet();
        var payment = PaymentInitResponse
                .builder()
                .paymentTypesAvailable(List.of(PaymentType.WALLET))
                .availableBalance(wallet.getAvailableBalance())
                .bookingId(booking.getId())
                .amount(booking.getTotal().subtract(booking.getDeposit()))
                .build();
        return payment;
    }

    @Override
    public BookingResponseBasic payRemainingByWallet(Long bookingId) {
        // check the booking status
        var booking = getBookingById(bookingId);
        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new InvalidStepException("Can't pay the payment for booking that is not pending payment.");
        }
        // check the available balance of the renter's wallet
        var renter = booking.getUser();
        var userWallet = renter.getWallet();
        BigDecimal amount = booking.getTotal().subtract(booking.getDeposit());
        if (userWallet.getAvailableBalance().compareTo(amount) < 0) {
            // if the available balance is not enough change the status to pending payment
            booking.setStatus(BookingStatus.PENDING_PAYMENT);
            // Mail to user to top up the wallet
        } else {
            // auto transfer the money from the renter to the car owner
            String message = "Payment for booking id: " + booking.getId();
            var paymentTransactionId = transactionService.transfer(renter, booking.getCar().getOwner(), amount, message,
                    bookingId);
            booking.setPaymentTransactionId(paymentTransactionId);
            transactionService.completeTransfer(paymentTransactionId);
            booking.setStatus(BookingStatus.COMPLETED);
            // Mail to renter and car owner

        }
        bookingRepository.save(booking);
        return bookingResponseMapper.mapFromBasic(booking);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        var createdBooking = getBookingById(bookingId);
        validateBookingOwner(createdBooking);
        if (createdBooking.getStatus() == BookingStatus.IN_PROGRESS
                || createdBooking.getStatus() == BookingStatus.COMPLETED
                || createdBooking.getStatus() == BookingStatus.CANCELLED) {
            throw new InvalidStepException(
                    "Can't cancel booking that is not pending or pending deposit or pending pick up.");
        }
        calendarService.deleteCarBusyTimeRelatedToBooking(createdBooking);
        // if the deposit transaction is not null, refund the deposit
        if (createdBooking.getDepositTransactionId() != null) {
            transactionService.refundTransfer(createdBooking.getDepositTransactionId());
        }
        createdBooking.setStatus(BookingStatus.CANCELLED);

        CarBasic car = createdBooking.getCar();
        car.setStatus(CarStatus.AVAILABLE);
        createdBooking.setCancelledAt(LocalDateTime.now());
        createdBooking.setCarOwnerMessage(
                "The booking is cancelled by renter because renter doesn't want to rent the car anymore.");
        carBasicRepository.save(car);
        bookingRepository.save(createdBooking);
        emailService.sendBookingCancelledEmail(createdBooking, createdBooking.getUser(),
                createdBooking.getCar().getOwner());
    }

    private void validateBookingOwner(Booking booking) throws ForbiddenOperationException {
        var currentUser = userService.getUserFromSecurityContext();
        if (booking.getUser().getId() != currentUser.getId()) {
            throw new ForbiddenOperationException("User is not the owner of the booking.");
        }
    }

    private void validateCarOwner(Booking booking) throws ForbiddenOperationException {
        var currentUser = userService.getUserFromSecurityContext();
        if (booking.getCar().getOwner().getId() != currentUser.getId()) {
            throw new ForbiddenOperationException("User is not the owner of the car.");
        }
    }

    public int getNumberOfDaysOfBooking(CarBasic car, LocalDateTime startDate, LocalDateTime endDate) {
        var carPrice = car.getCarPricingEntity();
        double days = 0;
        Duration duration = Duration.between(startDate, endDate);
        days = duration.toSeconds() / (24 * 60 * 60);
        switch (carPrice.getBasePriceMethod()) {
            case BONUS_HALF_DAY:
                days = days - 0.5;
                break;
            case NOT_BONUS_HALF_DAY:
                break;
        }
        return (int) Math.ceil(days);
    }

    @Override
    public int calculateNumberOfPendingBooking(Long carId) {
        User user = userService.getUserFromSecurityContext();
        if (carId != null) {
            carService.validateCarOwner(carId, user);
        }
        return bookingRepository.countPendingBookingByCarOwnerId(user.getId(), carId);
    }

    @Override
    public int calculateNumberOfInProgressBookingByCarId(Long carId) {
        User user = userService.getUserFromSecurityContext();
        if (carId != null) {
            carService.validateCarOwner(carId, user);
        }
        return bookingRepository.countInProgressBookingByCarId(carId);
    }

    @Override
    public Page<BookingResponseBasic> getAllBookings(SearchRequest searchRequest, Pageable pageable) {
        User user = userService.getUserFromSecurityContext();
        Specification<Booking> spec = new GenericSpecification<>(searchRequest, user);
        pageable = PageRequest.of(searchRequest.getPagination().page, searchRequest.getPagination().size);
        Page<Booking> bookings = bookingRepository.findAll(spec, pageable);
        return bookings.map(bookingResponseMapper::mapFromBasic);
    }

    @Override
    public List<Long> getAllBookingsOverlappedTime(Long bookingId, BookingStatus status) {
        Booking booking = getBookingById(bookingId);
        List<Long> findList = new ArrayList<>();
        List<Booking> list = bookingRepository.findPendingBookingByAndBookingIdDifferentCarIdAndTimeRange(bookingId,
                booking.getCar().getId(), booking.getStatus(), booking.getPickUpAt(), booking.getReturnAt());
        for (int i = 0; i < list.size(); i++) {
            findList.add(list.get(i).getId());
        }
        return findList;
    }

    @Override
    public BookingResponseBasic findBookingByUserIdAndOverlapTimeBooking(LocalDateTime start, LocalDateTime end) {
        User user = userService.getUserFromSecurityContext();
        if (bookingRepository.findBookingByUserIdAndOverlappTime(user.getId(), start, end) != null)
            return bookingResponseMapper
                    .mapFromBasic(bookingRepository.findBookingByUserIdAndOverlappTime(user.getId(), start, end));
        else
            return null;
    }

}
