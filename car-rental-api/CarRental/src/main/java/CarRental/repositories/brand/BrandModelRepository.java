package CarRental.repositories.brand;

import CarRental.models.brand.BrandModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandModelRepository extends JpaRepository<BrandModel, Long> {
    @Query("SELECT b FROM BrandModel b WHERE b.brand.id = :brandId")
    public List<BrandModel> findAllModelNameBasedOnBrandId(Long brandId);

}

