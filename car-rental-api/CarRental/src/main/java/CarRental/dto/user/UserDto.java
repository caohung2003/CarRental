package CarRental.dto.user;

import java.time.LocalDate;

import CarRental.models.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private long id;

    private String firstName;

    private String lastName;

    private LocalDate dob;

    private String email;

    private String phone;

    private String avatar;

    private Role role;

    private Double rating;

    private Integer noBooking;

    private String nationalId;

    private String address;

    private Long wardId;

    private String driverLicenseImage;

}
