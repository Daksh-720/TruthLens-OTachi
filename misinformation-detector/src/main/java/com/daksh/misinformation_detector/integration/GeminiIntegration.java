package com.daksh.misinformation_detector.integration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


import java.util.List;
import java.util.Map;

@Service
public class GeminiIntegration {

    private final RestClient restClient;
    private final String apiKey;

    public GeminiIntegration(
            @Value("${gemini.api.key}") String apiKey
    ) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException(
                    "Gemini API key is missing"
            );
        }

        this.apiKey = apiKey;

        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();
    }

    public String chat(String prompt) {
        return chat(prompt, false);
    }

    public String chat(String prompt, boolean jsonMode) {
        Map<String, Object> body;
        if (jsonMode) {
            body = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", prompt)
                                    )
                            )
                    ),
                    "generationConfig", Map.of(
                            "responseMimeType", "application/json"
                    )
            );
        } else {
            body = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", prompt)
                                    )
                            )
                    )
            );
        }

        Map<?, ?> response = null;
        String[] candidateModels = {"gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.5-flash", "gemini-3.7-flash"};
        Exception lastException = null;

        for (String model : candidateModels) {
            try {
                response = restClient.post()
                        .uri("/models/" + model + ":generateContent?key=" + apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(body)
                        .retrieve()
                        .body(Map.class);
                if (response != null && response.containsKey("candidates")) {
                    break;
                }
            } catch (Exception e) {
                lastException = e;
            }
        }

        if (response == null && lastException != null) {
            throw new RuntimeException("Gemini API call failed across models: " + lastException.getMessage(), lastException);
        }

        if (response == null) {
            throw new RuntimeException(
                    "Gemini returned an empty response"
            );
        }

        Object candidatesObject = response.get("candidates");

        if (!(candidatesObject instanceof List<?> candidates)
                || candidates.isEmpty()) {
            throw new RuntimeException(
                    "Gemini returned no candidates"
            );
        }

        Object firstCandidate = candidates.get(0);

        if (!(firstCandidate instanceof Map<?, ?> candidate)) {
            throw new RuntimeException(
                    "Invalid candidate returned by Gemini"
            );
        }

        Object contentObject = candidate.get("content");

        if (!(contentObject instanceof Map<?, ?> content)) {
            throw new RuntimeException(
                    "Gemini response contains no content"
            );
        }

        Object partsObject = content.get("parts");

        if (!(partsObject instanceof List<?> parts) || parts.isEmpty()) {
            throw new RuntimeException(
                    "Gemini response contains no parts"
            );
        }

        StringBuilder textBuilder = new StringBuilder();
        for (Object partObj : parts) {
            if (partObj instanceof Map<?, ?> part) {
                Object textObj = part.get("text");
                if (textObj != null) {
                    textBuilder.append(textObj.toString());
                }
            }
        }

        if (textBuilder.isEmpty()) {
            throw new RuntimeException(
                    "Gemini response contains no text"
            );
        }

        return textBuilder.toString();
    }

    public boolean checkHealth() {
        try {
            String response = chat("Reply with PONG");
            return response != null && !response.isBlank();
        } catch (Exception e) {
            return false;
        }
    }
}