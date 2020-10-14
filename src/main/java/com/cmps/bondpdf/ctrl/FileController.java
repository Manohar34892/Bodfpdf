package com.cmps.bondpdf.ctrl;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.cmps.bondpdf.service.FileStorageService;

@Controller
@RequestMapping("/admin")
public class FileController {

	@Autowired
	private FileStorageService service;


	@PostMapping("/uploadFile")
	public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
	service.storeFile(file);
	/*
		String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/downloadFile/")
				.path(fileName).toUriString();*/
		
		return "uploadpdf";

	}
}
