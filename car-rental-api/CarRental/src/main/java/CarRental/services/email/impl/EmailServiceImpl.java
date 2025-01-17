package CarRental.services.email.impl;

import java.nio.charset.StandardCharsets;

import java.time.LocalDateTime;

import java.time.format.DateTimeFormatter;

import java.util.HashMap;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.mail.MailException;

import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.scheduling.annotation.Async;

import org.springframework.stereotype.Service;

import org.thymeleaf.context.Context;

import org.thymeleaf.spring5.SpringTemplateEngine;

import CarRental.models.booking.Booking;
import CarRental.models.car.CarBasic;
import CarRental.models.payment.Transaction;

import CarRental.models.user.User;

import CarRental.services.email.EmailService;

import CarRental.utils.DateTimeUtil;

import jakarta.mail.MessagingException;

import jakarta.mail.internet.AddressException;

import jakarta.mail.internet.InternetAddress;

import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

import lombok.extern.log4j.Log4j2;

@Service

@RequiredArgsConstructor

@Log4j2
public class EmailServiceImpl
                implements
                EmailService {

        @Value("${spring.mail.base-url}")
        private String baseUrl;

        @Value("${spring.mail.from}")
        private String from;

        private final JavaMailSender javaMailSender;

        private final SpringTemplateEngine templateEngine;

        private final DateTimeUtil dateTimeUtil;

        @Async("emailTaskExecutor")
        @Override

        public void sendEmail(String to,
                        String subject,
                        String content, boolean isMultipart, boolean isHtml) {
                this
                                .sendEmailSync(to,
                                                subject,
                                                content,
                                                isMultipart,
                                                isHtml);
        }

        private void sendEmailSync(String to,
                        String subject,
                        String content, boolean isMultipart, boolean isHtml) {
                MimeMessage mimeMessage = javaMailSender.createMimeMessage();

                try {
                        MimeMessageHelper message = new MimeMessageHelper(mimeMessage,
                                        isMultipart,
                                        StandardCharsets.UTF_8
                                                        .name());
                        message.setTo(to);
                        message.setFrom(from);
                        message.setSubject(subject);
                        message.setText(content,
                                        isHtml);
                        javaMailSender.send(mimeMessage);
                } catch (MailException | MessagingException e) {
                        log
                                        .error(
                                                        "Email could not be sent to user '{}': {}",
                                                        to,
                                                        e.getMessage());
                }
        }

        private void sendEmailFromTemplateSync(User user,
                        String templateName,
                        String subject,
                        Map<String, Object> variables) {
                if (user.getEmail() == null) {
                        return;
                }
                Context context = new Context();
                context.setVariable(
                                "user",
                                user);
                context.setVariable(
                                "baseUrl",
                                baseUrl);
                context.setVariables(variables);
                String content = templateEngine.process(templateName,
                                context);

                this
                                .sendEmailSync(user.getEmail(),
                                                subject,
                                                content, false, true);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendActivationEmail(User user) {
                String subject = "Activation Email for account: "
                                + user.getEmail();

                this
                                .sendEmailFromTemplateSync(user,
                                                "mail/activationEmail",
                                                subject, null);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendCreationEmail(User user) {
                String subject = "Creation Email for account: "
                                + user.getEmail();

                this
                                .sendEmailFromTemplateSync(user,
                                                "mail/creationEmail",
                                                subject, null);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendPasswordResetEmail(User user) {
                String subject = "Password Reset Email for "
                                + user.getEmail();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "user",
                                user);

                this
                                .sendEmailFromTemplateSync(user,
                                                "mail/passwordResetEmail",
                                                subject,
                                                variables);
        }

        private String convertDateTimeToString(LocalDateTime dateTime) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
                                "dd/MM/yyyy HH:mm");

                return dateTime.format(formatter);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendBookingConfirmationEmail(Booking booking,
                        User renter,
                        User carOwner) {
                this
                                .sendBookingConfirmationEmailToCarOwner(booking,
                                                carOwner);

                this
                                .sendBookingConfirmationEmailToRenter(booking,
                                                renter);
        }

        private void sendBookingConfirmationEmailToCarOwner(Booking booking,
                        User carOwner) {
                String subject = "Booking Confirmation Email for booking: Booking#"
                                + booking.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "booking",
                                booking);
                variables.put(
                                "pickUpDateTime",
                                convertDateTimeToString(booking.getPickUpAt()));
                variables.put(
                                "returnDateTime",
                                convertDateTimeToString(booking.getReturnAt()));
                variables.put(
                                "carName",
                                booking.getCar().getBrandModel().getName());
                variables.put(
                                "carId",
                                booking.getCar().getId());
                variables.put(
                                "createdAt",
                                dateTimeUtil.getFormatDate(booking.getCreatedAt()));
                variables.put(
                                "renter_name",
                                booking.getUser().getFirstName() +
                                                ' '
                                                + booking.getUser().getLastName());

                this
                                .sendEmailFromTemplateSync(carOwner,
                                                "mail/booking/carOwner/confirmationEmail",
                                                subject,
                                                variables);
        }

        private void sendBookingConfirmationEmailToRenter(Booking booking,
                        User renter) {
                String subject = "Booking Confirmation Email for booking: Booking#"
                                + booking.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "booking",
                                booking);
                variables.put(
                                "pickUpDateTime",
                                convertDateTimeToString(booking.getPickUpAt()));
                variables.put(
                                "returnDateTime",
                                convertDateTimeToString(booking.getReturnAt()));
                variables.put(
                                "carName",
                                booking.getCar().getBrandModel().getName());
                variables.put(
                                "bookingId",
                                booking.getId());
                variables.put(
                                "renter_name",
                                booking.getUser().getFirstName() +
                                                ' '
                                                + booking.getUser().getLastName());
                variables.put(
                                "createdAt",
                                dateTimeUtil.getFormatDate(booking.getCreatedAt()));

                this
                                .sendEmailFromTemplateSync(renter,
                                                "mail/booking/renter/confirmationEmail",
                                                subject,
                                                variables);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendBookingDepositConfirmationEmail(Booking booking,
                        User renter,
                        User carOwner) {
                this
                                .sendBookingDepositConfirmationEmailToCarOwner(booking,
                                                carOwner);

                this
                                .sendBookingDepositConfirmationEmailToRenter(booking,
                                                renter);
        }

        private void sendBookingDepositConfirmationEmailToCarOwner(Booking booking,
                        User carOwner) {
                String subject = "Booking Deposit Confirmation Email for booking: Booking#"
                                + booking.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "car",
                                booking.getCar());
                variables.put(
                                "booking",
                                booking);
                variables.put(
                                "pickUpDateTime",
                                convertDateTimeToString(booking.getPickUpAt()));
                variables.put(
                                "returnDateTime",
                                convertDateTimeToString(booking.getReturnAt()));

                this
                                .sendEmailFromTemplateSync(carOwner,
                                                "mail/booking/carOwner/depositConfirmationEmail",
                                                subject,
                                                variables);
        }

        private void sendBookingDepositConfirmationEmailToRenter(Booking booking,
                        User renter) {
                String subject = "Booking Deposit Confirmation Email for booking: Booking#"
                                + booking.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "car",
                                booking.getCar());
                variables.put(
                                "booking",
                                booking);
                variables.put(
                                "pickUpDateTime",
                                convertDateTimeToString(booking.getPickUpAt()));
                variables.put(
                                "returnDateTime",
                                convertDateTimeToString(booking.getReturnAt()));

                this
                                .sendEmailFromTemplateSync(booking.getUser(),
                                                "mail/booking/renter/depositConfirmationEmail",
                                                subject,
                                                variables);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendAcceptedBookingEmail(Booking booking,
                        User renter,
                        User carOwner) {
                log.info("ABCDEFG" + renter.getEmail());
                String subject = "Booking Accepted Email for booking: Booking#"
                                + booking.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "car",
                                booking.getCar());
                variables.put(
                                "booking",
                                booking);

                // variables.put(
                // "renter_name",
                // renter.getFirstName() +
                // ' '
                // + renter.getLastName());
                variables.put(
                                "pickUpDateTime",
                                convertDateTimeToString(booking.getPickUpAt()));
                variables.put(
                                "returnDateTime",
                                convertDateTimeToString(booking.getReturnAt()));

                this.sendEmailFromTemplateSync(carOwner,
                                "mail/booking/carOwner/bookingConfirmedEmail",
                                subject,
                                variables);

                this.sendEmailFromTemplateSync(renter,
                                "mail/booking/renter/bookingConfirmedEmail",
                                subject,
                                variables);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendDeclinedBookingEmail(Booking booking,
                        User renter,
                        User carOwner) {
                String subject = "Booking declined email for booking: Booking#"
                                + booking.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "booking",
                                booking);
                // variables.put(
                // "renter_name",
                // renter.getFirstName() +
                // ' '
                // + renter.getLastName());
                variables.put(
                                "pickUpDateTime",
                                convertDateTimeToString(booking.getPickUpAt()));
                variables.put(
                                "returnDateTime",
                                convertDateTimeToString(booking.getReturnAt()));
                // send email to owner
                this
                                .sendEmailFromTemplateSync(carOwner,
                                                "mail/booking/carOwner/bookingDeclinedEmail",
                                                subject,
                                                variables);
                // send email to renter
                this.sendEmailFromTemplateSync(renter,
                                "mail/booking/renter/bookingDeclinedEmail",
                                subject,
                                variables);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendBookingPickUpConfirmationEmail(Booking booking,
                        User renter,
                        User carOwner) {
                String subject = "Pick up Confirmation Email for booking: Booking#"
                                + booking.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "car",
                                booking.getCar());
                variables.put(
                                "booking",
                                booking);
                variables.put(
                                "renter_name",
                                renter.getFirstName() +
                                                ' '
                                                + renter.getLastName());
                variables.put(
                                "pickUpDateTime",
                                convertDateTimeToString(booking.getPickUpAt()));
                variables.put(
                                "returnDateTime",
                                convertDateTimeToString(booking.getReturnAt()));

                this
                                .sendEmailFromTemplateSync(carOwner,
                                                "mail/booking/carOwner/pickUpConfirmedEmail",
                                                subject,
                                                variables);

                this
                                .sendEmailFromTemplateSync(renter,
                                                "mail/booking/renter/pickUpConfirmedEmail",
                                                subject,
                                                variables);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendBookingReturnCarConfirmationEmail(Booking booking,
                        User renter,
                        User carOwner) {
                String subject = "Return car Confirmation Email for booking: Booking#"
                                + booking.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "booking",
                                booking);
                variables.put(
                                "renter_name",
                                renter.getFirstName() +
                                                ' '
                                                + renter.getLastName());
                variables.put(
                                "pickUpDateTime",
                                convertDateTimeToString(booking.getPickUpAt()));
                variables.put(
                                "returnDateTime",
                                convertDateTimeToString(booking.getReturnAt()));

                this
                                .sendEmailFromTemplateSync(renter,
                                                "mail/booking/renter/returnCarEmail",
                                                subject,
                                                variables);

                this
                                .sendEmailFromTemplateSync(carOwner,
                                                "mail/booking/carOwner/returnCarEmail",
                                                subject,
                                                variables);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendBookingCancelledEmail(Booking booking,
                        User renter,
                        User carOwner) {
                this
                                .sendBookingCancelledEmailToCarOwner(booking,
                                                carOwner);

                this
                                .sendBookingCancelledEmailToRenter(booking,
                                                renter);
        }

        @Override

        public void sendAutoBookingCancelledEmail(Booking booking,
                        User renter,
                        User carOwner) {
                this
                                .sendBookingCancelledEmailToCarOwner(booking,
                                                carOwner);

                this
                                .sendBookingCancelledEmailToRenter(booking,
                                                renter);

        }

        private void sendBookingCancelledEmailToRenter(Booking booking,
                        User renter) {
                String subject = "Booking Cancelled Email for booking: Booking#"
                                + booking.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "booking",
                                booking);
                User user = renter;
                variables.put(
                                "fullName",
                                user.getFirstName() +
                                                " "
                                                + user.getLastName());
                variables.put(
                                "pickUpDateTime",
                                convertDateTimeToString(booking.getPickUpAt()));
                variables.put(
                                "returnDateTime",
                                convertDateTimeToString(booking.getReturnAt()));

                this
                                .sendEmailFromTemplateSync(renter,
                                                "mail/booking/renter/cancelBookingEmail",
                                                subject,
                                                variables);
        }

        private void sendBookingCancelledEmailToCarOwner(Booking booking,
                        User carOwner) {
                String subject = "A booking with your car has been cancelled: Booking#"
                                + booking.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "booking",
                                booking);
                User user = booking.getUser();
                variables.put(
                                "fullName",
                                user.getFirstName() +
                                                " "
                                                + user.getLastName());
                variables.put(
                                "pickUpDateTime",
                                convertDateTimeToString(booking.getPickUpAt()));
                variables.put(
                                "returnDateTime",
                                convertDateTimeToString(booking.getReturnAt()));

                this
                                .sendEmailFromTemplateSync(carOwner,
                                                "mail/booking/carOwner/cancelBookingEmail",
                                                subject,
                                                variables);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendChangePasswordEmail(User user) {
                String subject = "Your password has been changed";
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "user",
                                user);

                this
                                .sendEmailFromTemplateSync(user,
                                                "mail/passwordChangeEmail",
                                                subject,
                                                variables);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendTransferEmail(User sender,
                        User receiver,
                        Transaction senderTransaction,
                        Transaction receiverTransaction) {
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "sender",
                                sender.getFirstName() +
                                                " "
                                                + sender.getLastName());
                variables.put(
                                "receiver",
                                receiver.getFirstName() +
                                                " "
                                                + receiver.getLastName());
                variables.put(
                                "senderTransactionStatus",
                                senderTransaction.getStatus());
                variables.put(
                                "receiverTransactionStatus",
                                receiverTransaction.getStatus());
                variables.put(
                                "amount",
                                senderTransaction.getAmount());
                variables.put(
                                "message",
                                senderTransaction.getMessage());
                // send email to sender
                this
                                .sendEmailFromTemplateSync(sender,
                                                "mail/transaction/sender/transferEmail",

                                                "Your transaction has been initiated",
                                                variables);
                // send email to receiver
                this
                                .sendEmailFromTemplateSync(receiver,
                                                "mail/transaction/receiver/transferEmail",

                                                "A transaction with you has been initiated",
                                                variables);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendTransferCompleteEmail(User user,
                        Transaction transaction) {
                String subject = "Successful Completion of Your Transaction";
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "user",
                                user);
                variables.put(
                                "receiver",
                                user.getFirstName() +
                                                " "
                                                + user.getLastName());
                variables.put(
                                "status",
                                transaction.getStatus());
                variables.put(
                                "amount",
                                transaction.getAmount());
                variables.put(
                                "message",
                                transaction.getMessage());

                this
                                .sendEmailFromTemplateSync(user,
                                                "mail/receiver/transferCompletedEmail",
                                                subject,
                                                variables);
        }

        @Async("emailTaskExecutor")
        @Override

        public void sendRefundEmail(User sender,
                        User receiver,
                        Transaction senderTransaction,
                        Transaction receiverTransaction) {
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "receiver",
                                receiver);
                variables.put(
                                "sender",
                                sender);
                variables.put(
                                "status",
                                receiverTransaction.getStatus());
                variables.put(
                                "amount",
                                receiverTransaction.getAmount());
                variables.put(
                                "message",
                                receiverTransaction.getMessage());
                variables.put(
                                "receiverFullName",
                                receiver.getFirstName() +
                                                " "
                                                + receiver.getLastName());

                // send email to sender
                this
                                .sendEmailFromTemplateSync(sender,
                                                "mail/transaction/sender/refundEmail",

                                                "Refund of funds transfer from "
                                                                + sender.getFirstName() +
                                                                " "
                                                                + sender.getLastName(),
                                                variables);
                // send email to receiver
                this
                                .sendEmailFromTemplateSync(sender,
                                                "mail/transaction/receiver/refundEmail",
                                                "Refund of funds transfer",
                                                variables);
        }

        @Override

        public void sendTopUpConfirmEmail(User user,
                        Transaction transaction) {
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "user",
                                user);
                variables.put(
                                "status",
                                transaction.getStatus());
                variables.put(
                                "amount",
                                transaction.getAmount());
                variables.put(
                                "message",
                                transaction.getMessage());

                this
                                .sendEmailFromTemplateSync(user,
                                                "mail/topupConfirmEmail",
                                                "Confirmation: Top-up request processed",
                                                variables);
        }

        @Override

        public void sendWithdrawalConfirmEmail(User user,
                        Transaction transaction) {
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "user",
                                user);
                variables.put(
                                "status",
                                transaction.getStatus());
                variables.put(
                                "amount",
                                transaction.getAmount());
                variables.put(
                                "message",
                                transaction.getMessage());

                this
                                .sendEmailFromTemplateSync(user,
                                                "mail/transaction/withdrawalConfirmEmail",

                                                "Confirmation: Withdrawal Request Processed",
                                                variables);
        }

        @Override

        public void sendWithdrawalEmail(User user,
                        Transaction transaction) {
                Map<String, Object> variables = new HashMap<>();
                variables.put(
                                "user",
                                user);
                variables.put(
                                "status",
                                transaction.getStatus());
                variables.put(
                                "amount",
                                transaction.getAmount());
                variables.put(
                                "message",
                                transaction.getMessage());

                this
                                .sendEmailFromTemplateSync(user,
                                                "mail/transaction/withdrawalEmail",

                                                "Your withdrawal request has been completed successfully",
                                                variables);
        }

        public InternetAddress getFrom()
                        throws AddressException {
                return new InternetAddress(from);
        }

        @Async("emailTaskExecutor")
        @Override
        public void sendApprovedCarEmail(CarBasic carBasic) {
                String subject = "Car approved: Car #" + carBasic.getId();
                ;

                this.sendEmailFromTemplateSync(carBasic.getOwner(), "mail/car/approveCarEmail", subject, null);
        }

        @Async("emailTaskExecutor")
        @Override
        public void sendDeclinedCarEmail(CarBasic carBasic, String declinedReason) {
                String subject = "Car declined: Car #" + carBasic.getId();
                Map<String, Object> variables = new HashMap<>();
                variables.put("declinedReason", declinedReason);
                this.sendEmailFromTemplateSync(carBasic.getOwner(), "mail/car/declineCarEmail", subject, variables);
        }
}