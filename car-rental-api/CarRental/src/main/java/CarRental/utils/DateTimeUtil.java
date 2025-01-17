package CarRental.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;

@Component
public class DateTimeUtil {
    public String getFormatDate(LocalDateTime localDateTime) {
        String pattern = "dd/MM/yyyy HH:mm";
        return localDateTime.format(DateTimeFormatter.ofPattern(pattern));
    }
}
