package CarRental.models.booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import CarRental.models.car.CarBasic;
import CarRental.models.location.Ward;
import CarRental.models.payment.PaymentType;
import CarRental.models.rating.Rating;
import CarRental.models.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldNameConstants;

@Entity
@FieldNameConstants
@Table(name = "booking")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", referencedColumnName = "id")
    private CarBasic car;
    // Renter information

    @Column(name = "renter_first_name")
    @Size(max = 50)
    private String renterFirstName;

    @Column(name = "renter_last_name")
    @Size(max = 50)
    private String renterLastName;

    @Column(name = "renter_dob")
    private LocalDate renterDob;

    @Column(name = "renter_email")
    @Email
    private String renterEmail;

    @Column(name = "renter_phone")
    private String renterPhone;

    @Column(name = "renter_national_id")
    private String renterNationalId;

    @Column(name = "renter_license_image_key")
    private String renterLicenseImageKey;

    @ManyToOne
    @JoinColumn(name = "renter_ward_id", referencedColumnName = "id")
    private Ward renterWard;

    @Column(name = "renter_location")
    private String renterLocation;

    // driver information
    @Column(name = "driver_first_name")
    @Size(max = 50)
    private String driverFirstName;

    @Column(name = "driver_last_name")
    @Size(max = 50)
    private String driverLastName;

    @Column(name = "driver_dob")
    private LocalDate driverDob;

    @Column(name = "driver_email")
    @Email
    private String driverEmail;

    @Column(name = "driver_phone")
    private String driverPhone;

    @Column(name = "driver_national_id")
    private String driverNationalId;

    @Column(name = "driver_license_image_key")
    private String driverLicenseImageKey;

    @ManyToOne
    @JoinColumn(name = "driver_ward_id", referencedColumnName = "id")
    private Ward driverWard;

    @Column(name = "driver_location")
    private String driverLocation;

    // Booking information
    @Column(name = "pick_up_at")
    private LocalDateTime pickUpAt;

    @Column(name = "return_at")
    private LocalDateTime returnAt;

    @Column(name = "actual_pick_up_at")
    private LocalDateTime actualPickUpAt;

    @Column(name = "actual_return_at")
    private LocalDateTime actualReturnAt;

    @ManyToOne
    @JoinColumn(name = "pick_up_ward_id", referencedColumnName = "id")
    private Ward pickUpWard;

    @Column(name = "pick_up_location")
    private String pickUpLocation;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    @Column(name = "deposit")
    private BigDecimal deposit;

    @Column(name = "total")
    private BigDecimal total;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "payment_at")
    private LocalDateTime paymentAt;

    @Column(name = "car_owner_message")
    private String carOwnerMessage;

    @Column(name = "renter_message")
    private String renterMessage;

    @Column(name = "payment_type")
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    @OneToMany(mappedBy = "booking", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Rating> ratings;

    @Column(name = "number_of_days")
    private Integer numberOfDays;

    @Column(name = "deposit_transaction_id")
    private UUID depositTransactionId;

    @Column(name = "payment_transaction_id")
    private UUID paymentTransactionId;

}
