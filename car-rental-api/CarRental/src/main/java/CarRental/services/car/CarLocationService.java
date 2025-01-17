package CarRental.services.car;

import CarRental.dto.car.response.SearchResponseCar;
import CarRental.dto.search.SearchRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface CarLocationService  {
    public Page<SearchResponseCar> searchCar(SearchRequest searchRequest, Pageable pageable) throws JsonProcessingException;

    Map<String, Long> countCarByCity ();

    public List<SearchResponseCar> getRelatedCars(Long id, Double lat, Double lngs);

    public List<SearchResponseCar> getAllCarByOwnerId(long ownerId);

    public List<SearchResponseCar> findAll();
}
