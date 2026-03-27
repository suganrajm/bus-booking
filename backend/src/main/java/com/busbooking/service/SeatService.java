package com.busbooking.service;

import com.busbooking.model.Booking;
import com.busbooking.model.Seat;
import com.busbooking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<String> getBookedSeats(Long busRouteId) {
        List<Booking> bookings = bookingRepository.findByBusRouteId(busRouteId);
        
        return bookings.stream()
                .filter(b -> b.getStatus().equals("CONFIRMED"))
                .flatMap(b -> b.getSeats().stream())
                .map(Seat::getSeatNumber)
                .collect(Collectors.toList());
    }
}
