package CarRental.repositories.car;

import CarRental.models.car.CarDetail;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CarDetailRepository extends JpaRepository<CarDetail, Long> {
        // only need to extend JpaRepository to get all CRUD methods and pagination
        @Query("SELECT c FROM CarDetail c WHERE c.car.id = :id")
        public Optional<CarDetail> findCarDetailByCarId(@Param("id") Long id);
}
