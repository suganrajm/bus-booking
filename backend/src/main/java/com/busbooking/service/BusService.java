package com.busbooking.service;

import com.busbooking.model.Bus;
import com.busbooking.model.BusRoute;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.BusRouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private BusRouteRepository busRouteRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Bus addBus(Bus bus) {
        if (busRepository.existsByBusNumber(bus.getBusNumber())) {
            throw new RuntimeException("Bus with this number already exists");
        }
        return busRepository.save(bus);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Optional<Bus> getBusById(Long id) {
        return busRepository.findById(id);
    }

    @Transactional
    public void deleteBus(Long id) {
        List<BusRoute> schedules = busRouteRepository.findByBusId(id);
        for (BusRoute br : schedules) {
            bookingRepository.findByBusRouteId(br.getId())
                    .forEach(b -> bookingRepository.deleteById(b.getId()));
            busRouteRepository.deleteById(br.getId());
        }
        busRepository.deleteById(id);
    }
}
