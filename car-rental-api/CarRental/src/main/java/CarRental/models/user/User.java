package CarRental.models.user;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import jakarta.persistence.*;
import lombok.experimental.FieldNameConstants;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import CarRental.models.car.CarBasic;
import CarRental.models.location.Ward;
import CarRental.models.payment.Wallet;
import CarRental.models.rating.Rating;
import CarRental.utils.annotation.BookingId;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@FieldNameConstants
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "first_name")
    @Size(max = 50)
    private String firstName;

    @Column(name = "last_name")
    @Size(max = 50)
    private String lastName;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "email", unique = true)
    @Email
    @Size(min = 5, max = 254)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "national_id")
    private String nationalId;

    @Column(name = "driver_license_image_key")
    private String driverLicenseImageKey;

    @ManyToOne
    @JoinColumn(name = "ward_id", referencedColumnName = "id")
    private Ward ward;

    @Column(name = "address")
    private String address;

    @Column(name = "password")
    @JsonIgnore
    @NotNull
    private String password;

    @Column(name = "avatar_image_key")
    private String avatarImageKey;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "no_booking")
    private Integer noBooking;

    @Size(max = 20)
    @Column(name = "activation_key", length = 20)
    @JsonIgnore
    private String activationKey;

    @Size(max = 20)
    @Column(name = "reset_key", length = 20)
    @JsonIgnore
    private String resetKey;

    @Column(name = "reset_date")
    @Builder.Default
    private Instant resetDate = null;

    @NotNull
    @Builder.Default
    @Column(nullable = false)
    private boolean activated = false;

    @JsonIgnore
    @OneToMany(mappedBy = "token", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private List<Token> tokens;

    @OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY)
    private List<Rating> receiveRatings;

    @OneToMany(mappedBy = "owner", fetch = FetchType.LAZY)
    private List<CarBasic> carBasics;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @PrimaryKeyJoinColumn
    private Wallet wallet;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getRoleName()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @BookingId
    private String UserID;
}
