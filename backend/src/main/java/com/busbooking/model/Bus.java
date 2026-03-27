package com.busbooking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String busNumber;

    @Column(nullable = false)
    private String operatorName;

    @Column(nullable = false)
    private Integer totalSeats;

    @Column(nullable = false)
    private String type; // AC, NON_AC, SLEEPER, SEATER

    public Bus() {}

    public Bus(Long id, String busNumber, String operatorName, Integer totalSeats, String type) {
        this.id = id;
        this.busNumber = busNumber;
        this.operatorName = operatorName;
        this.totalSeats = totalSeats;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public String getOperatorName() { return operatorName; }
    public void setOperatorName(String operatorName) { this.operatorName = operatorName; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
