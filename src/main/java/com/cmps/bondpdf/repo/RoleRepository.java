package com.cmps.bondpdf.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cmps.bondpdf.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

}
