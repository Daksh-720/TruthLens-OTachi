package com.daksh.misinformation_detector.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class AnalyzeBatchRequest {

    @NotEmpty(message = "Items list cannot be empty")
    private List<String> items;

    public AnalyzeBatchRequest() {
    }

    public AnalyzeBatchRequest(List<String> items) {
        this.items = items;
    }

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }
}
