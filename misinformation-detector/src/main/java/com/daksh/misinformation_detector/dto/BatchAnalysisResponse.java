package com.daksh.misinformation_detector.dto;

import com.daksh.misinformation_detector.integration.GeminiResponse;

import java.util.List;

public class BatchAnalysisResponse {

    private int total;
    private List<BatchItemResult> results;

    public BatchAnalysisResponse() {
    }

    public BatchAnalysisResponse(int total, List<BatchItemResult> results) {
        this.total = total;
        this.results = results;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public List<BatchItemResult> getResults() {
        return results;
    }

    public void setResults(List<BatchItemResult> results) {
        this.results = results;
    }

    public static class BatchItemResult {
        private String content;
        private GeminiResponse analysis;
        private String error;

        public BatchItemResult() {
        }

        public BatchItemResult(String content, GeminiResponse analysis, String error) {
            this.content = content;
            this.analysis = analysis;
            this.error = error;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public GeminiResponse getAnalysis() {
            return analysis;
        }

        public void setAnalysis(GeminiResponse analysis) {
            this.analysis = analysis;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }
    }
}
