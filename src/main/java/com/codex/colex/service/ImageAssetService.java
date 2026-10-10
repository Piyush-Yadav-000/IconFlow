package com.codex.colex.service;

import com.codex.colex.dto.ImageAssetResponse;
import com.codex.colex.dto.SaveImageRequest;
import com.codex.colex.model.ImageAsset;
import com.codex.colex.repository.ImageAssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageAssetService {

    private final ImageAssetRepository imageAssetRepository;
    private final ImageStorageService imageStorageService;
    private final CloudinaryService cloudinaryService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Transactional
    public ImageAssetResponse save(String email, SaveImageRequest request) {
        StoredImageResult result;

        try {
            String base64 = request.getBase64();
            if (base64 == null || base64.isBlank()) {
                throw new IllegalArgumentException("base64 is empty");
            }

            byte[] bytes = base64.contains(",")
                    ? Base64.getDecoder().decode(base64.substring(base64.indexOf(",") + 1))
                    : Base64.getDecoder().decode(base64);

            System.out.println("ImageAssetService.save start");
            System.out.println("email=" + email);
            System.out.println("title=" + request.getTitle());
            System.out.println("type=" + request.getType());
            System.out.println("decoded bytes length=" + bytes.length);

            MultipartFile file = new ByteArrayMultipartFile(
                    "file",
                    "generated.png",
                    "image/png",
                    bytes
            );

            Map<String, Object> upload = cloudinaryService.uploadImage(file, "generated-images");

            Object secureUrl = upload.get("secure_url");
            Object publicId = upload.get("public_id");

            System.out.println("Cloudinary secure_url=" + secureUrl);
            System.out.println("Cloudinary public_id=" + publicId);

            if (secureUrl == null || publicId == null) {
                throw new RuntimeException("Cloudinary response missing secure_url/public_id");
            }

            result = new StoredImageResult(
                    "cloudinary",
                    secureUrl.toString(),
                    publicId.toString(),
                    null
            );
        } catch (Exception cloudinaryError) {
            System.err.println("Cloudinary branch failed, falling back to local storage.");
            cloudinaryError.printStackTrace();

            String fileName = imageStorageService.saveBase64Image(request.getBase64(), request.getType());
            System.out.println("Local save fileName=" + fileName);

            result = new StoredImageResult(
                    "local",
                    "/api/assets/image/" + fileName,
                    null,
                    fileName
            );
        }

        ImageAsset asset = new ImageAsset();
        asset.setEmail(email);
        asset.setTitle(request.getTitle());
        asset.setPrompt(request.getPrompt());
        asset.setType(request.getType());
        asset.setFavorite(false);
        asset.setEdited(false);
        asset.setOriginalAssetId(null);
        asset.setEditMetaJson(null);

        asset.setStorageType(result.getStorageType());
        asset.setCloudinaryUrl("cloudinary".equals(result.getStorageType()) ? result.getImageUrl() : null);
        asset.setCloudinaryPublicId("cloudinary".equals(result.getStorageType()) ? result.getPublicId() : null);
        asset.setStoredFileName(result.getFileName());
        asset.setImagePath("local".equals(result.getStorageType()) ? "/api/assets/image/" + result.getFileName() : null);

        ImageAsset saved = imageAssetRepository.save(asset);
        System.out.println("Saved ImageAsset id=" + saved.getId() + ", storageType=" + saved.getStorageType());

        return map(saved);
    }

    @Transactional
    public ImageAssetResponse saveEditedAsNew(Long originalId, String email, MultipartFile file, String editMetaJson) {
        ImageAsset original = imageAssetRepository.findByIdAndEmail(originalId, email)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        StoredImageResult result;
        try {
            System.out.println("ImageAssetService.saveEditedAsNew start");
            System.out.println("originalId=" + originalId + ", email=" + email);
            System.out.println("edited file name=" + file.getOriginalFilename() + ", size=" + file.getSize());

            Map<String, Object> upload = cloudinaryService.uploadImage(file, "edited-images");

            Object secureUrl = upload.get("secure_url");
            Object publicId = upload.get("public_id");

            System.out.println("Edited Cloudinary secure_url=" + secureUrl);
            System.out.println("Edited Cloudinary public_id=" + publicId);

            if (secureUrl == null || publicId == null) {
                throw new RuntimeException("Cloudinary response missing secure_url/public_id");
            }

            result = new StoredImageResult(
                    "cloudinary",
                    secureUrl.toString(),
                    publicId.toString(),
                    null
            );
        } catch (Exception cloudinaryError) {
            System.err.println("Cloudinary edited upload failed, fallback to local.");
            cloudinaryError.printStackTrace();

            String fileName = imageStorageService.saveMultipartImage(file, "edited");
            System.out.println("Local edited save fileName=" + fileName);

            result = new StoredImageResult(
                    "local",
                    "/api/assets/image/" + fileName,
                    null,
                    fileName
            );
        }

        ImageAsset edited = new ImageAsset();
        edited.setEmail(email);
        edited.setTitle(original.getTitle() != null ? original.getTitle() + " (Edited)" : "Edited Image");
        edited.setPrompt(original.getPrompt());
        edited.setType(original.getType());
        edited.setFavorite(false);
        edited.setEdited(true);
        edited.setOriginalAssetId(original.getId());
        edited.setEditMetaJson(editMetaJson);

        edited.setStorageType(result.getStorageType());
        edited.setCloudinaryUrl("cloudinary".equals(result.getStorageType()) ? result.getImageUrl() : null);
        edited.setCloudinaryPublicId("cloudinary".equals(result.getStorageType()) ? result.getPublicId() : null);
        edited.setStoredFileName(result.getFileName());
        edited.setImagePath("local".equals(result.getStorageType()) ? "/api/assets/image/" + result.getFileName() : null);

        ImageAsset saved = imageAssetRepository.save(edited);
        System.out.println("Saved edited asset id=" + saved.getId() + ", storageType=" + saved.getStorageType());

        return map(saved);
    }

    public List<ImageAssetResponse> history(String email) {
        return imageAssetRepository.findByEmailOrderByCreatedAtDesc(email).stream().map(this::map).toList();
    }

    public List<ImageAssetResponse> favorites(String email) {
        return imageAssetRepository.findByEmailAndFavoriteTrueOrderByCreatedAtDesc(email).stream().map(this::map).toList();
    }

    public ImageAssetResponse getOne(Long id, String email) {
        ImageAsset asset = imageAssetRepository.findByIdAndEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        return map(asset);
    }

    @Transactional
    public ImageAssetResponse toggleFavorite(Long id, String email) {
        ImageAsset asset = imageAssetRepository.findByIdAndEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        asset.setFavorite(!asset.isFavorite());
        return map(imageAssetRepository.save(asset));
    }

    @Transactional
    public ImageAssetResponse rename(Long id, String email, String title) {
        ImageAsset asset = imageAssetRepository.findByIdAndEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        asset.setTitle(title);
        return map(imageAssetRepository.save(asset));
    }

    @Transactional
    public void delete(Long id, String email) {
        ImageAsset asset = imageAssetRepository.findByIdAndEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        if ("cloudinary".equals(asset.getStorageType()) && asset.getCloudinaryPublicId() != null) {
            cloudinaryService.deleteImage(asset.getCloudinaryPublicId());
        }

        imageAssetRepository.delete(asset);
    }

    private ImageAssetResponse map(ImageAsset asset) {
        ImageAssetResponse r = new ImageAssetResponse();
        r.setId(asset.getId());
        r.setTitle(asset.getTitle());
        r.setPrompt(asset.getPrompt());
        r.setType(asset.getType());
        r.setImageUrl(
                "cloudinary".equals(asset.getStorageType())
                        ? asset.getCloudinaryUrl()
                        : baseUrl + asset.getImagePath()
        );
        r.setFavorite(asset.isFavorite());
        r.setEdited(asset.isEdited());
        r.setCreatedAt(asset.getCreatedAt());
        r.setUpdatedAt(asset.getUpdatedAt());
        return r;
    }
}