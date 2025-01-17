package CarRental.utils.mapper.car;

import CarRental.dto.car.response.SearchResponseCar;
import CarRental.models.car.CarLocation;
import CarRental.services.image.ImageService;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SearchCarMapper implements Mapper<CarLocation, SearchResponseCar> {
    private final ModelMapper modelMapper;
    private final ImageService imageService;

    @Override
    public CarLocation mapTo(SearchResponseCar searchResponseCar) {
        return modelMapper.map(searchResponseCar, CarLocation.class);
    }

    @Override
    public SearchResponseCar mapFrom(CarLocation carLocation) {
        SearchResponseCar searchResponseCar = modelMapper.map(carLocation, SearchResponseCar.class);
        searchResponseCar.setBrandName(carLocation.getCar().getBrandModel().getBrand().getName());
        searchResponseCar.setCarId(carLocation.getCar().getId());
        searchResponseCar
                .setFrontImgUrl(imageService.getImgUrl(carLocation.getCar().getCarDetailEntity().getFrontImageKey()));
        searchResponseCar
                .setBackImgUrl(imageService.getImgUrl(carLocation.getCar().getCarDetailEntity().getBackImageKey()));
        searchResponseCar
                .setLeftImgUrl(imageService.getImgUrl(carLocation.getCar().getCarDetailEntity().getLeftImageKey()));
        searchResponseCar
                .setRightImgUrl(imageService.getImgUrl(carLocation.getCar().getCarDetailEntity().getRightImageKey()));
        return searchResponseCar;
    }
}
