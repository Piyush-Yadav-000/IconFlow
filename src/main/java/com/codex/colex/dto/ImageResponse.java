package com.codex.colex.dto;

public class ImageResponse {
    private String base64;
    private String prompt;

    public ImageResponse() {}

    public ImageResponse(String base64, String prompt) {
        this.base64 = base64;
        this.prompt = prompt;
    }

    public String getBase64() { return base64; }
    public void setBase64(String base64) { this.base64 = base64; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
}