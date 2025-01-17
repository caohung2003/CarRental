package CarRental.services.car.impl;

import java.util.List;
import CarRental.dto.car.CarBusyCalendarDto;
import CarRental.exception.CarResourceException;
import CarRental.models.booking.Booking;
import CarRental.models.car.CarBasic;
import CarRental.models.car.CarBusyCalendar;
import CarRental.models.car.enums.CarBusyReason;
import CarRental.repositories.car.CarBasicRepository;
import CarRental.repositories.car.CarBusyCalendarRepository;
import CarRental.services.car.CarBusyCalendarService;
import CarRental.utils.mapper.car.CarBusyCalendarMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarBusyCalendarServiceImpl implements CarBusyCalendarService {
    private final CarBusyCalendarRepository carBusyCalendarRepository;
    private final CarBusyCalendarMapper carBusyCalendarMapper;
    private final CarBasicRepository carBasicRepository;

    private CarBasic getCarById(Long id) {
        return carBasicRepository.findById(id).orElseThrow(() -> new CarResourceException("Car not found"));
    }

    @Override
    public List<CarBusyCalendarDto> checkTimeCarBusy(Long id, LocalDateTime pickTime, LocalDateTime dropTime) {
        getCarById(id);
        if (carBusyCalendarRepository.checkTimeRentBusy(id, pickTime, dropTime) != null && !carBusyCalendarRepository.checkTimeRentBusy(id, pickTime, dropTime).isEmpty()) {
            return carBusyCalendarRepository.checkTimeRentBusy(id, pickTime, dropTime).stream().map(carBusyCalendarMapper::mapFrom).collect(Collectors.toList());
        } else {
            return null;
        }
    }

    @Override
    public void addCarBusyTime(Long id, LocalDateTime pickTime, LocalDateTime dropTime, Booking booking) {
        CarBusyCalendar carBusyCalendar = CarBusyCalendar.builder()
                .car(getCarById(id))
                .booking(booking)
                .start(pickTime)
                .end(dropTime)
                .busyReason(CarBusyReason.BOOKING)
                .build();
        carBusyCalendarRepository.save(carBusyCalendar);
    }

    @Override
    public void deleteCarBusyTimeRelatedToBooking(Booking booking) {
        var bookingCalendar = carBusyCalendarRepository.findByBooking(booking);
        if (bookingCalendar != null) {
            carBusyCalendarRepository.delete(bookingCalendar);
        }
    }

    @Override
    public void updateCarBusyTimeRelatedToBooking(Booking booking, LocalDateTime pickTime, LocalDateTime dropTime) {
        var bookingCalendar = carBusyCalendarRepository.findByBooking(booking);
        if (bookingCalendar != null) {
            bookingCalendar.setStart(pickTime);
            bookingCalendar.setEnd(dropTime);
            carBusyCalendarRepository.save(bookingCalendar);
        }
    }
}
