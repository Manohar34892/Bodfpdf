package com.altimetrik.ee.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.altimetrik.ee.demo.bean.Search;
import com.altimetrik.ee.demo.entity.Flight;

@Service
public interface FlightServices  {

	List<Flight> findAll(Search search);
}
