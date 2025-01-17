package CarRental.dto.wallet;

import java.util.List;

import CarRental.dto.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletDto {
    private Long id;

    private UserDto userDto;

    private Long pendingBalance;

    private Long availableBalance;

    private List<TransactionDto> transactions;
}
