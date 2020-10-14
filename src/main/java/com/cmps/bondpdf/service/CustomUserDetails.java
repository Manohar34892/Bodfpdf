package com.cmps.bondpdf.service;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.cmps.bondpdf.model.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomUserDetails implements UserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Autowired
	private User user;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		
		System.out.println(user.getRoles().stream().map(role->new SimpleGrantedAuthority("ROLE_"+role))
				.collect(Collectors.toList())	);
		return user.getRoles().stream().map(role->new SimpleGrantedAuthority("ROLE_"+role.getRole()))
				.collect(Collectors.toList());
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return user.getName();
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}

}
