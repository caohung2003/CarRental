package CarRental.services.rating.impl;

import CarRental.dto.rating.RatingDto;
import CarRental.exception.CarResourceException;
import CarRental.exception.FeedbackResourceException;
import CarRental.exception.ForbiddenOperationException;
import CarRental.exception.WardNotFoundException;
import CarRental.models.booking.Booking;
import CarRental.models.car.CarBasic;
import CarRental.models.rating.Rating;
import CarRental.models.user.User;
import CarRental.repositories.booking.BookingRepository;
import CarRental.repositories.car.CarBasicRepository;
import CarRental.repositories.rating.RatingRepository;
import CarRental.repositories.user.UserRepository;
import CarRental.services.rating.RatingService;
import CarRental.services.user.UserService;
import CarRental.utils.mapper.rating.RatingMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Log
@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final RatingMapper ratingMapper;
    private final CarBasicRepository carBasicRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;

    @Override
    public Page<RatingDto> getAllRatingsByCarId(Long carId, Pageable pageable) {
        carBasicRepository
                .findById(carId)
                .orElseThrow(() -> new CarResourceException("Car not found"));
        return ratingRepository.getRatingByCarId(carId, pageable).map(ratingMapper::mapFrom);
    }

    @Override
    public Page<RatingDto> getAllRenterRatingsByUserId(Long userId, Pageable pageable) {
        return ratingRepository.getRenterRatingByUserId(userId, pageable).map(ratingMapper::mapFrom);
    }

    @Override
    public Page<RatingDto> getAllOwnerRatingsByUserId(Long userId, Pageable pageable) {
        return ratingRepository.getOwnerRatingByUserId(userId, pageable).map(ratingMapper::mapFrom);
    }

    @Override
    public void updateCarRating(Long carId) {
        CarBasic carBasic = carBasicRepository
                .findById(carId)
                .orElseThrow(() -> new CarResourceException("Car not found"));
        Double carRating = ratingRepository.getAvgRateReceivedByCarId(carId);
        if (carRating != null) {
            carBasic.setRating(ratingRepository.getAvgRateReceivedByCarId(carId));
        } else {
            carBasic.setRating(0.0);
        }
        carBasicRepository.save(carBasic);
    }

    @Override
    public RatingDto save(Rating rating) {
        User user = userService.getUserFromSecurityContext();
        Booking booking = bookingRepository.findById(rating.getBooking().getId())
                .orElseThrow(() -> new WardNotFoundException("Not found booking"));
        CarBasic carBasic = carBasicRepository.findById(booking.getCar().getId())
                .orElseThrow(() -> new WardNotFoundException("Not found car"));
        rating.setSender(user);
        rating.setCarBasic(carBasic);

        if (rating.getIsRenterFeedback()) {

            if (rating.getSender().getId() != booking.getUser().getId()) {
                throw new ForbiddenOperationException("You can't give rate on this booking");
            }
            rating.setReceiver(booking.getCar().getOwner());
        } else {
            if (rating.getSender().getId() != booking.getCar().getOwner().getId()) {
                throw new ForbiddenOperationException("You can't give rate on this booking");
            }
            rating.setReceiver(booking.getUser());
        }
        if (!booking.getStatus().toString().equals("COMPLETED")) {
            if (booking.getStatus().toString().equals("CANCELED")) {
                throw new FeedbackResourceException("Your trip has been cancelled!");
            } else {
                throw new FeedbackResourceException("Your trip hasn't completed yet!");
            }
        }
        boolean flag = true;
        for (int i = 0; i < booking.getRatings().size(); i++) {
            Rating rat = booking.getRatings().get(i);
            // da ton tai
            if (rat.getIsRenterFeedback() == rating.getIsRenterFeedback() && !rat.getCanFixed()) {
                flag = false;
                throw new FeedbackResourceException("You have already rated on this trip!");
            } else if (rat.getIsRenterFeedback() == rating.getIsRenterFeedback() && rat.getCanFixed()) {
                rating.setCanFixed(false);
                rating.setId(rat.getId());
                flag = false;
            }
        }
        if (flag) {
            rating.setCanFixed(true);
        }
        // chua ton tai

        if (rating.getDateTime().isAfter(booking.getReturnAt().plus(7, ChronoUnit.DAYS))) {
            throw new FeedbackResourceException(
                    "It's been over a week since your trip, you can't give feedback anymore!");
        }
        Rating savedRating = ratingRepository.save(rating);
        RatingDto ratingDto = ratingMapper.mapFrom(savedRating);
        updateCarRating(savedRating.getCarBasic().getId());
        updateUserRating(savedRating.getReceiver().getId());
        return ratingDto;
    }

    @Override
    public void updateUserRating(Long userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new CarResourceException("User not found"));
        Double userRating = ratingRepository.getAvgRateReceivedByUserId(userId);
        if (userRating != null) {
            user.setRating(userRating);
        } else {
            user.setRating(0.0);
        }
        userRepository.save(user);
    }

    @Override
    public List<RatingDto> getAllRatingsByBookingId(Long bookingId) {
        return ratingRepository.getRatingByBookingId(bookingId).stream().map(ratingMapper::mapFrom)
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getNumberOfStarsReceivedRatingAsCOByTime(LocalDateTime start, LocalDateTime end) {
        User user = userService.getUserFromSecurityContext();
        return ratingRepository.getNumberOfStarsReceivedRatingAsCOByTime(start, end, user.getId());
    }

    @Override
    public List<Object[]> getNumberOfStarsReceivedRatingAsRenterByTime(LocalDateTime start, LocalDateTime end) {
        User user = userService.getUserFromSecurityContext();
        return ratingRepository.getNumberOfStarsReceivedRatingAsRenterByTime(start, end, user.getId());
    }

    @Override
    public Page<RatingDto> getCarOwnerRatingByTime(Integer star, String sort, String order, LocalDateTime start,
            LocalDateTime end,
            Pageable pageable) {
        User user = userService.getUserFromSecurityContext();
        List<Sort.Order> orders = new ArrayList<>();

        if (sort != null) {
            if ("asc".equals(order)) {
                orders.add(new Sort.Order(
                        Sort.Direction.ASC, sort));

            } else {
                orders.add(new Sort.Order(
                        Sort.Direction.DESC, sort));
            }
            orders.add(new Sort.Order(
                    Sort.Direction.ASC, "id"));
        } else {
            orders.add(new Sort.Order(
                    Sort.Direction.ASC, "id"));
        }

        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(orders));
        return ratingRepository.getRatingReceivedAsCOByTime(star, start, end, user.getId(), pageable)
                .map(ratingMapper::mapFrom);
    }

    @Override
    public Page<RatingDto> getRenterRatingByTime(Integer star, String sort, String order, LocalDateTime start,
            LocalDateTime end,
            Pageable pageable) {
        User user = userService.getUserFromSecurityContext();
        List<Sort.Order> orders = new ArrayList<>();
        if (sort != null) {
            if ("asc".equals(order)) {
                orders.add(new Sort.Order(
                        Sort.Direction.ASC, sort));

            } else {
                orders.add(new Sort.Order(
                        Sort.Direction.DESC, sort));
            }
            orders.add(new Sort.Order(
                    Sort.Direction.ASC, "id"));
        } else {
            orders.add(new Sort.Order(
                    Sort.Direction.ASC, "id"));
        }
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(orders));
        return ratingRepository.getRatingReceivedAsRenterByTime(star, start, end, user.getId(), pageable)
                .map(ratingMapper::mapFrom);
    }

    @Override
    public List<Object[]> getAvgRateReceivedAsCOBy5Months() {
        User user = userService.getUserFromSecurityContext();
        return ratingRepository.getAvgRateReceivedAsCOBy5Months(user.getId());
    }

    @Override
    public List<Object[]> getAvgRateReceivedAsRenterBy5Months() {
        User user = userService.getUserFromSecurityContext();
        return ratingRepository.getAvgRateReceivedAsRenterBy5Months(user.getId());
    }
}
