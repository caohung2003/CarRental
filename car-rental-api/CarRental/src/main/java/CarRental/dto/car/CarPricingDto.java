package CarRental.dto.car;

import CarRental.models.car.enums.PriceMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarPricingDto {
    private long id;

    private Long basePrice;

    private int requiredDeposit;

    private PriceMethod basePriceMethod;

}
