package CarRental.dto.car.request;

import java.time.LocalDateTime;

public record CarBusyCalendarRequest(
                LocalDateTime start,
                LocalDateTime end

) {
}
