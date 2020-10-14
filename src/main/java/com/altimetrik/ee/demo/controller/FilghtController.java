package com.altimetrik.ee.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altimetrik.ee.demo.bean.Search;
import com.altimetrik.ee.demo.entity.Flight;
import com.altimetrik.ee.demo.service.FlightServices;

@RestController
@RequestMapping(value = "/flight")
public class FilghtController {

	
	@Autowired
	private FlightServices flightServices;
	
	@GetMapping(value="/search")
	public List<Flight>  sarchFilght(@RequestBody Search search) {
				
		return flightServices.findAll(search);
	}
	
	
}
