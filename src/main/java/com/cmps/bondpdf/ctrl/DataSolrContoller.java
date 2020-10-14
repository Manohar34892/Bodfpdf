package com.cmps.bondpdf.ctrl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cmps.bondpdf.model.Data;
import com.cmps.bondpdf.repo.DataSolrRepo;

@RestController
@RequestMapping("/rest")
public class DataSolrContoller {

	@Autowired
	private DataSolrRepo repo;
	
	@GetMapping("/getall")
	public Iterable<Data> getAllData() {
		System.out.println(repo.findAll());
		return repo.findAll();
	}
	
	@GetMapping("/getbyname")
	public Iterable<Data> getByentityname(@RequestParam("entityname") String entityname) {
		System.out.println(repo.findByEntityName(entityname));
		return repo.findByEntityName(entityname);
	}
	
	@GetMapping("/getbyname/{id}")
	public Optional<Data> getByempid(@PathVariable int id) {
		return repo.findById(id);
	}
	
	/*@PostMapping("/save/data")
	public String saveData(@RequestBody Data data) {
		repo.save(data);
		return "saved successfully";
	}*/
	
}
