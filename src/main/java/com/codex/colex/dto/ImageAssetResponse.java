package com.codex.colex.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ImageAssetResponse {
    private Long id;
    private String title;
    private String prompt;
    private String type;
    private String imageUrl;
    private boolean favorite;
    private boolean edited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}