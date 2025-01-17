package CarRental.utils.mapper.car;

import CarRental.dto.car.response.CarResponseDetail;
import CarRental.models.car.CarBasic;
import CarRental.services.image.ImageService;
import CarRental.utils.Mapper;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class CarResponseMapper implements Mapper<CarBasic, CarResponseDetail> {
    private final ModelMapper modelMapper;
    private final ImageService imageService;

    public CarResponseMapper(ModelMapper modelMapper, ImageService imageService) {
        this.modelMapper = modelMapper;
        this.imageService = imageService;
        configureMappings();
    }

    @Override
    public CarBasic mapTo(CarResponseDetail carResponseMapper) {
        return modelMapper.map(carResponseMapper, CarBasic.class);
    }

    private void configureMappings() {
        Converter<String, String> imageKeyToUrlConverter = ctx -> imageService.getImgUrl(ctx.getSource());

        modelMapper.createTypeMap(CarBasic.class, CarResponseDetail.class)
                .addMappings(mapper -> {
                    mapper.using(imageKeyToUrlConverter).map(CarBasic::getInsuranceImageKey,
                            CarResponseDetail::setInsuranceImgUrl);
                    mapper.using(imageKeyToUrlConverter).map(CarBasic::getRegistrationImageKey,
                            CarResponseDetail::setRegistrationImgUrl);
                    mapper.using(imageKeyToUrlConverter).map(CarBasic::getInspectionImageKey,
                            CarResponseDetail::setInspectionImgUrl);
                });
    }

    @Override
    public CarResponseDetail mapFrom(CarBasic carBasic) {
        CarResponseDetail carResponseDetail = modelMapper.map(carBasic, CarResponseDetail.class);
        carResponseDetail.setBackImgUrl(imageService.getImgUrl(carBasic.getCarDetailEntity().getBackImageKey()));
        carResponseDetail.setFrontImgUrl(imageService.getImgUrl(carBasic.getCarDetailEntity().getFrontImageKey()));
        carResponseDetail.setLeftImgUrl(imageService.getImgUrl(carBasic.getCarDetailEntity().getLeftImageKey()));
        carResponseDetail.setRightImgUrl(imageService.getImgUrl(carBasic.getCarDetailEntity().getRightImageKey()));
        if (carBasic.getInsuranceImageKey() == null) {
            carResponseDetail.setInsuranceImgUrl(null);
        }
        carResponseDetail.getOwner().setAvatar(imageService.getImgUrl(carBasic.getOwner().getAvatarImageKey()));
        return carResponseDetail;
    }
}
