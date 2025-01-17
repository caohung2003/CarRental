package CarRental.dto.car.response;

import CarRental.models.car.enums.Fuel;
import CarRental.models.car.enums.Transmission;
import CarRental.models.location.Ward;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchResponseCar {
    private Long carId;

    private Ward ward;

    private String road;

    private Double lat;

    private Double lng;

    private String brandName;

    private String modelName;

    private Integer yearProduction;

    private Integer noSeat;

    private Transmission transmission;

    private Fuel fuel;

    private Double rating;

    private Integer noRides;

    private Integer mileage;

    private Integer fuelConsumption;

    private String frontImgUrl;

    private String backImgUrl;

    private String leftImgUrl;

    private String rightImgUrl;

    private Long basePrice;

    private Double distance;

    public Boolean insuranceStatus;

    private String licensePlate;
}
