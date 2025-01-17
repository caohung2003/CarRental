package CarRental.utils.mapper.user;

import CarRental.dto.user.UserDto;
import CarRental.models.user.User;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper implements Mapper<User, UserDto> {
    private final ModelMapper modelMapper;

    @Override
    public User mapTo(UserDto userDto) {
        return modelMapper.map(userDto, User.class);
    }

    @Override
    public UserDto mapFrom(User user) {
        return modelMapper.map(user, UserDto.class);
    }
}
