package com.busbooking.repository;

import com.busbooking.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    Boolean existsByBusNumber(String busNumber);
}
