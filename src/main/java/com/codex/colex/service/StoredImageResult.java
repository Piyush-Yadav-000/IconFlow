package com.codex.colex.service;

public class StoredImageResult {
    private String storageType;
    private String imageUrl;
    private String publicId;
    private String fileName;

    public StoredImageResult(String storageType, String imageUrl, String publicId, String fileName) {
        this.storageType = storageType;
        this.imageUrl = imageUrl;
        this.publicId = publicId;
        this.fileName = fileName;
    }

    public String getStorageType() { return storageType; }
    public String getImageUrl() { return imageUrl; }
    public String getPublicId() { return publicId; }
    public String getFileName() { return fileName; }
}