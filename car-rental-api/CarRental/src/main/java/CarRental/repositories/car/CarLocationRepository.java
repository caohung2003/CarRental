package CarRental.repositories.car;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import CarRental.models.car.CarLocation;

@Repository
public interface CarLocationRepository extends JpaRepository<CarLocation, Long> {

        public Page<CarLocation> findAll(
                        Specification<CarLocation> spec,
                        Pageable pageable);

        @Query("SELECT c FROM CarLocation c WHERE c.car.status = 'AVAILABLE'")
        public List<CarLocation> findAll();

        @Query("SELECT cl.ward.district.city.cityName, " +
                        "COUNT(DISTINCT cl.car) " +
                        "FROM CarLocation cl " +
                        "GROUP BY cl.ward.district.city.cityName")
        List<Object[]> countCarsByCity();

        @Query("SELECT c " +
                        "FROM CarLocation c " +
                        "WHERE c.car.id != :id  AND c.car.status = 'AVAILABLE'" +
                        "ORDER BY " +
                        "  ABS(:price - c.car.carPricingEntity.basePrice) ASC, " +
                        "  CASE WHEN SOUNDEX(c.car.brandModel.brand.name) = SOUNDEX(:brand) THEN 1 ELSE 0 END DESC, " +
                        "  CASE WHEN c.car.brandModel.brand.name LIKE CONCAT('%', :brand, '%') THEN 1 ELSE 0 END DESC, "
                        +
                        "  LENGTH(c.car.brandModel.brand.name) - LENGTH(REPLACE(c.car.brandModel.brand.name, :brand, '')) ASC, "
                        +
                        "  CASE WHEN SOUNDEX(c.car.brandModel.name) = SOUNDEX(:model) THEN 1 ELSE 0 END DESC, " +
                        "  CASE WHEN c.car.brandModel.name LIKE CONCAT('%', :model, '%') THEN 1 ELSE 0 END DESC, " +
                        "  LENGTH(c.car.brandModel.name) - LENGTH(REPLACE(c.car.brandModel.name, :model, '')) ASC," +
                        "  c.car.rating DESC")
        public List<CarLocation> findRelatedCars(
                        @Param("id") Long id,
                        @Param("brand") String brand,
                        @Param("model") String model,
                        @Param("price") Double price);

        @Query("SELECT c FROM CarLocation c WHERE c.car.owner.id = :owner AND c.car.status = 'AVAILABLE'")
        public List<CarLocation> findAllByOwnerId(@Param("owner") long ownerId);

}
