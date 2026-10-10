package com.codex.colex.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map<String, Object> uploadImage(MultipartFile file, String folder) {
        try {
            System.out.println("Cloudinary upload start. fileName=" + file.getOriginalFilename()
                    + ", size=" + file.getSize()
                    + ", contentType=" + file.getContentType()
                    + ", folder=" + folder);

            Map<String, Object> upload = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", "image"
            ));

            System.out.println("Cloudinary upload success response = " + upload);
            return upload;
        } catch (Exception e) {
            System.err.println("Cloudinary upload failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }

    public void deleteImage(String publicId) {
        try {
            System.out.println("Cloudinary delete start. publicId=" + publicId);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            System.err.println("Cloudinary delete failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete image from Cloudinary", e);
        }
    }
}