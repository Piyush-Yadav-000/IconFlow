package com.codex.colex.dto;

public class PromptHelperResponse {
    private String prompt;

    public PromptHelperResponse() {}

    public PromptHelperResponse(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
}