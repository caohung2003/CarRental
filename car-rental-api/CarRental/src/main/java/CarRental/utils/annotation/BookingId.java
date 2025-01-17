package CarRental.utils.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.hibernate.annotations.GenericGenerator;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@GenericGenerator(
    name = "booking_id_generator",
    strategy = "CarRental.utils.id.BookingIdGenerator",
    parameters = {
        @org.hibernate.annotations.Parameter(name = "sequence_name", value = "booking_sequence")
    }
)
public @interface BookingId {
}
