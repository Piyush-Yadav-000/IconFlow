package com.codex.colex.dto;

import lombok.Data;

@Data
public class GenerateGhibliRequest {
    private String prompt;
    private String style;
}