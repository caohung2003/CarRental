package CarRental.repositories.location;

import CarRental.models.location.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WardRepository extends JpaRepository<Ward, Long>{
    @Query("SELECT w FROM Ward w WHERE w.district.city.cityCode = ?1 AND w.district.districtCode = ?2")
    public List<Ward> findAllWardsByCityCodeAndDistrictCode(String cityCode, String districtCode);
}
