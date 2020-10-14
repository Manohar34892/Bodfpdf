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

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getEntityName() {
		return entityName;
	}

	public void setEntityName(String entityName) {
		this.entityName = entityName;
	}

	public String getIssueDate() {
		return issueDate;
	}

	public void setIssueDate(String issueDate) {
		this.issueDate = issueDate;
	}

	public String getMaturityDate() {
		return maturityDate;
	}

	public void setMaturityDate(String maturityDate) {
		this.maturityDate = maturityDate;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public String getAmountIssued() {
		return amountIssued;
	}

	public void setAmountIssued(String amountIssued) {
		this.amountIssued = amountIssued;
	}

	public String getCouponType() {
		return couponType;
	}

	public void setCouponType(String couponType) {
		this.couponType = couponType;
	}

	public String getCoupon() {
		return coupon;
	}

	public void setCoupon(String coupon) {
		this.coupon = coupon;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPages() {
		return pages;
	}

	public void setPages(String pages) {
		this.pages = pages;
	}

	public String getDocument() {
		return document;
	}

	public void setDocument(String document) {
		this.document = document;
	}
	


}
