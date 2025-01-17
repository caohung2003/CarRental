package CarRental.services.map;

public interface MapService {

    public double calculateDistanceBetween2Addresses(
            Double lat1,
            Double lng1,
            Double lat2,
            Double lng2,
            String vehicle
    );
}
