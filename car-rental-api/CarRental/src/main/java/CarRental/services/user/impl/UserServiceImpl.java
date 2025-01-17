package CarRental.services.user.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import CarRental.dto.authentication.ChangePasswordRequest;
import CarRental.dto.user.CarOwnerProfileDto;
import CarRental.dto.user.UserDto;
import CarRental.dto.user.UserProfileDto;
import CarRental.exception.AccountResourceException;
import CarRental.exception.ForbiddenOperationException;
import CarRental.exception.InvalidPasswordException;
import CarRental.models.user.User;
import CarRental.repositories.user.UserRepository;
import CarRental.services.image.ImageService;
import CarRental.services.location.LocationService;
import CarRental.services.user.UserService;
import CarRental.utils.mapper.user.ProfileMapper;
import lombok.RequiredArgsConstructor;
import CarRental.services.email.EmailService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;
    private final ImageService imageService;
    private final LocationService locationService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public UserDto getUserInfo() {
        User user = getUserFromSecurityContext();
        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .dob(user.getDob())
                .avatar(imageService.getImgUrl(user.getAvatarImageKey()))
                .driverLicenseImage(imageService.getImgUrl(user.getDriverLicenseImageKey()))
                .nationalId(user.getNationalId())
                .wardId(user.getWard() == null ? null : user.getWard().getId())
                .address(user.getAddress())
                .rating(user.getRating())
                .noBooking(user.getNoBooking())
                .role(user.getRole())
                .build();
        return userDto;
    }


    @Override
    public CarOwnerProfileDto getCarOwnerProfileById(long id) {
        return profileMapper.mapFrom(getUserById(id));
    }

    @Override
    public User getUserFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findOneByEmailIgnoreCase(email)
                .orElseThrow(() -> new AccountResourceException("User not found"));
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NullPointerException("User not found"));
    }

    @Override
    public void updateUserProfile(UserProfileDto ownerProfileDto) {
        validateUser(ownerProfileDto.id());
        User user = getUserById(ownerProfileDto.id());
        user.setFirstName(ownerProfileDto.firstName());
        user.setLastName(ownerProfileDto.lastName());
        user.setDob(ownerProfileDto.dob());
        user.setPhone(ownerProfileDto.phone());
        user.setNationalId(ownerProfileDto.nationalId());
        user.setWard(ownerProfileDto.wardId() == null ? null : locationService.getWardById(ownerProfileDto.wardId()));
        user.setAddress(ownerProfileDto.address());
        if (ownerProfileDto.avatarImage() != null) {
            if (user.getAvatarImageKey() == null) {
                user.setAvatarImageKey("avatar_" + user.getId());
            }
            imageService.uploadImage(ownerProfileDto.avatarImage(), user.getAvatarImageKey());
        }
        if (ownerProfileDto.driverLicenseImage() != null) {
            if (user.getDriverLicenseImageKey() == null) {
                user.setDriverLicenseImageKey("driver_license_" + user.getId());
            }
            imageService.uploadImage(ownerProfileDto.driverLicenseImage(), user.getDriverLicenseImageKey());
        }
        userRepository.save(user);
    }

    @Override
    public void changePassword(ChangePasswordRequest changePasswordRequest) {
        User user = getUserFromSecurityContext();
        if (!passwordEncoder.matches(changePasswordRequest.oldPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(changePasswordRequest.newPassword()));
        userRepository.save(user);
        emailService.sendChangePasswordEmail(user);
    }

    public void validateUser(Long userId) {
        User loggedInUser = getUserFromSecurityContext();
        if (loggedInUser.getId() != userId) {
            throw new ForbiddenOperationException("You are not allowed to perform this operation");
        }
    }


}
