package CarRental.dto.rating;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class RatingDto {
    private Long id;

    private Long bookingId;

    private Double stars;

    private String comment;

    private Long senderId;

    private String senderFirstName;

    private String senderLastName;

    private String senderAvatar;

    private Long receiverId;

    private String receiverFirstName;

    private String receiverLastName;

    private String receiverAvatar;

    private LocalDateTime dateTime;

    private Boolean isRenterFeedback;

    private Boolean canFixed;
}
