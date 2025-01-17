package CarRental.services.car.feature;

import CarRental.models.car.Feature;

import java.util.List;
public interface FeatureService {
    public Feature findFeatureByFeatureNameAndFeatureType(String featureName, String featureType);

    public List<Feature> findFeaturesByFeatureType(String featureType);
}
