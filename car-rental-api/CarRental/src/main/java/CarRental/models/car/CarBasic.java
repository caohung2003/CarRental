package CarRental.models.car;

import CarRental.models.booking.Booking;
import CarRental.models.brand.BrandModel;
import CarRental.models.car.enums.Fuel;
import CarRental.models.car.enums.CarStatus;
import CarRental.models.car.enums.Transmission;
import CarRental.models.user.User;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.time.LocalDateTime;
import java.util.*;

@FieldNameConstants
@Entity
@Table(name = "car_basic")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class CarBasic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "license_plate")
    private String licensePlate;

    @ManyToOne
    @JoinColumn(name = "model_id", referencedColumnName = "id")
    private BrandModel brandModel;

    @Column(name = "year_production")
    private Integer yearProduction;

    @Column(name = "no_seats")
    private Integer noSeat;

    @Enumerated(EnumType.STRING)
    @Column(name = "transmission")
    private Transmission transmission;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel")
    private Fuel fuel;

    @Column(name = "registration_image_key")
    private String registrationImageKey;

    @Column(name = "inspection_image_key")
    private String inspectionImageKey;

    @Column(name = "insurance_image_key")
    private String insuranceImageKey;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CarStatus status;

    @Column(name = "start_rent")
    private LocalDateTime startRent;

    @Column(name = "end_rent")
    private LocalDateTime endRent;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "no_rides")
    private Integer noRides;

    @Column(name = "auto_cancel_hours_after_pending")
    @Builder.Default
    private Integer autoCancelHoursAfterPending = 24;

    @Column(name = "auto_cancel_hours_after_confirmation")
    @Builder.Default
    private Integer autoCancelHoursAfterConfirmation = 24;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    public User createdBy;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    public User updatedBy;

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private User owner;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "car", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private CarDetail carDetailEntity;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "car")
    @PrimaryKeyJoinColumn
    private List<CarBusyCalendar> carCalendarEntityList;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "car", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private CarPricing carPricingEntity;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "car")
    @PrimaryKeyJoinColumn
    private List<CarLocation> carLocations;

    // @ElementCollection(targetClass = AdditionalFunction.class)
    // @Enumerated(EnumType.STRING)
    // private List<AdditionalFunction> carFunctions;

    @Column(name = "insurance_status")
    public Boolean insuranceStatus;

    @Column(name = "declined_reason")
    public String declinedReason;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "car", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    @ManyToMany
    @JoinTable(name = "car_feature", joinColumns = @JoinColumn(name = "car_id"), inverseJoinColumns = @JoinColumn(name = "feature_id")

    )
    @Builder.Default
    private Set<Feature> features = new HashSet<>();

}
