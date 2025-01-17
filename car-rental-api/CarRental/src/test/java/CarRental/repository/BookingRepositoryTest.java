package CarRental.repository;

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase()
class BookingRepositoryTest {


    /* @Test
    void findBookingByStatusAndCreatedAtBefore_shouldReturnListOfBookings() {
        // Arrange
        BookingStatus status = BookingStatus.COMPLETED;
        LocalDateTime createdAt = LocalDateTime.now();

        // Act
        List<Booking> bookings = bookingRepository.findBookingByStatusAndCreatedAtBefore(status, createdAt);

        // Assert
        assertNotNull(bookings);
        // Add additional assertions as needed
    }

    @Test
    void findBookingByStatusAndUser_shouldReturnPageOfBookings() {
        // Arrange
        BookingStatus status = BookingStatus.COMPLETED;
        User user = new User();
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<Booking> bookingPage = bookingRepository.findBookingByStatusAndUser(status, user, pageable);

        // Assert
        assertNotNull(bookingPage);
        // Add additional assertions as needed
    } */
}