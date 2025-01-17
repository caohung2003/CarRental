package CarRental.exception;

public class TransactionExistedException extends RuntimeException {
    public TransactionExistedException(String message) {
        super(message);
    }
}
