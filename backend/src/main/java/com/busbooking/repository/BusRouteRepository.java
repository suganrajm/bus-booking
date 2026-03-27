package com.busbooking.repository;

import com.busbooking.model.BusRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BusRouteRepository extends JpaRepository<BusRoute, Long> {

    @Query("SELECT br FROM BusRoute br JOIN br.route r WHERE LOWER(r.source) = LOWER(:source) AND LOWER(r.destination) = LOWER(:destination) AND br.departureTime BETWEEN :start AND :end")
    List<BusRoute> searchByRouteAndDate(
            @Param("source") String source,
            @Param("destination") String destination,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    List<BusRoute> findByBusId(Long busId);
    List<BusRoute> findByRouteId(Long routeId);
}
