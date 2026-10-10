//package com.codex.colex.controller;
//
//import com.codex.colex.dto.ImageGenerationResponse;
//import com.codex.colex.service.CloudflareImageService;
//import com.codex.colex.service.PromptEnhancementService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import reactor.core.publisher.Mono;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api")
//@CrossOrigin(origins = "*")
//public class ImageGenController {
//
//    private final CloudflareImageService cloudflareImageService;
//    private final PromptEnhancementService promptEnhancementService;
//
//    public ImageGenController(CloudflareImageService cloudflareImageService,
//                              PromptEnhancementService promptEnhancementService) {
//        this.cloudflareImageService = cloudflareImageService;
//        this.promptEnhancementService = promptEnhancementService;
//    }
//
//    @PostMapping("/generate-logo")
//    public Mono<ResponseEntity<Map<String, String>>> generateLogo(@RequestBody GenerateRequest request) {
//        String finalPrompt = promptEnhancementService.enhanceLogoPrompt(
//                request.getPrompt(),
//                request.getStyle()
//        );
//
//        return cloudflareImageService.generateLogo(finalPrompt)
//                .map(resp -> {
//                    String base64 = resp.getData().get(0).getB64_json();
//                    return ResponseEntity.ok(Map.of(
//                            "base64", base64,
//                            "prompt", finalPrompt
//                    ));
//                });
//    }
//
//    public static class GenerateRequest {
//        private String prompt;
//        private String style;
//
//        public String getPrompt() {
//            return prompt;
//        }
//
//        public void setPrompt(String prompt) {
//            this.prompt = prompt;
//        }
//
//        public String getStyle() {
//            return style;
//        }
//
//        public void setStyle(String style) {
//            this.style = style;
//        }
//    }
//}