package CarRental.repositories.car;

import CarRental.models.car.CarPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarPricingRepository extends JpaRepository<CarPricing, Long> {
    public Optional<CarPricing> findById(long id);

    @Query("SELECT c FROM CarPricing c WHERE c.car.id = :id")
    public Optional<CarPricing> findByCarId(@Param("id") Long carId);
}
