package com.cmps.bondpdf.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cmps.bondpdf.model.Data;

@Repository("repo")
public interface DataSolrRepo extends JpaRepository<Data, Integer>{

	Iterable<Data> findByEntityName(String entityName);


}
