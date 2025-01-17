package CarRental.dto.location;

import lombok.Builder;

@Builder
public record LocationResponse(
        String cityCode,
        String cityName,
        String districtCode,
        String districtName,
        String wardCode,
        Long wardId,
        String wardName
) {
    
}
