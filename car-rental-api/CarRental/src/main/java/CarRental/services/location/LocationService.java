package CarRental.services.location;

import CarRental.dto.location.LocationResponse;
import CarRental.models.location.City;
import CarRental.models.location.District;
import CarRental.models.location.Ward;

import java.util.List;

public interface LocationService {
    public List<City> getAllCities();

    public List<District> getAllDistrictsByCityCode(String cityCode);

    public List<Ward> getAllWardsByCityCodeAndDistrictCode(String cityCode, String districtCode);

    public Ward getWardById(long id);

    public LocationResponse getLocationResponseByWardId(long id);
}
