package CarRental.repositories.booking;

import CarRental.models.booking.Booking;
import CarRental.models.booking.BookingStatus;
import CarRental.models.car.CarBasic;
import CarRental.models.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
        public List<Booking> findBookingByStatusAndCreatedAtBefore(BookingStatus status, LocalDateTime createdAt);

        @Query("SELECT b FROM Booking b WHERE (:statuses IS NULL OR b.status IN :statuses) AND b.user = :user")
        public Page<Booking> findBookingByStatusAndUser(@Param("statuses") List<BookingStatus> statuses,
                        @Param("user") User user,
                        Pageable pageable);

        @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'PENDING' AND b.car.owner.id = :userId AND (:carId IS NULL OR b.car.id = :carId)")
        public int countPendingBookingByCarOwnerId(@Param("userId") Long userId, @Param("carId") Long carId);

        @Query("SELECT COUNT(b) FROM Booking b WHERE b.status != 'COMPLETED' AND b.status != 'CANCELED' AND  b.car.id = :carId")
        public int countInProgressBookingByCarId(@Param("carId") Long carId);

        public List<Booking> findBookingByCarAndStatus(CarBasic car, BookingStatus status);

        // Find all bookings with status in the list and cancelledAt before the given
        // date
        public List<Booking> findBookingByStatusInAndCancelledAtBefore(List<BookingStatus> statuses,
                        LocalDateTime cancelledAt);

        public Page<Booking> findAll(Specification<Booking> specification, Pageable pageable);

        @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status = 'PENDING' AND " +
                        "((b.pickUpAt <= :start AND b.returnAt >= :start) OR " +
                        "(:start <= b.pickUpAt AND :end >= b.pickUpAt)) ORDER BY b.id LIMIT 1")
        public Booking findBookingByUserIdAndOverlappTime(
                        @Param("userId") Long userId,
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end);

        @Query("SELECT b FROM Booking b WHERE b.id != :booking AND :car = b.car.id AND b.status = :status AND " +
                        "((b.pickUpAt <= :start AND b.returnAt >= :start) OR " +
                        "(:start <= b.pickUpAt AND :end >= b.pickUpAt))")
        public List<Booking> findPendingBookingByAndBookingIdDifferentCarIdAndTimeRange(
                        @Param("booking") Long bookingId,
                        @Param("car") Long carId,
                        @Param("status") BookingStatus status,
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end);

}
