package CarRental.utils.mapper.payment;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import CarRental.dto.wallet.WalletDto;
import CarRental.models.payment.Wallet;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WalletMapper implements Mapper<Wallet, WalletDto> {
    private final ModelMapper modelMapper;

    @Override
    public Wallet mapTo(WalletDto walletDto) {
        return modelMapper.map(walletDto, Wallet.class);
    }

    @Override
    public WalletDto mapFrom(Wallet wallet) {
        return modelMapper.map(wallet, WalletDto.class);
    }
}
