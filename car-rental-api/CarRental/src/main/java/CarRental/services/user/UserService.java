package CarRental.services.user;

import CarRental.dto.authentication.ChangePasswordRequest;
import CarRental.dto.user.CarOwnerProfileDto;
import CarRental.dto.user.UserDto;
import CarRental.dto.user.UserProfileDto;
import CarRental.models.user.User;

public interface UserService {
    public UserDto getUserInfo();

    public User getUserFromSecurityContext();

    public CarOwnerProfileDto getCarOwnerProfileById(long id);

    public User getUserById(Long id);

    public void updateUserProfile(UserProfileDto userProfileDto);

    public void changePassword(ChangePasswordRequest changePasswordRequest);

}
