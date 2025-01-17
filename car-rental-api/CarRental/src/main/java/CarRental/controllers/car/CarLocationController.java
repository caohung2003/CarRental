package CarRental.controllers.car;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

import CarRental.dto.car.response.SearchResponseCar;
import CarRental.dto.search.SearchRequest;
import CarRental.services.car.CarLocationService;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/car-location")
public class CarLocationController {
    private final CarLocationService carLocationService;

    @PostMapping("/search")
    public ResponseEntity<Page<SearchResponseCar>> getAllCarBasicsByUserSearch(
            @RequestBody SearchRequest searchRequest,
            Pageable pageable
    ) throws JsonProcessingException {
        //return all car basics based on user search
        return new ResponseEntity<>(
                carLocationService.searchCar(
                        searchRequest,
                        pageable
                ),
                HttpStatus.OK
        );
    }

    @GetMapping( "/car-count-by-city")
    public Map<String ,Long>getCarCountByCity() {
        Map<String, Long> carCountByCity = carLocationService.countCarByCity() ;
        return carCountByCity;
    }

    @GetMapping("/get/related-car/{carId}")
    public ResponseEntity<List<SearchResponseCar>> getAllRelatedCar(
            @PathVariable Long carId,
            @RequestParam(value = "lat") Double lat,
            @RequestParam(value = "lng") Double lng) {

        return new ResponseEntity<>(carLocationService.getRelatedCars(carId, lat, lng), HttpStatus.OK);
    }

    @GetMapping("/get/owner-car/{ownerId}")
    public ResponseEntity<List<SearchResponseCar>> getAllCarByOwnerId(
            @PathVariable Long ownerId
    ) {
        return new ResponseEntity<>(carLocationService.getAllCarByOwnerId(ownerId), HttpStatus.OK);
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<SearchResponseCar>> getAllCarLocation() {
        return new ResponseEntity<>(carLocationService.findAll(), HttpStatus.OK);
    }

}
