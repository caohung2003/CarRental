package CarRental.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarOwnerProfileDto {
    private Long ownerId;

    private String firstName;

    private String lastName;

    private String avatar;

    private Double rating;

    private Integer noBooking;

    private String phone;

    private String email;

}
