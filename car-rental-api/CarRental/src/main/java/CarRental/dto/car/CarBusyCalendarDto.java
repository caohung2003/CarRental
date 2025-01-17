package CarRental.dto.car;

import java.time.LocalDateTime;

import CarRental.models.car.enums.CarBusyReason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarBusyCalendarDto {

    private LocalDateTime start;

    private LocalDateTime end;

    private CarBusyReason busyReason;

    private Long bookingId;
}
