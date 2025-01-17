package CarRental.services.vnpay;

import java.math.BigDecimal;

public interface VnPayService {
    public String createPayment(BigDecimal amount, String returnedUrl);

    public void getPayment(BigDecimal amount);
}