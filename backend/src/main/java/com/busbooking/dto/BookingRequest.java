package com.busbooking.dto;

import java.util.List;

public class BookingRequest {
    private Long userId;
    private Long busRouteId;
    private List<String> seatNumbers;

    public BookingRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getBusRouteId() { return busRouteId; }
    public void setBusRouteId(Long busRouteId) { this.busRouteId = busRouteId; }

    public List<String> getSeatNumbers() { return seatNumbers; }
    public void setSeatNumbers(List<String> seatNumbers) { this.seatNumbers = seatNumbers; }
}
