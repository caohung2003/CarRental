package CarRental.services.car.feature.impl;

import CarRental.exception.WardNotFoundException;
import CarRental.models.car.Feature;
import CarRental.repositories.feature.FeatureRepository;
import CarRental.services.car.feature.FeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeatureServiceImpl implements FeatureService {
    private final FeatureRepository featureRepository;
    @Override
    public Feature findFeatureByFeatureNameAndFeatureType(String featureName, String featureType) {
        return featureRepository.findFeatureByFeatureNameAndFeatureType(featureName, featureType).orElseThrow(() -> new WardNotFoundException("Feature not found"));
    }

    @Override
    public List<Feature> findFeaturesByFeatureType(String featureType) {
        return featureRepository.findFeaturesByFeatureType(featureType);
    }
}
