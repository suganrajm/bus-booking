package com.busbooking.controller;

import com.busbooking.dto.BusRouteRequest;
import com.busbooking.dto.SearchRequest;
import com.busbooking.model.BusRoute;
import com.busbooking.service.BusRouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/schedules")
public class BusRouteController {

    @Autowired
    private BusRouteService busRouteService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BusRoute> scheduleBus(@RequestBody BusRouteRequest request) {
        return ResponseEntity.ok(busRouteService.scheduleBus(request));
    }

    @PostMapping("/search")
    public ResponseEntity<List<BusRoute>> searchBuses(@RequestBody SearchRequest searchRequest) {
        List<BusRoute> buses = busRouteService.searchBuses(
                searchRequest.getSource(),
                searchRequest.getDestination(),
                searchRequest.getTravelDate()
        );
        return ResponseEntity.ok(buses);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BusRoute>> getAllSchedules() {
        return ResponseEntity.ok(busRouteService.getAllSchedules());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        try {
            busRouteService.deleteSchedule(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete schedule: " + e.getMessage());
        }
    }
}
