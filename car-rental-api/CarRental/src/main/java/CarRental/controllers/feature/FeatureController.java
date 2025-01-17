package CarRental.controllers.feature;

import CarRental.models.car.Feature;
import CarRental.services.car.feature.FeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/feature")
public class FeatureController {
    private final FeatureService featureService;


    @GetMapping("/get/by/feature-type")
    public ResponseEntity<List<Feature>> getFeaturesByFeatureType(
            @RequestParam(value = "type") String featureType
    ) {
        return new ResponseEntity<>(featureService.findFeaturesByFeatureType(featureType), HttpStatus.OK);
    }
}
