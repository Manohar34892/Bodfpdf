package com.cmps.bondpdf.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cmps.bondpdf.model.User;


@Repository("userRepository")
public interface UserRepository extends JpaRepository<User, Integer>{

	User findByName(String username);

}
