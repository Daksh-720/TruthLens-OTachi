package com.daksh.misinformation_detector.integration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GeminiMediaIntegration {

    private final RestClient restClient;
    private final String apiKey;

    public GeminiMediaIntegration(
            @Value("${gemini.api.key}") String apiKey
    ) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("Gemini API key is missing");
        }

        this.apiKey = apiKey;

        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();
    }

    /*
     * URL ANALYSIS
     *
     * Fetches the webpage content and asks Gemini to
     * fact-check the extracted article text.
     */
    public String analyzeUrl(String url) {

        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }

        String pageContent = fetchWebPage(url);

        if (pageContent.isBlank()) {
            throw new RuntimeException(
                    "Could not extract readable content from the URL"
            );
        }

        String prompt = FactCheckingPrompt.build(
                """
                The following content was extracted from a webpage.

                Analyze the factual claims contained in this webpage.

                IMPORTANT:
                - Evaluate the claims in the webpage content.
                - Do not assume that the webpage itself is a reliable source.
                - Separate claims made by the webpage from facts supported by evidence.
                - Do not treat the webpage's own statements as proof.
                - Consider the source URL as context only.

                Source URL:
                %s

                Webpage content:
                %s
                """.formatted(url, pageContent)
        );

        return callGeminiWithText(prompt);
    }


    /*
     * IMAGE ANALYSIS
     *
     * Sends the actual image bytes to Gemini together with
     * our fact-checking instructions.
     */
    public String analyzeImage(
            byte[] imageBytes,
            String mimeType
    ) {

        if (imageBytes == null || imageBytes.length == 0) {
            throw new IllegalArgumentException("Image cannot be empty");
        }

        if (mimeType == null || !mimeType.startsWith("image/")) {
            throw new IllegalArgumentException(
                    "Invalid image MIME type: " + mimeType
            );
        }

        String prompt = FactCheckingPrompt.build(
                """
                Analyze the attached image as a misinformation
                and fact-checking analyst.

                IMPORTANT IMAGE ANALYSIS RULES:

                1. Examine the visual content carefully.

                2. Extract any visible text from the image.

                3. Identify factual claims made by:
                   - text inside the image
                   - captions or statements shown in the image
                   - visual context when it makes a factual assertion

                4. Evaluate each factual claim separately.

                5. Do not assume that an image is fake merely because
                   it looks unusual or edited.

                6. Distinguish:
                   - factual misinformation
                   - misleading context
                   - ordinary image editing
                   - possible manipulation
                   - insufficient evidence

                7. Do not claim that an image was AI-generated or
                   manipulated unless there is sufficient evidence.

                8. If the image contains no verifiable factual claim,
                   explain that clearly.

                9. Do not invent the original source of the image.

                Analyze the actual image provided with this request.
                """
        );

        return callGeminiWithImage(
                prompt,
                imageBytes,
                mimeType
        );
    }


    /*
     * Fetches webpage HTML.
     *
     * This is intentionally kept simple for the first version.
     * Later we can add proper HTML parsing and article extraction.
     */
    private String fetchWebPage(String url) {

        try {

            URI uri = UriComponentsBuilder
                    .fromUriString(url)
                    .build()
                    .toUri();

            String html = RestClient.create()
                    .get()
                    .uri(uri)
                    .retrieve()
                    .body(String.class);

            if (html == null) {
                return "";
            }

            return removeHtmlTags(html);

        } catch (RestClientException e) {

            throw new RuntimeException(
                    "Failed to fetch webpage: " + e.getMessage(),
                    e
            );
        }
    }


    /*
     * Very basic HTML-to-text conversion.
     *
     * We will improve this later using a proper HTML parser.
     */
    private String removeHtmlTags(String html) {

        return html
                .replaceAll("(?is)<script.*?>.*?</script>", " ")
                .replaceAll("(?is)<style.*?>.*?</style>", " ")
                .replaceAll("(?is)<[^>]+>", " ")
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&quot;", "\"")
                .replaceAll("&#39;", "'")
                .replaceAll("\\s+", " ")
                .trim();
    }


    /*
     * Sends a normal text prompt to Gemini.
     */
    private String callGeminiWithText(String prompt) {

        Map<String, Object> body = Map.of(
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

        return extractGeminiText(body);
    }


    /*
     * Sends text + image to Gemini.
     *
     * Gemini expects the image as Base64 encoded inlineData.
     */
    private String callGeminiWithImage(
            String prompt,
            byte[] imageBytes,
            String mimeType
    ) {

        String base64Image =
                Base64.getEncoder().encodeToString(imageBytes);

        Map<String, Object> imagePart = Map.of(
                "inlineData", Map.of(
                        "mimeType", mimeType,
                        "data", base64Image
                )
        );

        Map<String, Object> textPart = Map.of(
                "text", prompt
        );

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        textPart,
                                        imagePart
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json"
                )
        );

        return extractGeminiText(body);
    }


    /*
     * Sends the request to Gemini and extracts
     * the generated text from the JSON response.
     */
    private String extractGeminiText(
            Map<String, Object> body
    ) {

        Map<?, ?> response;

        try {

            response = restClient.post()
                    .uri(
                            "/models/gemini-3.7-flash:generateContent?key="
                                    + apiKey
                    )
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

        } catch (org.springframework.web.client.HttpStatusCodeException e) {

            throw new RuntimeException(
                    "Gemini media API call failed with status "
                            + e.getStatusCode()
                            + ": "
                            + e.getResponseBodyAsString(),
                    e
            );
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
                    "Invalid Gemini candidate"
            );
        }

        Object contentObject = candidate.get("content");

        if (!(contentObject instanceof Map<?, ?> content)) {

            throw new RuntimeException(
                    "Gemini response contains no content"
            );
        }

        Object partsObject = content.get("parts");

        if (!(partsObject instanceof List<?> parts)
                || parts.isEmpty()) {

            throw new RuntimeException(
                    "Gemini response contains no parts"
            );
        }

        StringBuilder result = new StringBuilder();

        for (Object partObject : parts) {

            if (partObject instanceof Map<?, ?> part) {

                Object textObject = part.get("text");

                if (textObject != null) {
                    result.append(textObject);
                }
            }
        }

        if (result.isEmpty()) {

            throw new RuntimeException(
                    "Gemini response contains no text"
            );
        }

        return result.toString();
    }
}