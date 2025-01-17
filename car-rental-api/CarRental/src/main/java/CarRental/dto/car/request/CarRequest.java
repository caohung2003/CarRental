package CarRental.dto.car.request;

import CarRental.models.car.enums.CarStatus;
import CarRental.models.car.enums.Fuel;
import CarRental.models.car.enums.PriceMethod;
import CarRental.models.car.enums.Transmission;
import jakarta.annotation.Nullable;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record CarRequest(
        @Nullable Long id,

        String licensePlate,

        Long brandModelId,

        Integer yearProduction,

        Integer noSeat,

        Transmission transmission,

        Fuel fuel,

        @Nullable MultipartFile registrationImageFile,

        @Nullable MultipartFile inspectionImageFile,

        @Nullable MultipartFile insuranceImageFile,

        LocalDateTime start,

        LocalDateTime end,

        Integer autoCancelHoursAfterPending,

        Integer autoCancelHoursAfterConfirmation,

        Integer mileage,

        Integer fuelConsumption,

        String description,

        @Nullable MultipartFile frontImageFile,

        @Nullable MultipartFile backImageFile,

        @Nullable MultipartFile leftImageFile,

        @Nullable MultipartFile rightImageFile,

        BigDecimal basePrice,

        BigDecimal requiredDeposit,

        PriceMethod basePriceMethod,

        @Nullable String carLocations,

        @Nullable String carBusyCalendars,

        @Nullable String features

) {
}
