package CarRental.utils.mapper.car;

import CarRental.dto.car.CarBusyCalendarDto;
import CarRental.models.car.CarBusyCalendar;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CarBusyCalendarMapper implements Mapper<CarBusyCalendar, CarBusyCalendarDto> {
    private final ModelMapper modelMapper;
    @Override
    public CarBusyCalendar mapTo(CarBusyCalendarDto carCalendarDto) {
        return modelMapper.map(carCalendarDto, CarBusyCalendar.class);
    }

    @Override
    public CarBusyCalendarDto mapFrom(CarBusyCalendar carCalendar) {
        return modelMapper.map(carCalendar, CarBusyCalendarDto.class);
    }

}
