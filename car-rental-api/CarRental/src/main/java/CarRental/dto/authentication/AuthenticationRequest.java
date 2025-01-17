package CarRental.dto.authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {
  @NotBlank
  @Size(max = 60) 
  @Email
  private String email;

  @NotBlank
  @Size(min = 6, max = 40)
  String password;

  boolean rememberMe;
}