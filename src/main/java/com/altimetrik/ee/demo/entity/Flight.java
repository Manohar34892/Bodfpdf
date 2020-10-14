package com.altimetrik.ee.demo.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * @author basir
 *
 */

@Entity
public class Flight 
{
	@Id
	private long id;
	private String sourceCity;
	private String desCity;
	private String flightNumber;
	private String airlinName;
	private LocalDate depatureDate;
	private LocalDate airvelDate;
	private LocalTime depaturetime;
	private LocalTime airvelTime;
	private String duration;
	private String price;
	private String numberSeat;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getSourceCity() {
		return sourceCity;
	}
	public void setSourceCity(String sourceCity) {
		this.sourceCity = sourceCity;
	}
	public String getDesCity() {
		return desCity;
	}
	public void setDesCity(String desCity) {
		this.desCity = desCity;
	}
	public String getFlightNumber() {
		return flightNumber;
	}
	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}
	public String getAirlinName() {
		return airlinName;
	}
	public void setAirlinName(String airlinName) {
		this.airlinName = airlinName;
	}
	public LocalDate getDepatureDate() {
		return depatureDate;
	}
	public void setDepatureDate(LocalDate depatureDate) {
		this.depatureDate = depatureDate;
	}
	public LocalDate getAirvelDate() {
		return airvelDate;
	}
	public void setAirvelDate(LocalDate airvelDate) {
		this.airvelDate = airvelDate;
	}
	public LocalTime getDepaturetime() {
		return depaturetime;
	}
	public void setDepaturetime(LocalTime depaturetime) {
		this.depaturetime = depaturetime;
	}
	public LocalTime getAirvelTime() {
		return airvelTime;
	}
	public void setAirvelTime(LocalTime airvelTime) {
		this.airvelTime = airvelTime;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getNumberSeat() {
		return numberSeat;
	}
	public void setNumberSeat(String numberSeat) {
		this.numberSeat = numberSeat;
	}
	
	
	
	
}
