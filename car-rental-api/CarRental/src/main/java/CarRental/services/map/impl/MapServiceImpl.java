package CarRental.services.map.impl;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import CarRental.services.map.MapService;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class MapServiceImpl implements MapService {
    private String apiUrl = "https://router.hereapi.com/v8/routes";
    private final RestTemplate restTemplate;

    @Override
    public double calculateDistanceBetween2Addresses(
            Double lat1,
            Double lng1,
            Double lat2,
            Double lng2,
            String vehicle
    ) {
        String apiUrlWithParams =
                apiUrl
                                      + "?apiKey=uMr3fUqwW98SKgEF-9ulIGIBLdmpahpgLhlap-dSXNU"
                       // + "?apiKey=DLHxv4sj5t5D1csCx514z0camNIoBgH5bZcEBFA3UGw"
                        //+ "?apiKey=uMr3fUqwW98SKgEF-9ulIGIBLdmpahpgLhlap-dSXNU"
                        + "&origin=" + lat1 + "," + lng1
                        + "&destination=" + lat2 + "," + lng2
                        + "&transportMode=" + vehicle
                        + "&return=summary";
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(apiUrlWithParams, String.class);

        try {
            if (responseEntity.getStatusCode().is2xxSuccessful()) {
                String responseData = responseEntity.getBody();
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(responseData);
                double distance = jsonNode
                        .path("routes")
                        .path(0)
                        .path("sections")
                        .path(0)
                        .path("summary")
                        .path("length")
                        .asDouble();
                // Xử lý dữ liệu nhận được từ API
                return distance;
            } else {
                // Xử lý lỗi nếu có
                return 0;
            }
        }catch (Exception e) {
            return 0;
        }

    }
}
