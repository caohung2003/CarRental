package CarRental.services.rating;

import CarRental.dto.rating.RatingDto;
import CarRental.models.rating.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface RatingService {
        public Page<RatingDto> getAllRatingsByCarId(Long carId, Pageable pageable);

        public Page<RatingDto> getAllRenterRatingsByUserId(Long userId, Pageable pageable);

        public Page<RatingDto> getAllOwnerRatingsByUserId(Long userId, Pageable pageable);

        public void updateCarRating(Long carId);

        public RatingDto save(Rating rating);

        public void updateUserRating(Long userId);

        public List<RatingDto> getAllRatingsByBookingId(Long bookingId);

        public List<Object[]> getNumberOfStarsReceivedRatingAsCOByTime(LocalDateTime start, LocalDateTime end);

        public List<Object[]> getNumberOfStarsReceivedRatingAsRenterByTime(LocalDateTime start, LocalDateTime end);

        public Page<RatingDto> getCarOwnerRatingByTime(Integer star, String sort, String order, LocalDateTime start,
                        LocalDateTime end,
                        Pageable pageable);

        public Page<RatingDto> getRenterRatingByTime(Integer star, String sort, String order, LocalDateTime start,
                        LocalDateTime end,
                        Pageable pageable);

        public List<Object[]> getAvgRateReceivedAsCOBy5Months();

        public List<Object[]> getAvgRateReceivedAsRenterBy5Months();

}
