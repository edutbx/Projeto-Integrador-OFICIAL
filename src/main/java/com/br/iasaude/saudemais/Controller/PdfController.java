package com.br.iasaude.saudemais.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

@RestController
@RequestMapping("/api")
public class PdfController {
    private static final Logger logger = LoggerFactory.getLogger(PdfController.class);
    @PostMapping(value = "/interpretar-pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> interpretarPdf(@RequestParam("file") MultipartFile file) throws IOException {
        Map<String, Object> result = new HashMap<>();
        if (file.isEmpty() || !StringUtils.getFilenameExtension(file.getOriginalFilename()).equalsIgnoreCase("pdf")) {
            result.put("error", "Arquivo inválido");
            return ResponseEntity.badRequest().body(result);
        }
        String text = null;
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            text = stripper.getText(document);
            logger.info("Texto extraído do PDF: {}", text);
            result.put("conteudoExtraido", text);
        }
        if (text == null || text.trim().isEmpty()) {
            logger.warn("Texto extraído do PDF está vazio ou nulo. Não será enviada requisição para IA.");
            result.put("erroIA", "Texto extraído do PDF está vazio ou nulo.");
            return ResponseEntity.ok(result);
        }
        // Chamada para a API da IA (FastAPI) usando RestTemplate
        String iaResponse = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> iaPayload = new HashMap<>();
            iaPayload.put("user_prompt", text);
            String requestBody = mapper.writeValueAsString(iaPayload);
            logger.info("Enviando para IA: {}", requestBody);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            RestTemplate restTemplate = new RestTemplate();
            iaResponse = restTemplate.exchange(
                    "http://localhost:8000/chat",
                    HttpMethod.POST,
                    entity,
                    String.class
            ).getBody();
            logger.info("Resposta da IA: {}", iaResponse);
            result.put("respostaIA", iaResponse);
        } catch (Exception e) {
            logger.error("Erro ao consultar IA: ", e);
            result.put("erroIA", "Erro ao consultar IA: " + e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}
