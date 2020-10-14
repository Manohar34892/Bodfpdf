package com.altimetrik.ee.demo.bean;

import java.time.LocalDate;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Search {

	@NotNull
	private String sourceCity;
	
	@NotNull
	private String desCity;
	
	@NotNull
	@JsonFormat(shape=JsonFormat.Shape.STRING , pattern="yyyy-MM-dd" )
	private LocalDate travelDate;
	
	@JsonFormat(shape=JsonFormat.Shape.STRING , pattern="yyyy-MM-dd" )
	private LocalDate returnDate;
	
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
	public LocalDate getTravelDate() {
		return travelDate;
	}
	public void setTravelDate(LocalDate travelDate) {
		this.travelDate = travelDate;
	}
	public LocalDate getReturnDate() {
		return returnDate;
	}
	public void setReturnDate(LocalDate returnDate) {
		this.returnDate = returnDate;
	}
	
	
	
}
