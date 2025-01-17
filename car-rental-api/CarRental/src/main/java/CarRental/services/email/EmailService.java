package CarRental.services.email;

import CarRental.models.booking.Booking;
import CarRental.models.payment.Transaction;
import CarRental.models.car.CarBasic;
import CarRental.models.user.User;

public interface EmailService {
    public void sendEmail(String to, String subject, String text, boolean isHtml, boolean isMultipart);

    public void sendActivationEmail(User user);

    public void sendCreationEmail(User user);

    public void sendPasswordResetEmail(User user);

    public void sendBookingConfirmationEmail(Booking booking, User renter, User carOwner);

    public void sendAcceptedBookingEmail(Booking booking, User renter, User carOwner);

    public void sendDeclinedBookingEmail(Booking booking, User renter, User carOwner);

    public void sendBookingDepositConfirmationEmail(Booking booking, User renter, User carOwner);

    public void sendBookingPickUpConfirmationEmail(Booking booking, User renter, User carOwner);

    public void sendBookingReturnCarConfirmationEmail(Booking booking, User renter, User carOwner);

    public void sendBookingCancelledEmail(Booking booking, User renter, User carOwner);

    public void sendAutoBookingCancelledEmail(Booking booking, User renter, User carOwner);

    public void sendApprovedCarEmail(CarBasic carBasic);

    public void sendDeclinedCarEmail(CarBasic carBasic, String declinedReason);

    public void sendChangePasswordEmail(User user);

    public void sendTransferEmail(User sender, User receiver, Transaction senderTransaction,
            Transaction receiverTransaction);

    public void sendTransferCompleteEmail(User user, Transaction transaction);

    public void sendRefundEmail(User sender, User receiver, Transaction senderTransaction,
            Transaction receiverTransaction);

    public void sendTopUpConfirmEmail(User user, Transaction transaction);

    public void sendWithdrawalConfirmEmail(User user, Transaction transaction);

    public void sendWithdrawalEmail(User user, Transaction transaction);
}
