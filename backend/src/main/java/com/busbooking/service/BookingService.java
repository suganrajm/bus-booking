package com.busbooking.service;

import com.busbooking.dto.BookingRequest;
import com.busbooking.model.Booking;
import com.busbooking.model.BusRoute;
import com.busbooking.model.Seat;
import com.busbooking.model.User;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRouteRepository;
import com.busbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BusRouteRepository busRouteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Booking createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BusRoute busRoute = busRouteRepository.findById(request.getBusRouteId())
                .orElseThrow(() -> new RuntimeException("Bus schedule not found"));

        Double totalAmount = busRoute.getFare() * request.getSeatNumbers().size();

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setBusRoute(busRoute);
        booking.setTravelDate(busRoute.getDepartureTime().toLocalDate());
        booking.setBookingDate(LocalDateTime.now());
        booking.setTotalAmount(totalAmount);
        booking.setStatus("CONFIRMED");

        List<Seat> seats = request.getSeatNumbers().stream()
                .map(seatNumber -> {
                    Seat seat = new Seat();
                    seat.setBooking(booking);
                    seat.setSeatNumber(seatNumber);
                    return seat;
                })
                .collect(Collectors.toList());

        booking.setSeats(seats);

        Booking savedBooking = bookingRepository.save(booking);
        
        emailService.sendBookingConfirmation(
                user.getEmail(), 
                savedBooking.getId(), 
                busRoute.getDepartureTime().toString(), 
                busRoute.getRoute().getSource(), 
                busRoute.getRoute().getDestination()
        );

        return savedBooking;
    }

    public List<Booking> getUserBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserId(user.getId());
    }

    @Transactional
    public void cancelBooking(Long bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }
        
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        emailService.sendCancellationNotification(email, bookingId);
    }

    @Transactional
    public void deleteBooking(Long bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        if (!"CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Only cancelled bookings can be deleted");
        }
        bookingRepository.deleteById(bookingId);
    }
}
