package com.busbooking.dto;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

public class SearchRequest {
    private String source;
    private String destination;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate travelDate;

    public SearchRequest() {}

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }
}
