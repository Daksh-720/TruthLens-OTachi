package com.daksh.misinformation_detector.dto;

public class AnalyzeTextRequest {
    private String content;

    public AnalyzeTextRequest() {
    }

    public AnalyzeTextRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
