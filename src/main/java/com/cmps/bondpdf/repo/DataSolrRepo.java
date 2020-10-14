package com.cmps.bondpdf.repo;

import java.util.Optional;

import org.springframework.data.solr.repository.SolrRepository;
import org.springframework.stereotype.Repository;

import com.cmps.bondpdf.model.Data;

@Repository("dataSolrRepo")
public interface DataSolrRepo extends SolrRepository<Data, Integer>{

	Iterable<Data> findByEntityName(String entityName);

	Iterable<Data> findAll();

	Optional<Data> findById(int id);


}
