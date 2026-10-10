package com.codex.colex.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Entity
@Getter
@Setter
public class ImageAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String title;
    private String prompt;
    private String type;

    private String originalFileName;
    private String storedFileName;
    private String contentType;
    private String imagePath;

    private boolean favorite;
    private boolean edited;
    private Long originalAssetId;

    @Column(length = 4000)
    private String editMetaJson;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String cloudinaryUrl;
    private String cloudinaryPublicId;
    private String storageType; // "cloudinary" or "local"

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}