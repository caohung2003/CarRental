package CarRental.repositories.car;

import CarRental.models.car.CarBasic;
import CarRental.models.car.enums.CarStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarBasicRepository extends JpaRepository<CarBasic, Long> {

    @Query("SELECT c FROM CarBasic c ORDER BY c.noRides DESC, c.rating DESC LIMIT 6")
    public List<CarBasic> findTopCars();

    @Query("SELECT c FROM CarBasic c WHERE c.owner.id = :ownerId AND (:status IS NULL OR c.status = :status)")
    public Page<CarBasic> findAllCarsByOwnerId(
            @Param("ownerId") Long ownerId,
            @Param("status") CarStatus status,
            Pageable pageable);

    @Query("SELECT c FROM CarBasic c WHERE c.status = :status AND (:licensePlate IS NULL OR c.licensePlate LIKE :licensePlate%)")
    public Page<CarBasic> findAllCarsByStatus(
            @Param("status") CarStatus status,
            @Param("licensePlate") String licensePlate,
            Pageable pageable);
}
