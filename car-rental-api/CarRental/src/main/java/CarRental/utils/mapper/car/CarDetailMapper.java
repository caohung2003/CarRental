package CarRental.utils.mapper.car;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import CarRental.dto.car.CarDetailDto;
import CarRental.models.car.CarDetail;
import CarRental.services.image.ImageService;
import CarRental.utils.Mapper;
import lombok.extern.java.Log;

@Log
@Component
public class CarDetailMapper implements Mapper<CarDetail, CarDetailDto> {
    private final ModelMapper modelMapper;
    private final ImageService imageService;

    public CarDetailMapper(ModelMapper modelMapper, ImageService imageService) {
        this.modelMapper = modelMapper;
        this.imageService = imageService;
        configureMappings();
    }

    // Method to configure mappings
    private void configureMappings() {
        Converter<String, String> imageKeyToUrlConverter = ctx -> imageService.getImgUrl(ctx.getSource());

        modelMapper.createTypeMap(CarDetail.class, CarDetailDto.class)
                .addMappings(mapper -> {
                    mapper.using(imageKeyToUrlConverter).map(CarDetail::getBackImageKey, CarDetailDto::setBackImgUrl);
                    mapper.using(imageKeyToUrlConverter).map(CarDetail::getFrontImageKey, CarDetailDto::setFrontImgUrl);
                    mapper.using(imageKeyToUrlConverter).map(CarDetail::getLeftImageKey, CarDetailDto::setLeftImgUrl);
                    mapper.using(imageKeyToUrlConverter).map(CarDetail::getRightImageKey, CarDetailDto::setRightImgUrl);
                });
    }

    @Override
    public CarDetail mapTo(CarDetailDto carDetailDto) {
        return modelMapper.map(carDetailDto, CarDetail.class);
    }

    @Override
    public CarDetailDto mapFrom(CarDetail carDetail) {
        log.info(carDetail.toString());
        return modelMapper.map(carDetail, CarDetailDto.class);
    }
}
