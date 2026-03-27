package com.busbooking.service;

import com.busbooking.model.BusRoute;
import com.busbooking.model.Route;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRouteRepository;
import com.busbooking.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BusRouteRepository busRouteRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Route addRoute(Route route) {
        return routeRepository.save(route);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Transactional
    public void deleteRoute(Long id) {
        List<BusRoute> schedules = busRouteRepository.findByRouteId(id);
        for (BusRoute br : schedules) {
            bookingRepository.findByBusRouteId(br.getId())
                    .forEach(b -> bookingRepository.deleteById(b.getId()));
            busRouteRepository.deleteById(br.getId());
        }
        routeRepository.deleteById(id);
    }
}
