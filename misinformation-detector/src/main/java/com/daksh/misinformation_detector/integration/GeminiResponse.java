package com.daksh.misinformation_detector.integration;

import java.util.List;

public class GeminiResponse {

    private String verdict;
    private int credibilityScore;
    private String explanation;
    private List<String> actualFacts;
    private List<String> falseClaims;
    private List<String> evidence;
    private List<String> sources;

    public GeminiResponse() {
    }

    public GeminiResponse(
            String verdict,
            int credibilityScore,
            String explanation,
            List<String> actualFacts,
            List<String> falseClaims,
            List<String> evidence,
            List<String> sources
    ) {
        this.verdict = verdict;
        this.credibilityScore = credibilityScore;
        this.explanation = explanation;
        this.actualFacts = actualFacts;
        this.falseClaims = falseClaims;
        this.evidence = evidence;
        this.sources = sources;
    }

    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public int getCredibilityScore() {
        return credibilityScore;
    }

    public void setCredibilityScore(int credibilityScore) {
        this.credibilityScore = credibilityScore;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public List<String> getActualFacts() {
        return actualFacts;
    }

    public void setActualFacts(List<String> actualFacts) {
        this.actualFacts = actualFacts;
    }

    public List<String> getFalseClaims() {
        return falseClaims;
    }

    public void setFalseClaims(List<String> falseClaims) {
        this.falseClaims = falseClaims;
    }

    public List<String> getEvidence() {
        return evidence;
    }

    public void setEvidence(List<String> evidence) {
        this.evidence = evidence;
    }

    public List<String> getSources() {
        return sources;
    }

    public void setSources(List<String> sources) {
        this.sources = sources;
    }
}