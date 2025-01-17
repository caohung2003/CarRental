package CarRental.controllers.user;

import CarRental.dto.authentication.ChangePasswordRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import CarRental.dto.user.CarOwnerProfileDto;
import CarRental.dto.user.UserDto;
import CarRental.dto.user.UserProfileDto;
import CarRental.services.user.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<UserDto> getUserInfo() {
        return ResponseEntity.ok().body(userService.getUserInfo());
    }

    @GetMapping("/car-owner-profile/{userId}")
    public ResponseEntity<CarOwnerProfileDto> getUserProfileById(@PathVariable Long userId) {
        return new ResponseEntity<>(userService.getCarOwnerProfileById(userId), HttpStatus.OK);
    }

    @PutMapping("/profile")
    public ResponseEntity<Void> updateUserProfile(@ModelAttribute UserProfileDto userProfileDto) {
        userService.updateUserProfile(userProfileDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        userService.changePassword(changePasswordRequest);
        return ResponseEntity.ok().build();
    }
}
