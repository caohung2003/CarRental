package CarRental.utils.mapper.brand;

import CarRental.dto.brand.BrandModelDto;
import CarRental.models.brand.BrandModel;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BrandModelMapper implements Mapper<BrandModel, BrandModelDto> {
    private final ModelMapper modelMapper;
    @Override
    public BrandModel mapTo(BrandModelDto brandModelDto) {
        return modelMapper.map(brandModelDto, BrandModel.class);
    }

    @Override
    public BrandModelDto mapFrom(BrandModel brandModel) {
        return modelMapper.map(brandModel, BrandModelDto.class);
    }
}
