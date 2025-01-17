package CarRental.dto.car.response;

import CarRental.dto.brand.BrandModelDto;
import CarRental.dto.car.CarBusyCalendarDto;
import CarRental.dto.car.CarLocationDto;
import CarRental.dto.user.CarOwnerProfileDto;
import CarRental.models.car.Feature;
import CarRental.models.car.enums.Fuel;
import CarRental.models.car.enums.PriceMethod;
import CarRental.models.car.enums.Transmission;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarResponseDetail {
    private Long id;

    private String licensePlate;

    private BrandModelDto brandModel;

    private Integer yearProduction;

    private Integer noSeat;

    private Transmission transmission;

    private Fuel fuel;

    private String registrationImgUrl;

    private String inspectionImgUrl;

    private String insuranceImgUrl;

    private String status;

    private LocalDateTime startRent;

    private LocalDateTime endRent;

    private Double rating;

    private Integer noRides;

    public Boolean insuranceStatus;

    private List<CarBusyCalendarDto> carCalendar;

    private List<CarLocationDto> carLocations;

    private Set<Feature> features;

    private CarOwnerProfileDto owner;

    private int mileage;

    private int fuelConsumption;

    private String description;

    private String frontImgUrl;

    private String backImgUrl;

    private String leftImgUrl;

    private String rightImgUrl;

    private Long basePrice;

    private int requiredDeposit;

    private PriceMethod basePriceMethod;

    private Integer autoCancelHoursAfterPending;

    private Integer autoCancelHoursAfterConfirmation;

    public LocalDateTime createdAt;

    // public OwnerProfileDto createdBy;

    public LocalDateTime updatedAt;

    // public OwnerProfileDto updatedBy;
}
