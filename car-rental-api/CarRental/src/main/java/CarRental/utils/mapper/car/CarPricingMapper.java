package CarRental.utils.mapper.car;

import CarRental.dto.car.CarPricingDto;
import CarRental.models.car.CarPricing;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CarPricingMapper implements Mapper<CarPricing, CarPricingDto> {
    private final ModelMapper modelMapper;
    public CarPricing mapTo(CarPricingDto carPricingDto) {
        return modelMapper.map(carPricingDto, CarPricing.class);
    }

    public CarPricingDto mapFrom(CarPricing carPricing) {
        return modelMapper.map(carPricing, CarPricingDto.class);
    }
}
