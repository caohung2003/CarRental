package CarRental.services.car.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import CarRental.dto.brand.BrandDto;
import CarRental.dto.brand.BrandModelDto;
import CarRental.models.brand.Brand;
import CarRental.models.brand.BrandModel;
import CarRental.repositories.brand.BrandModelRepository;
import CarRental.repositories.brand.BrandRepository;
import CarRental.services.car.BrandService;
import CarRental.utils.mapper.brand.BrandMapper;
import CarRental.utils.mapper.brand.BrandModelMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;
    private final BrandModelRepository brandModelRepository;
    private final BrandMapper brandMapper;
    private final BrandModelMapper brandModelMapper;
    
    @Override
    public List<BrandDto> getAllBrands() {
        return brandRepository.findAll().stream().map(brandMapper::mapFrom).collect(Collectors.toList());
    }

    @Override
    public List<BrandModelDto> getAllBrandModelsBasedOnBrandId(Long brandId) {
        return brandModelRepository.findAllModelNameBasedOnBrandId(brandId).stream().map(brandModelMapper::mapFrom).collect(Collectors.toList());
    }

    @Override
    public Brand getBrandByBrandId(long id) {
        return brandRepository.findById(id).orElseThrow();
    }

    @Override
    public BrandModel getBrandModelByModelId(long id) {
        return brandModelRepository.findById(id).orElseThrow();
    }


}
