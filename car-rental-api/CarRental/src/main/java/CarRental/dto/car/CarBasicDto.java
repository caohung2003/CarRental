package CarRental.dto.car;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import CarRental.dto.brand.BrandModelDto;
import CarRental.dto.user.CarOwnerProfileDto;
import CarRental.models.car.Feature;
import CarRental.models.car.enums.Fuel;
import CarRental.models.car.enums.Transmission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarBasicDto {
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

    private LocalDateTime start;

    private LocalDateTime end;

    private Double rating;

    private Integer noRides;

    private CarDetailDto carDetail;

    public Boolean insuranceStatus;

    private List<CarBusyCalendarDto> carCalendar;

    private CarPricingDto carPricing;

    private List<CarLocationDto> carLocations;

    private Set<Feature> features;

    private CarOwnerProfileDto profileDto;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public String declinedReason;

}
