package com.cmps.bondpdf.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserDetailsService userDetailsSerives;

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsSerives).passwordEncoder(encoded());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable();
		http.authorizeRequests().antMatchers("/vendor/**", "/img/**", "/css/**", "/js/**", "/mazira-timeline/**",
				"/angular_paginations/**" ,"/user/**","/rest/**").permitAll();

		/*
		 * http.authorizeRequests().antMatchers("/user/**",
		 * "/rest/**").authenticated().anyRequest().permitAll();
		 * 
		 * http.authorizeRequests().antMatchers("/admin/**").authenticated().anyRequest(
		 * ).permitAll().and()
		 * .formLogin().loginPage("/user/").loginProcessingUrl("/sessions").
		 * defaultSuccessUrl("/user/bondpdf") .permitAll();
		 */

	}

	@Bean
	public BCryptPasswordEncoder encoded() {
		return new BCryptPasswordEncoder();
	}
}
