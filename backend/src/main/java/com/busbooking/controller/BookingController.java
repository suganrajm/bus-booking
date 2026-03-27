package com.busbooking.controller;

import com.busbooking.dto.BookingRequest;
import com.busbooking.model.Booking;
import com.busbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = ((UserDetails) auth.getPrincipal()).getUsername();

        return ResponseEntity.ok(bookingService.createBooking(request, userEmail));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Booking>> getUserBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = ((UserDetails) auth.getPrincipal()).getUsername();

        return ResponseEntity.ok(bookingService.getUserBookings(userEmail));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = ((UserDetails) auth.getPrincipal()).getUsername();

        try {
            bookingService.cancelBooking(id, userEmail);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = ((UserDetails) auth.getPrincipal()).getUsername();

        try {
            bookingService.deleteBooking(id, userEmail);
            return ResponseEntity.ok("Booking deleted.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
