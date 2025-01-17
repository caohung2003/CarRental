package CarRental.utils.mapper.car;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import CarRental.dto.car.CarBasicDto;
import CarRental.dto.car.CarDetailDto;
import CarRental.models.car.CarBasic;
import CarRental.models.car.CarDetail;
import CarRental.services.image.ImageService;
import CarRental.utils.Mapper;

@Component
public class CarBasicMapper implements Mapper<CarBasic, CarBasicDto> {
    private final ModelMapper modelMapper;
    private final ImageService imageService;
    private final CarDetailMapper carDetailMapper;

    public CarBasicMapper(ModelMapper modelMapper, ImageService imageService, CarDetailMapper carDetailMapper) {
        this.modelMapper = modelMapper;
        this.imageService = imageService;
        this.carDetailMapper = carDetailMapper;
        configureMappings();
    }

    @Override
    public CarBasic mapTo(CarBasicDto carBasicDto) {
        return modelMapper.map(carBasicDto, CarBasic.class);
    }

    @Override
    public CarBasicDto mapFrom(CarBasic carBasic) {
        CarBasicDto carBasicDto = modelMapper.map(carBasic, CarBasicDto.class);
        if (carBasic.getInsuranceImageKey() == null) {
            carBasicDto.setInsuranceImgUrl(null);
        }
        carBasicDto.getProfileDto().setAvatar(imageService.getImgUrl(carBasic.getOwner().getAvatarImageKey()));
        return carBasicDto;
    }

    private void configureMappings() {
        Converter<String, String> imageKeyToUrlConverter = ctx -> imageService.getImgUrl(ctx.getSource());
        Converter<CarDetail, CarDetailDto> carDetailToCarBasicDtoConverter = ctx -> carDetailMapper
                .mapFrom(ctx.getSource());

        modelMapper.createTypeMap(CarBasic.class, CarBasicDto.class)
                .addMappings(mapper -> {
                    mapper.using(imageKeyToUrlConverter).map(CarBasic::getInspectionImageKey,
                            CarBasicDto::setInspectionImgUrl);
                    mapper.using(imageKeyToUrlConverter).map(CarBasic::getInsuranceImageKey,
                            CarBasicDto::setInsuranceImgUrl);
                    mapper.using(imageKeyToUrlConverter).map(CarBasic::getRegistrationImageKey,
                            CarBasicDto::setRegistrationImgUrl);
                })
                .addMappings(mapper -> mapper.using(carDetailToCarBasicDtoConverter).map(CarBasic::getCarDetailEntity,
                        CarBasicDto::setCarDetail));
    }
}
