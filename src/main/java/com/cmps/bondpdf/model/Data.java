package com.cmps.bondpdf.model;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.apache.solr.client.solrj.beans.Field;
import org.springframework.data.solr.core.mapping.SolrDocument;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@SolrDocument(collection = "collection")
@Setter
@Getter
@ToString
public class Data {

	@Id
	@Field
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;

	@Field
	private String entityName;

	@Field
	private String issueDate;

	@Field
	private String maturityDate;

	@Field
	private String currency;
	
	@Field
	private String amountIssued;
	
	@Field
	private String couponType;
	
	@Field
	private String coupon;
	
	@Field
	private String type;
	
	@Field
	private String pages;
	
	@Field
	private String document;
	


}
