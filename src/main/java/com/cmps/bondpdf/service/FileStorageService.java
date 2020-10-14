package com.cmps.bondpdf.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.cmps.bondpdf.config.FileStorageProperties;

@Service
public class FileStorageService {

	private final Path fileStorageLocation;
	
	@Autowired
	public FileStorageService(FileStorageProperties fileStorageProperties) {
		fileStorageProperties.setUploadDir("Example");
		
		this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir() + "/file").toAbsolutePath()
				.normalize();

		try {
			Files.createDirectories(this.fileStorageLocation);
		} catch (Exception ex) {
			// throw new FileStorageException("Could not create the directory where the
			// uploaded files will be stored.",);
		}
	}

	public String storeFile(MultipartFile file) throws IOException {
		
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
		Path targetLocation = this.fileStorageLocation.resolve(fileName);

		try {
			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
			PdfRead.saveData(file);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return fileName;
	}
}
