package com.daksh.misinformation_detector;

import com.daksh.misinformation_detector.integration.GeminiIntegration;
import com.daksh.misinformation_detector.integration.GeminiResponse;
import com.daksh.misinformation_detector.integration.GeminiTextIntegration;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MisinformationController.class)
class MisinformationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GeminiTextIntegration geminiTextIntegration;

    @MockitoBean
    private GeminiIntegration geminiIntegration;

    @Test
    void healthCheck_Success() throws Exception {
        Mockito.when(geminiIntegration.checkHealth()).thenReturn(true);

        mockMvc.perform(get("/api/misinformation/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.geminiIntegration").value("UP"));
    }

    @Test
    void analyzeText_Success() throws Exception {
        GeminiResponse mockResponse = new GeminiResponse(
                "FAKE",
                10,
                "The claim is scientifically false.",
                List.of("The moon is a rocky satellite."),
                List.of("The moon is made of green cheese."),
                List.of("Lunar samples contain no cheese."),
                List.of("https://nasa.gov")
        );

        Mockito.when(geminiTextIntegration.analyzeTextStructured(anyString()))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/misinformation/analyze-text")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"The moon is made of green cheese.\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verdict").value("FAKE"))
                .andExpect(jsonPath("$.credibilityScore").value(10))
                .andExpect(jsonPath("$.explanation").value("The claim is scientifically false."));
    }

    @Test
    void analyzeText_EmptyContent_BadRequest() throws Exception {
        mockMvc.perform(post("/api/misinformation/analyze-text")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void analyzeUrl_Success() throws Exception {
        GeminiResponse mockResponse = new GeminiResponse(
                "GENUINE",
                95,
                "The article presents verified factual claims.",
                List.of("SpaceX successfully launched Starship."),
                List.of(),
                List.of("Official launch broadcast."),
                List.of("https://example.com/article")
        );

        Mockito.when(geminiTextIntegration.analyzeUrl(anyString()))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/misinformation/analyze-url")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"url\":\"https://example.com/article\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verdict").value("GENUINE"))
                .andExpect(jsonPath("$.credibilityScore").value(95));
    }

    @Test
    void analyzeBatch_Success() throws Exception {
        GeminiResponse mockResponse = new GeminiResponse(
                "FAKE",
                5,
                "False claim.",
                List.of(),
                List.of("Earth is flat"),
                List.of(),
                List.of()
        );

        Mockito.when(geminiTextIntegration.analyzeTextStructured(anyString()))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/misinformation/analyze-batch")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"items\":[\"The earth is flat.\",\"Vaccines contain microchips.\"]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(2))
                .andExpect(jsonPath("$.results[0].analysis.verdict").value("FAKE"));
    }
}
