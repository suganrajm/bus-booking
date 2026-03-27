package com.busbooking.controller;

import com.busbooking.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/booked/{busRouteId}")
    public ResponseEntity<List<String>> getBookedSeats(@PathVariable Long busRouteId) {
        return ResponseEntity.ok(seatService.getBookedSeats(busRouteId));
    }
}
