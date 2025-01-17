package CarRental.repositories.feature;

import CarRental.models.car.Feature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface FeatureRepository extends JpaRepository<Feature, Long> {
    public Optional<Feature> findFeatureByFeatureNameAndFeatureType(String featureName, String featureType);

    public List<Feature> findFeaturesByFeatureType(String featureType);
}
