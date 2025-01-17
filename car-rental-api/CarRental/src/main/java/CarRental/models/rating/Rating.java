package CarRental.models.rating;

import CarRental.models.booking.Booking;
import CarRental.models.car.CarBasic;
import CarRental.models.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.time.LocalDateTime;

@Table
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@FieldNameConstants
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private CarBasic carBasic;

    @Column(name = "stars")
    private Double stars;

    @Lob
    @Column(name = "comment")
    private String comment;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Column(name = "datetime")
    private LocalDateTime dateTime;

    @Column(name = "is_renter_feedback")
    private Boolean isRenterFeedback;

    @Column(name = "can_fixed")
    private Boolean canFixed;
}
