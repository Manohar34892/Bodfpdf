package com.altimetrik.ee.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.altimetrik.ee.demo.entity.Flight;

@Repository
public interface FlightRepo extends JpaRepository<Flight, Long> {

	@Query("SELECT f.flightNumber,f.flightNumber,f.depaturetime,f.airvelTime,f.duration,f.price,f.numberSeat FROM Flight f WHERE f.sourceCity= :sourceCity AND f.desCity=:desCity AND f.depatureDate=:travelDate"   )
	List<Flight> findAll(@Param("sourceCity") String sourceCity, 
			@Param("desCity") String desCity,
			@Param("travelDate") LocalDate travelDate);	
	
}
