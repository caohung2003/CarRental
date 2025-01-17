package CarRental.utils.mapper.user;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import CarRental.dto.user.CarOwnerProfileDto;
import CarRental.models.user.User;
import CarRental.services.image.ImageService;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProfileMapper implements Mapper<User, CarOwnerProfileDto> {
    private final ModelMapper modelMapper;

    private final ImageService imageService;

    @Override
    public User mapTo(CarOwnerProfileDto profileDto) {
        return modelMapper.map(profileDto, User.class);
    }

    @Override
    public CarOwnerProfileDto mapFrom(User user) {
        // OwnerProfileDto profileDto = modelMapper.map(user, OwnerProfileDto.class);
        CarOwnerProfileDto profileDto = CarOwnerProfileDto.builder()
                .ownerId(user.getId())
                .phone(user.getPhone())
                .avatar(imageService.getImgUrl(user.getAvatarImageKey()))
                .noBooking(user.getNoBooking())
                .lastName(user.getLastName())
                .firstName(user.getFirstName())
                .rating(user.getRating())
                .email(user.getEmail())
                .build();
        return profileDto;
    }
}
