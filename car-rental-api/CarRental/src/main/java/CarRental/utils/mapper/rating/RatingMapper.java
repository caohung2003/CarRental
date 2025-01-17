package CarRental.utils.mapper.rating;

import CarRental.dto.car.CarDetailDto;
import CarRental.dto.rating.RatingDto;
import CarRental.models.car.CarDetail;
import CarRental.models.rating.Rating;
import CarRental.services.image.ImageService;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RatingMapper implements Mapper<Rating, RatingDto> {
    private final ModelMapper modelMapper;

    private final ImageService imageService;

    @Override
    public Rating mapTo(RatingDto ratingDto) {
        return modelMapper.map(ratingDto, Rating.class);
    }

    @Override
    public RatingDto mapFrom(Rating rating) {

        RatingDto ratingDto = modelMapper.map(rating, RatingDto.class);
        ratingDto.setReceiverAvatar(imageService.getImgUrl(rating.getReceiver().getAvatarImageKey()));
        ratingDto.setSenderAvatar(imageService.getImgUrl(rating.getSender().getAvatarImageKey()));
        return ratingDto;
    }
}
