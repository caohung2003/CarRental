package CarRental.services.car.impl;

import CarRental.dto.car.*;
import CarRental.dto.car.request.CarBusyCalendarRequest;
import CarRental.dto.car.request.CarLocationRequest;
import CarRental.dto.car.request.CarRequest;
import CarRental.dto.car.request.FeatureRequest;
import CarRental.dto.car.response.CarResponseDetail;
import CarRental.dto.car.response.SearchResponseCar;
import CarRental.exception.CarResourceException;
import CarRental.exception.ForbiddenOperationException;
import CarRental.exception.WardNotFoundException;
import CarRental.exception.InvalidStepException;
import CarRental.models.car.*;
import CarRental.models.car.enums.CarBusyReason;
import CarRental.models.car.enums.CarStatus;
import CarRental.models.location.Ward;
import CarRental.models.user.Role;
import CarRental.models.user.User;
import CarRental.repositories.car.*;
import CarRental.services.car.BrandService;
import CarRental.services.car.CarBasicService;
import CarRental.services.car.CarBusyCalendarService;
import CarRental.services.car.feature.FeatureService;
import CarRental.services.email.EmailService;
import CarRental.services.image.ImageService;
import CarRental.services.location.LocationService;
import CarRental.services.user.UserService;
import CarRental.utils.mapper.car.CarBasicMapper;
import CarRental.utils.mapper.car.CarResponseMapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;

import org.springframework.boot.json.JsonParseException;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Log
@Service
@RequiredArgsConstructor
public class CarBasicServiceImpl implements CarBasicService {
    private final CarBasicRepository carBasicRepository;
    private final CarBusyCalendarService carBusyCalendarService;
    private final CarBasicMapper carBasicMapper;
    private final UserService userService;
    private final BrandService brandService;
    private final LocationService locationService;
    private final CarDetailRepository carDetailRepository;
    private final CarPricingRepository carPricingRepository;
    private final CarLocationRepository carLocationRepository;
    private final CarBusyCalendarRepository carBusyCalendarRepository;
    private final ImageService imageService;
    private final Jackson2ObjectMapperBuilder mapperBuilder;
    private final FeatureService featureService;
    private final CarResponseMapper carResponseMapper;
    private final EmailService emailService;

    @Override
    public CarBasicDto getCarById(Long id) {
        CarBasic carBasic = getCarBasicById(id);
        if (carBasic == null) {
            throw new CarResourceException("Car not found");
        }
        return carBasicMapper.mapFrom(
                carBasic);
    }

    @Override
    public CarBasicDto addCar(CarRequest carRequest) {
        User user = userService.getUserFromSecurityContext();
        long carDetailId = 0, carPricingId = 0;
        CarBasic existCarBasic = null;
        CarDetail existCarDetail = null;
        CarBasic carBasic = CarBasic.builder()
                .endRent(carRequest.end())
                .startRent(carRequest.start())
                .brandModel(brandService.getBrandModelByModelId(carRequest.brandModelId()))
                .autoCancelHoursAfterConfirmation(carRequest.autoCancelHoursAfterConfirmation())
                .autoCancelHoursAfterPending(carRequest.autoCancelHoursAfterPending())
                .fuel(carRequest.fuel())
                .transmission(carRequest.transmission())
                .licensePlate(carRequest.licensePlate())
                .insuranceStatus(false)
                .owner(user)
                .noRides(0)
                .noSeat(carRequest.noSeat())
                .rating(5.0)
                .yearProduction(carRequest.yearProduction())
                .status(CarStatus.WAIT_FOR_APPROVAL)
                .createdBy(user)
                .build();
        if (carRequest.id() != null) {
            existCarBasic = getCarBasicById(carRequest.id());
            if (user.getId() != existCarBasic.getOwner().getId()) {
                throw new ForbiddenOperationException("You are not the owner of this car");
            }
            carBasic.setId(carRequest.id());
            carBasic.setCreatedAt(existCarBasic.getCreatedAt());
            carBasic.setRating(existCarBasic.getRating());
            carBasic.setNoRides(existCarBasic.getNoRides());
            carBasic.setUpdatedAt(LocalDateTime.now());
            carBasic.setUpdatedBy(user);
            carBasic.setInsuranceStatus(existCarBasic.getInsuranceStatus());
            for (int i = 0; i < existCarBasic.getCarLocations().size(); i++) {
                carLocationRepository.deleteById(existCarBasic.getCarLocations().get(i).getId());
            }
            for (int i = 0; i < existCarBasic.getCarCalendarEntityList().size(); i++) {
                if (existCarBasic.getCarCalendarEntityList().get(i).getBusyReason() == CarBusyReason.OWN_REASONS)
                    carBusyCalendarRepository.deleteById(existCarBasic.getCarCalendarEntityList().get(i).getId());
            }

            existCarDetail = carDetailRepository.findCarDetailByCarId(carRequest.id())
                    .orElseThrow(() -> new WardNotFoundException(""));
            carDetailId = existCarDetail.getId();
            carPricingId = carPricingRepository.findByCarId(carRequest.id()).get().getId();
        } else {
            carBasic.setInsuranceStatus(false);
            carBasic.setCreatedAt(LocalDateTime.now());
        }
        if (existCarBasic != null) {
            carBasic.setInspectionImageKey(existCarBasic.getInspectionImageKey());
            carBasic.setRegistrationImageKey(existCarBasic.getRegistrationImageKey());
            carBasic.setInsuranceImageKey(existCarBasic.getInsuranceImageKey());
        }
        carBasic.setCarLocations(new ArrayList<>());
        carBasic.setCarCalendarEntityList(new ArrayList<>());
        CarBasic savedCarBasic = carBasicRepository.save(carBasic);
        if (carRequest.inspectionImageFile() != null) {
            imageService.uploadImage(carRequest.inspectionImageFile(), "inspection_image_" + savedCarBasic.getId());
            savedCarBasic.setInspectionImageKey("inspection_image_" + savedCarBasic.getId());
        }
        if (carRequest.registrationImageFile() != null) {
            imageService.uploadImage(carRequest.registrationImageFile(), "registration_image_" + savedCarBasic.getId());
            savedCarBasic.setRegistrationImageKey("registration_image_" + savedCarBasic.getId());
        }
        if (carRequest.insuranceImageFile() != null) {
            savedCarBasic.setInsuranceStatus(false);
            imageService.uploadImage(carRequest.insuranceImageFile(), "insurance_image_" + savedCarBasic.getId());
            savedCarBasic.setInsuranceImageKey("insurance_image_" + savedCarBasic.getId());
        }
        CarPricing carPricing = CarPricing.builder()
                .car(savedCarBasic)
                .basePrice(carRequest.basePrice())
                .requiredDeposit(carRequest.requiredDeposit())
                .basePriceMethod(carRequest.basePriceMethod())
                .build();
        if (carPricingId != 0) {
            carPricing.setId(carPricingId);
        }
        // carPricingRepository.save(carPricing);
        CarDetail carDetail = CarDetail.builder()
                .car(savedCarBasic)
                .description(carRequest.description())
                .fuelConsumption(carRequest.fuelConsumption())
                .mileage(carRequest.mileage())
                .build();
        if (carDetailId != 0) {
            carDetail.setId(carDetailId);
        }
        // CarDetail savedCarDetail = carDetailRepository.save(carDetail);
        if (carRequest.frontImageFile() != null) {
            imageService.uploadImage(carRequest.frontImageFile(), "front_image_" + savedCarBasic.getId());
            carDetail.setFrontImageKey("front_image_" + savedCarBasic.getId());
        } else {
            if (existCarDetail != null)
                carDetail.setFrontImageKey(existCarDetail.getFrontImageKey());
        }

        if (carRequest.backImageFile() != null) {
            imageService.uploadImage(carRequest.backImageFile(), "back_image_" + savedCarBasic.getId());
            carDetail.setBackImageKey("back_image_" + savedCarBasic.getId());
        } else {
            if (existCarDetail != null)
                carDetail.setBackImageKey(existCarDetail.getBackImageKey());
        }
        if (carRequest.leftImageFile() != null) {
            imageService.uploadImage(carRequest.leftImageFile(), "left_image_" + savedCarBasic.getId());
            carDetail.setLeftImageKey("left_image_" + savedCarBasic.getId());
        } else {
            if (existCarDetail != null)
                carDetail.setLeftImageKey(existCarDetail.getLeftImageKey());
        }
        if (carRequest.rightImageFile() != null) {
            imageService.uploadImage(carRequest.rightImageFile(), "right_image_" + savedCarBasic.getId());
            carDetail.setRightImageKey("right_image_" + savedCarBasic.getId());
        } else {
            if (existCarDetail != null)
                carDetail.setRightImageKey(existCarDetail.getRightImageKey());
        }

        ObjectMapper objectMapper = mapperBuilder.build();
        List<CarLocationRequest> carLocationsRequests = new ArrayList<>();
        List<CarBusyCalendarRequest> carBusyCalendarRequests = new ArrayList<>();
        List<FeatureRequest> sets = new ArrayList<>();
        log.info("Car calendar: " + carRequest.carBusyCalendars());
        log.info("Car location: " + carRequest.carLocations());
        try {
            if (carRequest.carLocations() != null) {
                carLocationsRequests = objectMapper.readValue(carRequest.carLocations(),
                        new TypeReference<List<CarLocationRequest>>() {
                        });

            }
            log.info("null");

            if (carRequest.features() != null) {
                sets = objectMapper.readValue(carRequest.features(), new TypeReference<List<FeatureRequest>>() {
                });
            }
            log.info("null");
            if (carRequest.carBusyCalendars() != null) {
                carBusyCalendarRequests = objectMapper.readValue(carRequest.carBusyCalendars(),
                        new TypeReference<List<CarBusyCalendarRequest>>() {
                        });
            }
        } catch (Exception e) {
            throw new JsonParseException();
        }
        Set<Feature> featureSet = new HashSet<>();
        for (int i = 0; i < sets.size(); i++) {
            featureSet.add(featureService.findFeatureByFeatureNameAndFeatureType(sets.get(i).featureName(),
                    sets.get(i).featureType()));
        }
        List<CarBusyCalendar> carBusyCalendars = new ArrayList<>();
        for (int i = 0; i < carBusyCalendarRequests.size(); i++) {
            CarBusyCalendar carBusyCalendar = CarBusyCalendar.builder()
                    .car(savedCarBasic)
                    .busyReason(CarBusyReason.OWN_REASONS)
                    .start(carBusyCalendarRequests.get(i).start())
                    .end(carBusyCalendarRequests.get(i).end())
                    .build();
            carBusyCalendarRepository.save(carBusyCalendar);
        }
        List<CarLocation> carLocations = new ArrayList<>();

        for (int i = 0; i < carLocationsRequests.size(); i++) {

            Ward ward = locationService.getWardById(carLocationsRequests.get(i).wardId());
            CarLocation carLocation = CarLocation.builder()
                    .car(savedCarBasic)
                    .lat(carLocationsRequests.get(i).lat())
                    .lng(carLocationsRequests.get(i).lng())
                    .ward(ward)
                    .road(carLocationsRequests.get(i).road())
                    .build();
            carLocationRepository.save(carLocation);
        }
        savedCarBasic.setFeatures(featureSet);
        savedCarBasic.setCarDetailEntity(carDetail);
        savedCarBasic.setCarPricingEntity(carPricing);
        carBasicRepository.save(savedCarBasic);
        return carBasicMapper.mapFrom(savedCarBasic);
    }

    @Override
    @Cacheable(value = "featureCars", cacheManager = "longTimeCacheManager")
    public List<CarBasicDto> getFeatureCars() {
        return carBasicRepository.findTopCars().stream()
                .map(carBasicMapper::mapFrom)
                .collect(Collectors.toList());
    }

    @Override
    @SuppressWarnings("null")
    public CarBasic getCarBasicById(Long id) {
        return carBasicRepository
                .findById(id)
                .orElseThrow(() -> new CarResourceException("Car not found"));
    }

    @Override
    public Page<CarBasicDto> getAllCarBasicsByOwnerId(CarStatus status, String sort, String order, Pageable pageable) {
        User user = userService.getUserFromSecurityContext();
        List<Sort.Order> orders = new ArrayList<>();

        if (sort == null) {
            orders.add(new Sort.Order(
                    Sort.Direction.ASC, "id"));
            pageable = PageRequest.of(pageable.getPageNumber(), 5, Sort.by(orders));
        } else {
            orders.add(new Sort.Order(
                    ("asc").equals(order) ? Sort.Direction.ASC : Sort.Direction.DESC,
                    sort));
            orders.add(new Sort.Order(
                    Sort.Direction.ASC, "id"));
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(orders));

        }

        Page<CarBasic> page = carBasicRepository.findAllCarsByOwnerId(
                user.getId(),
                status,
                pageable);
        return page.map(carBasicMapper::mapFrom);
    }

    @Override
    public void validateCarOwner(Long carId, User carOwner) {
        CarBasic carBasic = getCarBasicById(carId);
        if (carBasic.getOwner().getId() != carOwner.getId()) {
            throw new ForbiddenOperationException("User is not owner of this car");
        }
    }

    @Override
    public void validateCarAvailabilityToBooking(Long carId, LocalDateTime pickTime, LocalDateTime dropTime)
            throws CarResourceException {
        // Check if car is busy
        if (carBusyCalendarService.checkTimeCarBusy(carId, pickTime, dropTime) != null) {
            boolean isBusy = carBusyCalendarService.checkTimeCarBusy(carId, pickTime, dropTime).size() > 0;
            if (isBusy) {
                throw new CarResourceException("Car is not available during the specified time");
            }
        }

        // Check status: Car can be booked if it has status: AVAILABLE or IN_USE
        CarBasic car = getCarBasicById(carId);
        if (car.getStatus() != CarStatus.AVAILABLE && car.getStatus() != CarStatus.IN_USE) {
            throw new CarResourceException("Car is not available for booking");
        }
    }

    @Override
    public void disableCar(Long carId) {
        User user = userService.getUserFromSecurityContext();
        validateCarOwner(carId, user);
        CarBasic car = getCarBasicById(carId);
        // check current status of car
        if (car.getStatus() != CarStatus.AVAILABLE && car.getStatus() != CarStatus.IN_USE) {
            throw new InvalidStepException("Car is not available for disable");
        }
        car.setStatus(CarStatus.STOPPED);
        carBasicRepository.save(car);
    }

    @Override
    public void enableCar(Long carId) {
        User user = userService.getUserFromSecurityContext();
        validateCarOwner(carId, user);
        // check current status of car
        if (getCarBasicById(carId).getStatus() != CarStatus.STOPPED) {
            throw new InvalidStepException("Car is not available for enable");
        }
        CarBasic car = getCarBasicById(carId);
        car.setStatus(CarStatus.AVAILABLE);
        carBasicRepository.save(car);
    }

    @Override
    public CarResponseDetail getCarResponseDetailById(Long carId) {
        User user = userService.getUserFromSecurityContext();
        CarBasic carBasic = carBasicRepository.findById(carId)
                .orElseThrow(() -> new WardNotFoundException("Car not found"));
        // CarResponseDetail carResponseDetail = CarResponseDetail.builder()
        // .carCalendar(carBasic.getCarCalendarEntityList())
        // .build();
        CarResponseDetail carResponseDetail = carResponseMapper.mapFrom(
                carBasicRepository.findById(carId).orElseThrow(() -> new WardNotFoundException("Car not found")));
        //
        if (user.getId() != carResponseDetail.getOwner().getOwnerId() &&
                user.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("");
        }
        return carResponseDetail;
    }

    @Override
    public Page<CarBasicDto> getAllWaitForApprovalCars(String licensePlate, Pageable pageable) {
        User user = userService.getUserFromSecurityContext();
        if (user.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("You are not permitted to view this content");
        }
        pageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(CarBasic.Fields.updatedAt).descending()
                        .by(CarBasic.Fields.createdAt).descending()
                        .by(CarBasic.Fields.id).ascending());
        Page<CarBasic> carBasics = carBasicRepository.findAllCarsByStatus(CarStatus.WAIT_FOR_APPROVAL, licensePlate,
                pageable);
        return carBasics.map(carBasicMapper::mapFrom);
    }

    @Override
    public void approveCar(Long carId, boolean insuranceStatus) {
        // TODO Auto-generated method stub
        CarBasic carBasic = getCarBasicById(carId);
        carBasic.setInsuranceStatus(insuranceStatus);
        carBasic.setStatus(CarStatus.AVAILABLE);
        carBasicRepository.save(carBasic);
        emailService.sendApprovedCarEmail(carBasic);
    }

    @Override
    public void declineCar(Long carId, String declinedReason) {
        CarBasic carBasic = getCarBasicById(carId);
        carBasic.setStatus(CarStatus.DECLINED);
        carBasic.setDeclinedReason(declinedReason);
        carBasicRepository.save(carBasic);
        emailService.sendDeclinedCarEmail(carBasic, declinedReason);
    }
}
