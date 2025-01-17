package CarRental.services.location.impl;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import CarRental.dto.location.LocationResponse;
import CarRental.exception.WardNotFoundException;
import CarRental.models.location.City;
import CarRental.models.location.District;
import CarRental.models.location.Ward;
import CarRental.repositories.location.CityRepository;
import CarRental.repositories.location.DistrictRepository;
import CarRental.repositories.location.WardRepository;
import CarRental.services.location.LocationService;
import CarRental.utils.mapper.location.LocationMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {
    private final CityRepository cityRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final LocationMapper locationMapper;

    @Override
    // @Cacheable(value = "cities", cacheManager = "longTimeCacheManager")
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    @Override
    // @Cacheable(value = "districts", cacheManager = "shortTimeCacheManager", key =
    // "#cityCode")
    public List<District> getAllDistrictsByCityCode(String cityCode) {
        return districtRepository.findAllDistrictsByCityCode(cityCode);
    }

    @Override
    // @Cacheable(value = "wards", cacheManager = "shortTimeCacheManager", key =
    // "#cityCode + #districtCode")
    public List<Ward> getAllWardsByCityCodeAndDistrictCode(String cityCode, String districtCode) {
        return wardRepository.findAllWardsByCityCodeAndDistrictCode(cityCode, districtCode);
    }

    @Override
    // @Cacheable(value = "wards", cacheManager = "shortTimeCacheManager", key =
    // "#id")
    public Ward getWardById(long id) {
        return wardRepository.findById(id).orElseThrow(() -> new WardNotFoundException("Ward not found"));
    }

    @Override
    public LocationResponse getLocationResponseByWardId(long id) {
        Ward ward = getWardById(id);
        return locationMapper.mapFrom(ward);
    }
}
