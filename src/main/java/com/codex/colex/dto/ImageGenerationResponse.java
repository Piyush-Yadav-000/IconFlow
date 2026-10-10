package com.codex.colex.dto;

import java.util.List;

public class ImageGenerationResponse {

    private List<ImageData> data;

    public List<ImageData> getData() {
        return data;
    }

    public void setData(List<ImageData> data) {
        this.data = data;
    }

    public static class ImageData {
        private String b64_json;

        public String getB64_json() {
            return b64_json;
        }

        public void setB64_json(String b64_json) {
            this.b64_json = b64_json;
        }
    }
}