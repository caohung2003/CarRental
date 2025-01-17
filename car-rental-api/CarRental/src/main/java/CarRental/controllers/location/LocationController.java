package CarRental.controllers.location;

import CarRental.models.location.City;
import CarRental.models.location.District;
import CarRental.models.location.Ward;
import CarRental.services.location.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/location")
public class LocationController {
        private final LocationService locationService;

        @GetMapping(path = "/cities/all")
        public ResponseEntity<List<City>> getAllCities() {
                // return a list of all cities
                return new ResponseEntity<>(
                                locationService.getAllCities(),
                                HttpStatus.OK);
        }

        @GetMapping(path = "/districts/{cityCode}")
        public ResponseEntity<List<District>> getAllDistrictsByCityCode(
                        @PathVariable("cityCode") String cityCode) {
                // return a list of all districts based on a specific city code
                return new ResponseEntity<>(
                                locationService.getAllDistrictsByCityCode(cityCode),
                                HttpStatus.OK);
        }

        @GetMapping(path = "/wards/{cityCode}/{districtCode}")
        public ResponseEntity<List<Ward>> getAllWardsByCityCodeAndDistrictCode(
                        @PathVariable("cityCode") String cityCode,
                        @PathVariable("districtCode") String districtCode) {
                // return a list of all wards based on a specific city code and district code
                return new ResponseEntity<>(
                                locationService.getAllWardsByCityCodeAndDistrictCode(cityCode, districtCode),
                                HttpStatus.OK);
        }

        @GetMapping(path = "/wards/{wardId}")
        public ResponseEntity<Ward> getWardById(
                        @PathVariable("wardId") long id) {
                return new ResponseEntity<>(
                                locationService.getWardById(id),
                                HttpStatus.OK);
        }

        @GetMapping("/get-location/{wardId}")
        public ResponseEntity<?> getLocationResponseByWardId(
                        @PathVariable("wardId") long id) {
                return new ResponseEntity<>(
                                locationService.getLocationResponseByWardId(id),
                                HttpStatus.OK);
        }
}
