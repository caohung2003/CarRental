package CarRental.services.car.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import CarRental.dto.car.response.SearchResponseCar;
import CarRental.dto.search.SearchRequest;
import CarRental.exception.CarResourceException;
import CarRental.models.car.CarBasic;
import CarRental.models.car.CarLocation;
import CarRental.models.specification.GenericSpecification;
import CarRental.repositories.car.CarLocationRepository;
import CarRental.repositories.user.UserRepository;
import CarRental.services.car.CarBasicService;
import CarRental.services.car.CarLocationService;
import CarRental.services.map.MapService;
import CarRental.utils.mapper.car.SearchCarMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class CarLocationServiceImpl implements CarLocationService {
    private final CarLocationRepository carLocationRepository;
    private final SearchCarMapper searchCarMapper;
    private final MapService mapService;

    private final UserRepository userRepository;

    private final CarBasicService carBasicService;

    @Override
    public Page<SearchResponseCar> searchCar(SearchRequest searchRequest, Pageable pageable) {
        Specification<CarLocation> specification = new GenericSpecification<>(searchRequest);
        double lat = 0, lng = 0;
        for (int i = 0; i < searchRequest.getFilters().size(); i++) {
            if (searchRequest.getFilters().get(i).getField().equals("lat")) {
                lat = Double.parseDouble(searchRequest.getFilters().get(i).getValue().get(0));
            }
            if (searchRequest.getFilters().get(i).getField().equals("lng")) {
                lng = Double.parseDouble(searchRequest.getFilters().get(i).getValue().get(0));
            }
        }

        // if (searchRequest.getSort() != null) {
        // List<Sort.Order> orders = new ArrayList<>();
        // List<CarRental.dto.search.Sort> list = searchRequest.getSort();
        // for (int i = 0; i < list.size(); i++) {
        // if (list.get(i).getName().equals("ratings")) {
        // orders.add(new Sort.Order(
        // list.get(i).getOrder().equals("asc") ? Sort.Direction.ASC :
        // Sort.Direction.DESC,
        // CarLocation.Fields.car
        // + "."
        // + CarBasic.Fields.rating));
        //
        // } else if (list.get(i).getName().equals("rides")) {
        // orders.add(new Sort.Order(
        // list.get(i).getOrder().equals("asc") ? Sort.Direction.ASC :
        // Sort.Direction.DESC,
        // CarLocation.Fields.car
        // + "."
        // + CarBasic.Fields.noRides));
        //
        // } else if (list.get(i).getName().equals("price")) {
        // orders.add(new Sort.Order(
        // list.get(i).getOrder().equals("asc") ? Sort.Direction.ASC :
        // Sort.Direction.DESC,
        // CarLocation.Fields.car
        // + "."
        // + CarBasic.Fields.carPricingEntity
        // + "."
        // + CarPricing.Fields.basePrice));
        // } else if (list.get(i).getName().equals("production")) {
        // orders.add(new Sort.Order(
        // list.get(i).getOrder().equals("asc") ? Sort.Direction.ASC :
        // Sort.Direction.DESC,
        // CarLocation.Fields.car
        // + "."
        // + CarBasic.Fields.yearProduction));
        // }
        //
        // }
        // pageable = PageRequest.of(searchRequest.getPagination().page,
        // searchRequest.getPagination().size, Sort.by(orders));
        // } else {
        pageable = PageRequest.of(searchRequest.getPagination().page, searchRequest.getPagination().size);

        // }
        Page<SearchResponseCar> searchResponseCars = carLocationRepository.findAll(specification, pageable)
                .map(searchCarMapper::mapFrom);
        List<SearchResponseCar> list = searchResponseCars.stream().toList();
        try {
            for (int i = 0; i < list.size(); i++) {
                double latResult = list.get(i).getLat();
                double lngResult = list.get(i).getLng();
                double distance = mapService.calculateDistanceBetween2Addresses(lat, lng, latResult, lngResult, "car");
                list.get(i).setDistance(distance);
            }
        } catch (Exception e) {
            log.info(e.getMessage());
        }

        return new PageImpl<>(list, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()),
                searchResponseCars.getTotalElements());
    }

    /*
     * private double calculateDistance(double lat1, double lng1, double lat2,
     * double lng2) {
     * final int R = 6371; // Radius of the Earth in kilometers
     * 
     * double latDistance = Math.toRadians(lat2 - lat1);
     * double lngDistance = Math.toRadians(lng2 - lng1);
     * 
     * double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
     * + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
     * Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);
     * 
     * double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     * 
     * return R * c; // Distance in kilometers
     * }
     */

    @Override
    @Cacheable(value = "countCarByCity", cacheManager = "longTimeCacheManager")
    public Map<String, Long> countCarByCity() {
        List<Object[]> results = carLocationRepository.countCarsByCity();

        return results.stream().collect(
                Collectors.toMap(entry -> (String) entry[0], entry -> (Long) entry[1]));
    }

    @Override
    public List<SearchResponseCar> getRelatedCars(Long id, Double lat, Double lng) {
        CarBasic carBasic = carBasicService.getCarBasicById(id);
        List<CarLocation> list = carLocationRepository.findRelatedCars(id,
                carBasic.getBrandModel().getBrand().getName(), carBasic.getBrandModel().getName(),
                carBasic.getCarPricingEntity().getBasePrice().doubleValue());
        List<SearchResponseCar> searchResponseCarList = new ArrayList<>();
        if (lat != null && lng != null) {
            try {
                for (int i = 0; i < list.size(); i++) {
                    double latResult = list.get(i).getLat();
                    double lngResult = list.get(i).getLng();
                    if (searchResponseCarList.size() == 10) {
                        break;
                    }
                    double distance = mapService.calculateDistanceBetween2Addresses(lat, lng, latResult, lngResult,
                            "car");
                    if (distance <= 10000) {
                        SearchResponseCar searchResponseCar = searchCarMapper.mapFrom(list.get(i));
                        searchResponseCar.setDistance(distance);
                        searchResponseCarList.add(searchResponseCar);
                    }
                }
            } catch (Exception e) {
                log.info(e.getMessage());
            }

        }
        return searchResponseCarList;
    }

    @Override
    public List<SearchResponseCar> getAllCarByOwnerId(long ownerId) {
        userRepository.findById(ownerId).orElseThrow(() -> new CarResourceException("User not found"));
        return carLocationRepository.findAllByOwnerId(ownerId).stream().map(searchCarMapper::mapFrom)
                .collect(Collectors.toList());
    }

    @Override
    public List<SearchResponseCar> findAll() {
        return carLocationRepository.findAll().stream().map(searchCarMapper::mapFrom).collect(Collectors.toList());
    }
}
