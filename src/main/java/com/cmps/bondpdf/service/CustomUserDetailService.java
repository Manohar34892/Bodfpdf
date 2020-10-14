package com.cmps.bondpdf.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.cmps.bondpdf.model.User;
import com.cmps.bondpdf.repo.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService{

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		User user=userRepository.findByName(username);
		CustomUserDetails customUserDetails=null;
		if(user!=null) {
			customUserDetails= new CustomUserDetails();
			customUserDetails.setUser(user);
		}else {
			throw new UsernameNotFoundException("user not exit with name"+username);
		}
		return customUserDetails;
	}

}
