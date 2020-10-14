package com.cmps.bondpdf.ctrl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
public class PageController {

	@RequestMapping(value = { "/", "/sessions" })
	public String getpage() {

		return "welcome";
	}

	@RequestMapping("/getalldata")
	public String getlist() {

		return "listdata";
	}
	
	@GetMapping("/bondpdf")
	public String homepage() {
		return "bondpdf";
	}

	@GetMapping("/glossary")
	public String grt() {
		return "glossary";
	}
	
	@GetMapping("/uploadfile")
	public String getfile() {
		return "uploadfile";
	}

	@GetMapping("/uploadpdf")
	public String getpdffile() {
		return "uploadpdf";
	}
	
	@GetMapping("/uploadcsv")
	public String getcsvfile() {
		return "uploadcsv";
	}

}
