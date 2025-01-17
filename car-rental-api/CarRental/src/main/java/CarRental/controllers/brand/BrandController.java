package CarRental.controllers.brand;

import CarRental.dto.brand.BrandDto;
import CarRental.dto.brand.BrandModelDto;
import CarRental.services.car.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
@RequestMapping("/api/v1/brand")
@RequiredArgsConstructor
public class BrandController {
    private final BrandService brandService;

    @GetMapping("/brand-name/all")
    public ResponseEntity<List<BrandDto>> getAllBrandNames() {
        return new ResponseEntity<>(
                brandService.getAllBrands(),
                HttpStatus.OK
        );
    }


    @GetMapping("/brand-model/{brandId}")
    public ResponseEntity<List<BrandModelDto>> getAllBrandModelsByBrandName(
            @PathVariable Long brandId
    ) {
        return new ResponseEntity<>(
          brandService.getAllBrandModelsBasedOnBrandId(brandId),
          HttpStatus.OK
        );
    }
}
