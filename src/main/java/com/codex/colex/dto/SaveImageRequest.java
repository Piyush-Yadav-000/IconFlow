package com.codex.colex.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveImageRequest {
    private String title;
    private String prompt;
    private String type;
    private String base64;
}