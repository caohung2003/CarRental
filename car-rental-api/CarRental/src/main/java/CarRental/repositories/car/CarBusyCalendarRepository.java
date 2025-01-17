package CarRental.repositories.car;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import CarRental.models.booking.Booking;
import CarRental.models.car.CarBusyCalendar;

@Repository
public interface CarBusyCalendarRepository extends JpaRepository<CarBusyCalendar, Long> {

    //check whether the car is busy in a specific time
    @Query("SELECT c FROM CarBusyCalendar c" +
            " WHERE c.car.id = :carId AND ((c.start <= :pick AND :pick <= c.end) OR " +
            "(:pick <= c.start AND c.start <= :drop))")
    public List<CarBusyCalendar> checkTimeRentBusy(
            @Param("carId") Long carId,
            @Param("pick") LocalDateTime pickTime,
            @Param("drop") LocalDateTime dropTime
    );

    public CarBusyCalendar findByBooking(Booking booking);
    
}
