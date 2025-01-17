package CarRental.services.car;

import java.time.LocalDateTime;

import CarRental.dto.car.CarBusyCalendarDto;
import CarRental.models.booking.Booking;

import java.util.List;

public interface CarBusyCalendarService {
    public List<CarBusyCalendarDto> checkTimeCarBusy(Long id, LocalDateTime pickTime, LocalDateTime dropTime);

    public void addCarBusyTime(Long id, LocalDateTime pickTime, LocalDateTime dropTime, Booking booking);

    public void deleteCarBusyTimeRelatedToBooking(Booking booking);

    public void updateCarBusyTimeRelatedToBooking(Booking booking, LocalDateTime pickTime, LocalDateTime dropTime);
}
