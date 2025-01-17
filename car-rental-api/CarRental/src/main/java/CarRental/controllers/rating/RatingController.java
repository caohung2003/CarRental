package CarRental.controllers.rating;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import CarRental.dto.rating.RatingDto;
import CarRental.models.rating.Rating;
import CarRental.services.rating.RatingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rating")
public class RatingController {
    private final RatingService ratingService;

    @GetMapping("/get-renter/by/car/{carId}")
    public ResponseEntity<Page<RatingDto>> getAllRatingsByCarId(@PathVariable Long carId, Pageable pageable) {

        return new ResponseEntity<>(ratingService.getAllRatingsByCarId(carId, pageable), HttpStatus.OK);
    }

    @GetMapping("/get-renter/by/user/{userId}")
    public ResponseEntity<Page<RatingDto>> getAllRenterRatingsByOwnerId(@PathVariable Long userId, Pageable pageable) {

        return new ResponseEntity<>(ratingService.getAllRenterRatingsByUserId(userId, pageable), HttpStatus.OK);
    }

    @GetMapping("/get-owner/by/user/{userId}")
    public ResponseEntity<Page<RatingDto>> getAllOwnerRatingsByOwnerId(@PathVariable Long userId, Pageable pageable) {

        return new ResponseEntity<>(ratingService.getAllOwnerRatingsByUserId(userId, pageable), HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity<RatingDto> saveRating(@RequestBody Rating rating) {
        return new ResponseEntity<>(ratingService.save(rating), HttpStatus.OK);
    }

    @GetMapping("/get/all/by/{bookingId}")
    public ResponseEntity<List<RatingDto>> getAllRatingsByBookingId(@PathVariable Long bookingId) {
        return new ResponseEntity<>(ratingService.getAllRatingsByBookingId(bookingId), HttpStatus.OK);
    }

    @GetMapping("/get/number-star-received/co/by/time")
    public ResponseEntity<List<Object[]>> getNumberOfStarsReceivedRatingAsCOByTime(

            @RequestParam("start") LocalDateTime start,
            @RequestParam("end") LocalDateTime end) {
        return new ResponseEntity<>(ratingService.getNumberOfStarsReceivedRatingAsCOByTime(start, end), HttpStatus.OK);
    }

    @GetMapping("/get/number-star-received/renter/by/time")
    public ResponseEntity<List<Object[]>> getNumberOfStarsReceivedRatingAsRenterByTime(

            @RequestParam("start") LocalDateTime start,
            @RequestParam("end") LocalDateTime end) {
        return new ResponseEntity<>(ratingService.getNumberOfStarsReceivedRatingAsRenterByTime(start, end),
                HttpStatus.OK);
    }

    @GetMapping("/get/rating-received/car-owner/by/time")
    public ResponseEntity<Page<RatingDto>> getRatingReceivedAsCOByTime(
            @RequestParam(value = "star", required = false) Integer star,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "order", required = false) String order,
            @RequestParam("start") LocalDateTime start,
            @RequestParam("end") LocalDateTime end,
            Pageable pageable) {
        return new ResponseEntity<>(ratingService.getCarOwnerRatingByTime(star, sort, order, start, end, pageable),
                HttpStatus.OK);
    }

    @GetMapping("/get/rating-received/renter/by/time")
    public ResponseEntity<Page<RatingDto>> getRatingReceivedAsRenterByTime(
            @RequestParam(value = "star", required = false) Integer star,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "order", required = false) String order,
            @RequestParam("start") LocalDateTime start,
            @RequestParam("end") LocalDateTime end,
            Pageable pageable) {
        return new ResponseEntity<>(ratingService.getRenterRatingByTime(star, sort, order, start, end, pageable),
                HttpStatus.OK);
    }

    @GetMapping("/get/avg-rate/received/co/five-months")
    public ResponseEntity<List<Object[]>> getAvgRateReceivedAsCOBy5Months() {
        return new ResponseEntity<>(ratingService.getAvgRateReceivedAsCOBy5Months(), HttpStatus.OK);
    }

    @GetMapping("/get/avg-rate/received/renter/five-months")
    public ResponseEntity<List<Object[]>> getAvgRateReceivedAsRenterBy5Months() {
        return new ResponseEntity<>(ratingService.getAvgRateReceivedAsRenterBy5Months(), HttpStatus.OK);
    }
}
