package CarRental.utils.mapper.location;

import org.springframework.stereotype.Component;

import CarRental.dto.location.LocationResponse;
import CarRental.models.location.Ward;

@Component
public class LocationMapper {
    public LocationResponse mapFrom(Ward ward) {
        return LocationResponse.builder()
                .cityCode(ward.getDistrict().getCity().getCityCode())
                .cityName(ward.getDistrict().getCity().getCityName())
                .districtCode(ward.getDistrict().getDistrictCode())
                .districtName(ward.getDistrict().getDistrictName())
                .wardCode(ward.getWardCode())
                .wardId(ward.getId())
                .wardName(ward.getWardName())
                .build();
    }
}
