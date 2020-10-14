package com.altimetrik.ee.demo.service.impl;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.altimetrik.ee.demo.bean.Search;
import com.altimetrik.ee.demo.entity.Flight;
import com.altimetrik.ee.demo.repository.FlightRepo;
import com.altimetrik.ee.demo.service.FlightServices;

@Service
public class FilghtServiceImpl implements FlightServices {
	
	@Autowired
	private FlightRepo flightRepo;

	@Override
	public List<Flight> findAll(Search search) {
		
		
			if(search.getReturnDate()!=null) {
				return flightRepo.findAll(search.getSourceCity(),search.getDesCity(), search.getTravelDate() );
			}
			else {
				
				List<Flight> list= new ArrayList<>();
				list.addAll(flightRepo.findAll(search.getSourceCity(),search.getDesCity(), search.getTravelDate() ));
				list.addAll(flightRepo.findAll(search.getDesCity(),search.getSourceCity(), search.getReturnDate() ));
				return list;
			}
			
	
	}

	
	
}
