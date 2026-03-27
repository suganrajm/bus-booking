package com.busbooking.service;

import com.busbooking.dto.BusRouteRequest;
import com.busbooking.model.Bus;
import com.busbooking.model.BusRoute;
import com.busbooking.model.Route;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.BusRouteRepository;
import com.busbooking.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class BusRouteService {

    @Autowired
    private BusRouteRepository busRouteRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public BusRoute scheduleBus(BusRouteRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        BusRoute busRoute = new BusRoute();
        busRoute.setBus(bus);
        busRoute.setRoute(route);
        busRoute.setDepartureTime(request.getDepartureTime());
        busRoute.setArrivalTime(request.getArrivalTime());
        busRoute.setFare(request.getFare());

        return busRouteRepository.save(busRoute);
    }

    public List<BusRoute> searchBuses(String source, String destination, LocalDate travelDate) {
        LocalDateTime startOfDay = travelDate.atStartOfDay();
        LocalDateTime endOfDay = travelDate.atTime(LocalTime.MAX);

        return busRouteRepository.searchByRouteAndDate(
                source, destination, startOfDay, endOfDay);
    }

    public List<BusRoute> getAllSchedules() {
        return busRouteRepository.findAll();
    }

    @Transactional
    public void deleteSchedule(Long id) {
        bookingRepository.findByBusRouteId(id)
                .forEach(b -> bookingRepository.deleteById(b.getId()));
        busRouteRepository.deleteById(id);
    }
}
