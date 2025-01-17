package CarRental.utils.mapper.brand;

import CarRental.dto.brand.BrandDto;
import CarRental.models.brand.Brand;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BrandMapper implements Mapper<Brand, BrandDto> {
    private final ModelMapper modelMapper;
    @Override
    public Brand mapTo(BrandDto brandDto) {
        return modelMapper.map(brandDto, Brand.class);
    }

    @Override
    public BrandDto mapFrom(Brand brand) {
        return modelMapper.map(brand, BrandDto.class);
    }
}
