package CarRental.utils.mapper.car;

import CarRental.dto.car.CarLocationDto;
import CarRental.models.car.CarLocation;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CarLocationMapper implements Mapper<CarLocation, CarLocationDto> {
    private final ModelMapper modelMapper;
    @Override
    public CarLocation mapTo(CarLocationDto carLocationDto) {
        return modelMapper.map(carLocationDto, CarLocation.class);
    }

    @Override
    public CarLocationDto mapFrom(CarLocation carLocation) {
        return modelMapper.map(carLocation, CarLocationDto.class);
    }
}
