package com.cmps.bondpdf.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
public class Role {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	private String role;
}
