package com.cmps.bondpdf.ctrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cmps.bondpdf.model.User;
import com.cmps.bondpdf.repo.UserRepository;

@RestController
@RequestMapping("/admin")
public class AdminController {


	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Autowired
	private UserRepository repo;
	
	@PostMapping("/save")
	public String saveUser(@RequestBody User user) {
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		repo.save(user);
		return "save Successfully";
		
	}
	
	@PostMapping("/save1")
	public String saveUserl(@RequestBody User user) {
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		repo.save(user);
		return "save Successfully";
		
	}
}
