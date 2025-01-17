package CarRental.repositories.rating;

import CarRental.models.rating.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
        @Query("SELECT r FROM Rating r WHERE r.booking.id = :bookingId")
        public List<Rating> getRatingByBookingId(@Param("bookingId") Long bookingId);

        @Query("SELECT r FROM Rating r WHERE r.carBasic.id = :carId AND r.isRenterFeedback = true ORDER BY r.dateTime")
        public Page<Rating> getRatingByCarId(@Param("carId") Long carId, Pageable pageable);

        @Query("SELECT r FROM Rating r WHERE r.receiver.id = :userId AND r.isRenterFeedback = true ORDER BY r.dateTime")
        public Page<Rating> getRenterRatingByUserId(@Param("userId") Long userId, Pageable pageable);

        @Query("SELECT r FROM Rating r WHERE r.receiver.id = :userId AND r.isRenterFeedback = false ORDER BY r.dateTime")
        public Page<Rating> getOwnerRatingByUserId(@Param("userId") Long userId, Pageable pageable);

        @Query("SELECT ROUND(SUM(r.stars) / COUNT(r), 1) AS avg FROM Rating r WHERE r.carBasic.id = :carId AND r.isRenterFeedback = true")
        public Double getAvgRateReceivedByCarId(@Param("carId") Long carId);

        @Query("SELECT ROUND(SUM(r.stars) / COUNT(r), 1) AS avg FROM Rating r WHERE r.receiver.id = :userId")
        public Double getAvgRateReceivedByUserId(@Param("userId") Long userId);

        @Query("SELECT r.stars, COUNT(r) FROM Rating r WHERE r.dateTime >= :start AND r.dateTime <= :end AND r.receiver.id = :userId AND r.isRenterFeedback = true GROUP BY r.stars")
        public List<Object[]> getNumberOfStarsReceivedRatingAsCOByTime(
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end,
                        @Param("userId") Long userId);

        @Query("SELECT r.stars, COUNT(r) FROM Rating r WHERE r.dateTime >= :start AND r.dateTime <= :end AND r.receiver.id = :userId AND r.isRenterFeedback = false GROUP BY r.stars")
        public List<Object[]> getNumberOfStarsReceivedRatingAsRenterByTime(
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end,
                        @Param("userId") Long userId);

        @Query("SELECT r FROM Rating r WHERE r.dateTime >= :start AND r.dateTime <= :end AND r.receiver.id = :userId AND (:star = 0 OR r.stars = :star) AND r.isRenterFeedback = true")
        public Page<Rating> getRatingReceivedAsCOByTime(
                        @Param("star") Integer star,
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end,
                        @Param("userId") Long userId,
                        Pageable pageable);

        @Query("SELECT r FROM Rating r WHERE r.dateTime >= :start AND r.dateTime <= :end AND r.receiver.id = :userId AND (:star = 0 OR r.stars = :star) AND r.isRenterFeedback = false")
        public Page<Rating> getRatingReceivedAsRenterByTime(
                        @Param("star") Integer star,
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end,
                        @Param("userId") Long userId,
                        Pageable pageable);

        @Query("SELECT MONTH(r.dateTime), ROUND(SUM(r.stars) / COUNT(r), 1) AS avg FROM Rating r WHERE r.receiver.id = :userId AND r.isRenterFeedback = true AND MONTH(CURRENT_DATE()) - MONTH(r.dateTime) <= 5 GROUP BY MONTH(r.dateTime) ORDER BY MONTH(r.dateTime) ASC")
        public List<Object[]> getAvgRateReceivedAsCOBy5Months(
                        @Param("userId") Long userId);

        @Query("SELECT MONTH(r.dateTime), ROUND(SUM(r.stars) / COUNT(r), 1) AS avg FROM Rating r WHERE r.receiver.id = :userId AND r.isRenterFeedback = false AND MONTH(CURRENT_DATE()) - MONTH(r.dateTime) <= 5 GROUP BY MONTH(r.dateTime) ORDER BY MONTH(r.dateTime) ASC")
        public List<Object[]> getAvgRateReceivedAsRenterBy5Months(
                        @Param("userId") Long userId);

}
