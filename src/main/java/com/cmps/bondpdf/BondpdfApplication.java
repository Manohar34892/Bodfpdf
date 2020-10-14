package com.cmps.bondpdf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.cmps.bondpdf.config.FileStorageProperties;

@SpringBootApplication
@EnableConfigurationProperties({
	FileStorageProperties.class
})
public class BondpdfApplication {

	public static void main(String[] args) {
		SpringApplication.run(BondpdfApplication.class, args);
	}
}
