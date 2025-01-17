package CarRental.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import CarRental.dto.car.CarDetailDto;
import CarRental.models.car.CarDetail;
import CarRental.services.image.ImageService;
import CarRental.utils.mapper.car.CarDetailMapper;

@SpringBootTest
class CarDetailMapperTest {
    private CarDetailMapper carDetailMapper;
    private ModelMapper modelMapper;
    private ImageService imageService;

    @Value("${application.url.base}")
    private String baseUrl;

    @BeforeEach
    void setUp() {
        modelMapper = new ModelMapper();
        imageService = mock(ImageService.class);
        carDetailMapper = new CarDetailMapper(modelMapper, imageService);
    }

    
    @Test
    void mapFrom_shouldMapCarDetailToCarDetailDto() {
        // Arrange
        CarDetail carDetail = new CarDetail();
        carDetail.setBackImageKey("backImageKey");
        carDetail.setFrontImageKey("frontImageKey");
        carDetail.setLeftImageKey("leftImageKey");
        carDetail.setRightImageKey("rightImageKey");

        // Act
        CarDetailDto carDetailDto = carDetailMapper.mapFrom(carDetail);

        // Assert
        assertEquals(baseUrl + "/api/v1/image/" +"backImgUrl", carDetailDto.getBackImgUrl());
        assertEquals(baseUrl + "/api/v1/image/" +"frontImgUrl", carDetailDto.getFrontImgUrl());
        assertEquals(baseUrl + "/api/v1/image/" +"leftImgUrl", carDetailDto.getLeftImgUrl());
        assertEquals(baseUrl + "/api/v1/image/" +"rightImgUrl", carDetailDto.getRightImgUrl());
    }
}