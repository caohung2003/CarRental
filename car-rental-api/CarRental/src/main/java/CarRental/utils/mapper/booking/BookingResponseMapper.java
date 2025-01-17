package CarRental.utils.mapper.booking;

import org.springframework.stereotype.Component;

import CarRental.dto.booking.BookingResponse;
import CarRental.dto.booking.BookingResponseBasic;
import CarRental.models.booking.Booking;
import CarRental.services.image.ImageService;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class BookingResponseMapper {
    private final ImageService imageService;

    public BookingResponse mapFrom(Booking booking) {
        BookingResponse bookingResponse = BookingResponse.builder()
                .id(booking.getId())
                .carId(booking.getCar().getId())
                .userId(booking.getUser().getId())
                //booking information
                .pickUpDateTime(booking.getPickUpAt())
                .returnDateTime(booking.getReturnAt())
                .numberOfDays(booking.getNumberOfDays())
                .pickUpWardId(booking.getPickUpWard().getId())
                .pickUpLocation(booking.getPickUpLocation())
                .basePrice(booking.getBasePrice())
                .deposit(booking.getDeposit())
                .total(booking.getTotal())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .paymentType(booking.getPaymentType() != null ? booking.getPaymentType().name() : null)
                //messages
                .renterMessage(booking.getCarOwnerMessage())
                .carOwnerMessage(booking.getCarOwnerMessage())
                //driver information
                .driverFirstName(booking.getDriverFirstName())
                .driverLastName(booking.getDriverLastName())
                .driverEmail(booking.getDriverEmail())
                .driverPhone(booking.getDriverPhone())
                .driverDob(booking.getDriverDob())
                .driverNationalId(booking.getDriverNationalId())
                .driverWardId(booking.getDriverWard().getId())
                .driverLocation(booking.getDriverLocation())
                .driverLicenseImageImageUrl(imageService.getImgUrl(booking.getDriverLicenseImageKey()))
                //renter information
                .renterFirstName(booking.getRenterFirstName())
                .renterLastName(booking.getRenterLastName())
                .renterEmail(booking.getRenterEmail())
                .renterPhone(booking.getRenterPhone())
                .renterDob(booking.getRenterDob())
                .renterNationalId(booking.getRenterNationalId())
                .renterWardId(booking.getRenterWard().getId())
                .renterDriverLicenseImageUrl(imageService.getImgUrl(booking.getRenterLicenseImageKey()))
                .renterLocation(booking.getRenterLocation())
                .build();
        return bookingResponse;
    }

    public BookingResponseBasic mapFromBasic(Booking booking) {
        BookingResponseBasic bookingResponse = BookingResponseBasic.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .carId(booking.getCar().getId())
                .pickUpDateTime(booking.getPickUpAt())
                .returnDateTime(booking.getReturnAt())
                .basePrice(booking.getBasePrice())
                .deposit(booking.getDeposit())
                .total(booking.getTotal())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .renterMessage(booking.getRenterMessage())
                .carOwnerMessage(booking.getCarOwnerMessage())
                .numberOfDays(booking.getNumberOfDays())
                .wardId(booking.getPickUpWard().getId())
                .road(booking.getPickUpLocation())
                .actualPickUpAt(booking.getActualPickUpAt())
                .actualReturnAt(booking.getActualReturnAt())
                .paymentType(booking.getPaymentType() != null ? booking.getPaymentType().name() : null)
                .build();
        return bookingResponse;
    }


    public Booking mapTo(BookingResponse b) {
        return null;
    }
}
