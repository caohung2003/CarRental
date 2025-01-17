package CarRental.dto.car;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarDetailDto {
    private long id;

    private int mileage;

    private int fuelConsumption;

    private String description;

    private String frontImgUrl;

    private String backImgUrl;

    private String leftImgUrl;

    private String rightImgUrl;
}
