package CarRental.services.car;

import CarRental.dto.brand.BrandDto;
import CarRental.dto.brand.BrandModelDto;
import CarRental.models.brand.Brand;
import CarRental.models.brand.BrandModel;

import java.util.List;

public interface BrandService {
    public List<BrandDto> getAllBrands();

    public List<BrandModelDto> getAllBrandModelsBasedOnBrandId(Long brandId);

    public Brand getBrandByBrandId(long id);

    public BrandModel  getBrandModelByModelId(long id);



}
