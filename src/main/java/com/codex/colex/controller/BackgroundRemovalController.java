package com.codex.colex.controller;

import com.codex.colex.dto.SaveImageRequest;
import com.codex.colex.service.BackgroundRemovalService;
import com.codex.colex.service.ImageAssetService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BackgroundRemovalController {

    private final BackgroundRemovalService backgroundRemovalService;
    private final ImageAssetService imageAssetService;

    public BackgroundRemovalController(BackgroundRemovalService backgroundRemovalService,
                                       ImageAssetService imageAssetService) {
        this.backgroundRemovalService = backgroundRemovalService;
        this.imageAssetService = imageAssetService;
    }

    @PostMapping(value = "/remove-background", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<byte[]>> removeBackground(@RequestPart("file") MultipartFile file,
                                                         java.security.Principal principal) throws IOException {
        File temp = File.createTempFile("upload-", "-" + file.getOriginalFilename());
        file.transferTo(temp);

        return backgroundRemovalService.removeBackground(temp)
                .map(bytes -> {
                    if (principal != null) {
                        String base64 = Base64.getEncoder().encodeToString(bytes);

                        SaveImageRequest saveRequest = new SaveImageRequest();
                        saveRequest.setTitle("Background Removed");
                        saveRequest.setPrompt("Background removed from uploaded image");
                        saveRequest.setType("bgremove");
                        saveRequest.setBase64(base64);

                        imageAssetService.save(principal.getName(), saveRequest);
                    }

                    return ResponseEntity.ok()
                            .contentType(MediaType.IMAGE_PNG)
                            .body(bytes);
                })
                .doFinally(signal -> temp.delete());
    }
}