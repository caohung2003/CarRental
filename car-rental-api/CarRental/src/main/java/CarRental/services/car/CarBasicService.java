package CarRental.services.car;

import CarRental.dto.car.CarBasicDto;
import CarRental.dto.car.request.CarRequest;
import CarRental.dto.car.response.CarResponseDetail;
import CarRental.dto.car.response.SearchResponseCar;
import CarRental.exception.CarResourceException;
import CarRental.models.car.CarBasic;
import CarRental.models.car.enums.CarStatus;
import CarRental.models.user.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.*;

public interface CarBasicService {

        public CarBasicDto getCarById(Long id);

        public CarBasicDto addCar(CarRequest carRequest);

        public List<CarBasicDto> getFeatureCars();

        public CarBasic getCarBasicById(Long id);

        public Page<CarBasicDto> getAllCarBasicsByOwnerId(
                        CarStatus status,
                        String sort,
                        String order,
                        Pageable pageable);

        public void validateCarOwner(Long carId, User carOwner);

        public void validateCarAvailabilityToBooking(Long carId, LocalDateTime pickTime, LocalDateTime dropTime)
                        throws CarResourceException;

        public void disableCar(Long carId);

        public void enableCar(Long carId);

        public CarResponseDetail getCarResponseDetailById(Long carId);

        public Page<CarBasicDto> getAllWaitForApprovalCars(String licensePlate, Pageable pageable);

        public void approveCar(Long carId, boolean insuranceStatus);

        public void declineCar(Long carId, String declinedReason);
}
