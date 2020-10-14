package com.cmps.bondpdf.service;

import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.InvalidPasswordException;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.PDFTextStripperByArea;
import org.springframework.web.multipart.MultipartFile;

public class PdfRead {

	
	public static void saveData(MultipartFile file) throws InvalidPasswordException, IOException {

		try (PDDocument document = PDDocument.load(file.getInputStream())) {

			document.getClass();

			if (!document.isEncrypted()) {

				PDFTextStripperByArea stripper = new PDFTextStripperByArea();
				stripper.setSortByPosition(true);

				PDFTextStripper tStripper = new PDFTextStripper();

				String pdfFileInText = tStripper.getText(document);
				System.out.println(pdfFileInText);
	            		
			}

		}
	}
}
