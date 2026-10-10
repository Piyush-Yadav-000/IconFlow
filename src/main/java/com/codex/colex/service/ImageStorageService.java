package com.codex.colex.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Base64;
import java.util.UUID;

@Service
public class ImageStorageService {

    @Value("${app.image.storage-path:uploads/images}")
    private String storagePath;

    private File ensureDir() {
        File dir = new File(storagePath);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new RuntimeException("Failed to create storage directory: " + dir.getAbsolutePath());
        }
        return dir;
    }

    public String saveBase64Image(String base64, String prefix) {
        try {
            String clean = base64.contains(",") ? base64.substring(base64.indexOf(",") + 1) : base64;
            File dir = ensureDir();
            String fileName = prefix + "-" + UUID.randomUUID() + ".png";
            File file = new File(dir, fileName);

            byte[] data = Base64.getDecoder().decode(clean);
            try (FileOutputStream fos = new FileOutputStream(file)) {
                fos.write(data);
            }
            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save image", e);
        }
    }

    public String saveMultipartImage(MultipartFile file, String prefix) {
        try {
            File dir = ensureDir();
            String fileName = prefix + "-" + UUID.randomUUID() + ".png";
            File target = new File(dir, fileName);

            try (FileOutputStream fos = new FileOutputStream(target)) {
                fos.write(file.getBytes());
            }
            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save multipart image", e);
        }
    }

    public File getFile(String fileName) {
        return new File(ensureDir(), fileName);
    }
}