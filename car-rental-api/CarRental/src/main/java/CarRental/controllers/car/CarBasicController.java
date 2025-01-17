package CarRental.controllers.car;

import java.util.List;

import CarRental.dto.car.request.CarRequest;
import CarRental.dto.car.response.CarResponseDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import CarRental.dto.car.CarBasicDto;
import CarRental.models.car.enums.CarStatus;
import CarRental.services.car.CarBasicService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/car-basic")
@RequiredArgsConstructor
public class CarBasicController {
    private final CarBasicService carBasicService;

    @PostMapping("/add")
    public ResponseEntity<CarBasicDto> saveCar(
            @ModelAttribute CarRequest carRequest) {

        return new ResponseEntity<>(carBasicService.addCar(carRequest), HttpStatus.OK);
    }

    @GetMapping("/feature-cars")
    public ResponseEntity<List<CarBasicDto>> getFeatureCars() {
        return new ResponseEntity<>(carBasicService.getFeatureCars(), HttpStatus.OK);

    }

    @GetMapping("/get/{carId}")
    public ResponseEntity<CarBasicDto> getCarById(@PathVariable Long carId) {
        return new ResponseEntity<>(carBasicService.getCarById(carId), HttpStatus.OK);
    }

    @GetMapping("/get-owner/by/owner")
    public ResponseEntity<Page<CarBasicDto>> getAllCarsByCarOwner(
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "order", required = false) String order,
            @RequestParam(value = "status", required = false) CarStatus status,
            Pageable pageable) {

        return new ResponseEntity<>(carBasicService.getAllCarBasicsByOwnerId(status, sort, order, pageable),
                HttpStatus.OK);
    }

    @GetMapping("/get/detail-response/{carId}")
    public ResponseEntity<CarResponseDetail> getCarResponseDetailByCarId(
            @PathVariable Long carId) {
        return new ResponseEntity<>(carBasicService.getCarResponseDetailById(carId), HttpStatus.OK);
    }

    @PutMapping("/disable/{carId}")
    public ResponseEntity<Void> disableCar(@PathVariable Long carId) {
        carBasicService.disableCar(carId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/enable/{carId}")
    public ResponseEntity<Void> enableCar(@PathVariable Long carId) {
        carBasicService.enableCar(carId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
