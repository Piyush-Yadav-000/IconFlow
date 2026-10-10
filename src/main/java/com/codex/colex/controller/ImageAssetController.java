package com.codex.colex.controller;

import com.codex.colex.dto.ImageAssetResponse;
import com.codex.colex.dto.SaveImageRequest;
import com.codex.colex.service.ImageAssetService;
import com.codex.colex.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ImageAssetController {

    private final ImageAssetService imageAssetService;
    private final ImageStorageService imageStorageService;

    @PostMapping("/save")
    public ResponseEntity<ImageAssetResponse> save(@RequestBody SaveImageRequest request, Principal principal) {
        return ResponseEntity.ok(imageAssetService.save(principal.getName(), request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ImageAssetResponse>> history(Principal principal) {
        return ResponseEntity.ok(imageAssetService.history(principal.getName()));
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<ImageAssetResponse>> favorites(Principal principal) {
        return ResponseEntity.ok(imageAssetService.favorites(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageAssetResponse> one(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(imageAssetService.getOne(id, principal.getName()));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<ImageAssetResponse> favorite(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(imageAssetService.toggleFavorite(id, principal.getName()));
    }

    @PatchMapping("/{id}/rename")
    public ResponseEntity<ImageAssetResponse> rename(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body,
                                                     Principal principal) {
        return ResponseEntity.ok(imageAssetService.rename(id, principal.getName(), body.get("title")));
    }

    @PostMapping(value = "/{id}/edited-new", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageAssetResponse> saveEditedAsNew(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file,
            @RequestPart("editMetaJson") String editMetaJson,
            Principal principal
    ) {
        return ResponseEntity.ok(imageAssetService.saveEditedAsNew(id, principal.getName(), file, editMetaJson));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        imageAssetService.delete(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/image/{fileName}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<FileSystemResource> image(@PathVariable String fileName) {
        return ResponseEntity.ok(new FileSystemResource(imageStorageService.getFile(fileName)));
    }
}