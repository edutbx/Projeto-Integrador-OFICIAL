package com.br.iasaude.saudemais.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

@RestController
@RequestMapping("/api")
public class PdfController {
    @PostMapping(value = "/interpretar-pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> interpretarPdf(@RequestParam("file") MultipartFile file) throws IOException {
        Map<String, Object> result = new HashMap<>();
        if (file.isEmpty() || !StringUtils.getFilenameExtension(file.getOriginalFilename()).equalsIgnoreCase("pdf")) {
            result.put("error", "Arquivo inválido");
            return ResponseEntity.badRequest().body(result);
        }
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            result.put("conteudoExtraido", text);
        }
        return ResponseEntity.ok(result);
    }
}
