package com.daksh.misinformation_detector.controller;

import com.daksh.misinformation_detector.integration.GeminiMediaIntegration;
import com.daksh.misinformation_detector.integration.GeminiResponse;
import com.daksh.misinformation_detector.integration.GeminiTextIntegration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/verify")
public class VerificationController {

    private final GeminiTextIntegration geminiTextIntegration;
    private final GeminiMediaIntegration geminiMediaIntegration;

    public VerificationController(
            GeminiTextIntegration geminiTextIntegration,
            GeminiMediaIntegration geminiMediaIntegration
    ) {
        this.geminiTextIntegration = geminiTextIntegration;
        this.geminiMediaIntegration = geminiMediaIntegration;
    }

    @PostMapping(
            value = "/text",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public GeminiResponse verifyText(@RequestBody TextRequest request) {

        return geminiTextIntegration.analyzeTextStructured(
                request.content()
        );
    }

    @PostMapping(
            value = "/social",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public GeminiResponse verifySocialPost(@RequestBody TextRequest request) {

        return geminiTextIntegration.analyzeTextStructured(
                request.content()
        );
    }

    @PostMapping(
            value = "/media",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public GeminiResponse verifyMedia(
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        return parseResponse(
                geminiMediaIntegration.analyzeImage(
                        file.getBytes(),
                        file.getContentType()
                )
        );
    }

    @PostMapping(
            value = "/url",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public GeminiResponse verifyUrl(@RequestBody UrlRequest request) {

        return parseResponse(
                geminiMediaIntegration.analyzeUrl(
                        request.url()
                )
        );
    }

    private GeminiResponse parseResponse(String json) {

        try {
            return new com.fasterxml.jackson.databind.ObjectMapper()
                    .readValue(json, GeminiResponse.class);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse Gemini response",
                    e
            );
        }
    }

    public record TextRequest(String content) {
    }

    public record UrlRequest(String url) {
    }
}