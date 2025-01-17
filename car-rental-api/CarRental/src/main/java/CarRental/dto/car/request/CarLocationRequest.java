package CarRental.dto.car.request;

public record CarLocationRequest(
         Long wardId,

         String road,

         Double lat,

         Double lng
) {
}
