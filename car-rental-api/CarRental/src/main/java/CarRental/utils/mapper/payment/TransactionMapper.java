package CarRental.utils.mapper.payment;

import CarRental.dto.wallet.TransactionDto;
import CarRental.models.payment.Transaction;
import CarRental.utils.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransactionMapper implements Mapper<Transaction, TransactionDto> {
    private final ModelMapper modelMapper;

    @Override
    public Transaction mapTo(TransactionDto transactionDto) {
        return modelMapper.map(transactionDto, Transaction.class);
    }

    @Override
    public TransactionDto mapFrom(Transaction transaction) {
        return modelMapper.map(transaction, TransactionDto.class);
    }
}
