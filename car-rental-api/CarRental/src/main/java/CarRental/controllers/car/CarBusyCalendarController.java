package CarRental.controllers.car;

import java.util.List;
import CarRental.dto.car.CarBusyCalendarDto;
import CarRental.services.car.CarBusyCalendarService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RequestMapping("/api/v1/car-busy")
@RestController
@RequiredArgsConstructor
public class CarBusyCalendarController {
    private final CarBusyCalendarService carCalendarService;

    //check if in that time that car can be rent
    @GetMapping("/check/time-rent/{id}")
    public ResponseEntity<List<CarBusyCalendarDto>> checkTimeRentBusy(
            @PathVariable Long id,
            @RequestParam(value = "pick") LocalDateTime pickTime,
            @RequestParam(value = "drop") LocalDateTime dropTime
    ) {
        return new ResponseEntity<>(carCalendarService.checkTimeCarBusy(id, pickTime, dropTime), HttpStatus.OK);
    }
}
