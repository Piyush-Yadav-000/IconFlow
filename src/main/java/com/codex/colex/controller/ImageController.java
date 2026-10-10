package com.codex.colex.controller;

import com.codex.colex.dto.*;
import com.codex.colex.service.CloudflareImageService;
import com.codex.colex.service.CreditService;
import com.codex.colex.service.ImageAssetService;
import com.codex.colex.service.PromptHelperService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.security.Principal;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ImageController {

    private final CloudflareImageService cloudflareImageService;
    private final PromptHelperService promptHelperService;
    private final CreditService creditService;
    private final ImageAssetService imageAssetService;

    public ImageController(CloudflareImageService cloudflareImageService,
                           PromptHelperService promptHelperService,
                           CreditService creditService,
                           ImageAssetService imageAssetService) {
        this.cloudflareImageService = cloudflareImageService;
        this.promptHelperService = promptHelperService;
        this.creditService = creditService;
        this.imageAssetService = imageAssetService;
    }

    @PostMapping("/prompt-helper")
    public ResponseEntity<PromptHelperResponse> promptHelper(@RequestBody PromptHelperRequest request) {
        return ResponseEntity.ok(new PromptHelperResponse(
                promptHelperService.enhance(request.getShortText(), request.getMode())
        ));
    }

    @PostMapping("/generate-logo")
    public Mono<ResponseEntity<ImageResponse>> generateLogo(@RequestBody ImageGenerateRequest request,
                                                            Principal principal) {
        String prompt = promptHelperService.enhanceLogoPrompt(request.getPrompt(), request.getStyle());

        return cloudflareImageService.generateLogo(prompt)
                .flatMap(resp -> {
                    if (resp == null || resp.getData() == null || resp.getData().isEmpty()
                            || resp.getData().get(0) == null || resp.getData().get(0).getB64_json() == null) {
                        return Mono.error(new IllegalStateException("Invalid image response"));
                    }

                    if (principal == null) {
                        return Mono.error(new IllegalStateException("Principal is null"));
                    }

                    String b64 = resp.getData().get(0).getB64_json();
                    creditService.deductOneCredit(principal.getName());

                    imageAssetService.save(principal.getName(), new SaveImageRequest() {{
                        setTitle("Logo");
                        setPrompt(request.getPrompt());
                        setType("logo");
                        setBase64(b64);
                    }});

                    return Mono.just(ResponseEntity.ok(new ImageResponse(
                            b64,
                            request.getPrompt()
                    )));
                })
                .doOnError(ex -> System.err.println("generateLogo error: " + ex.getMessage()))
                .onErrorResume(ex ->
                        Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ImageResponse(null, "ERROR: " + ex.getMessage())))
                );
    }

    @PostMapping("/generate-icon")
    public Mono<ResponseEntity<ImageResponse>> generateIcon(@RequestBody ImageGenerateRequest request,
                                                            Principal principal) {
        String prompt = promptHelperService.enhanceIconPrompt(request.getPrompt(), request.getStyle());

        return cloudflareImageService.generateIcon(prompt)
                .flatMap(resp -> {
                    if (resp == null || resp.getData() == null || resp.getData().isEmpty()
                            || resp.getData().get(0) == null || resp.getData().get(0).getB64_json() == null) {
                        return Mono.error(new IllegalStateException("Invalid image response"));
                    }

                    if (principal == null) {
                        return Mono.error(new IllegalStateException("Principal is null"));
                    }

                    String b64 = resp.getData().get(0).getB64_json();
                    creditService.deductOneCredit(principal.getName());

                    imageAssetService.save(principal.getName(), new SaveImageRequest() {{
                        setTitle("Icon");
                        setPrompt(request.getPrompt());
                        setType("icon");
                        setBase64(b64);
                    }});

                    return Mono.just(ResponseEntity.ok(new ImageResponse(
                            b64,
                            request.getPrompt()
                    )));
                })
                .doOnError(ex -> System.err.println("generateIcon error: " + ex.getMessage()))
                .onErrorResume(ex ->
                        Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ImageResponse(null, "ERROR: " + ex.getMessage())))
                );
    }

    @PostMapping("/generate-ghibli")
    public Mono<ResponseEntity<ImageResponse>> generateGhibli(@RequestBody GenerateGhibliRequest request,
                                                              Principal principal) {
        return cloudflareImageService.generateGhibli(request)
                .flatMap(resp -> {
                    if (resp == null || resp.getData() == null || resp.getData().isEmpty()
                            || resp.getData().get(0) == null || resp.getData().get(0).getB64_json() == null) {
                        return Mono.error(new IllegalStateException("Invalid image response"));
                    }

                    if (principal == null) {
                        return Mono.error(new IllegalStateException("Principal is null"));
                    }

                    String b64 = resp.getData().get(0).getB64_json();
                    creditService.deductOneCredit(principal.getName());

                    imageAssetService.save(principal.getName(), new SaveImageRequest() {{
                        setTitle("Ghibli");
                        setPrompt(request.getPrompt());
                        setType("ghibli");
                        setBase64(b64);
                    }});

                    return Mono.just(ResponseEntity.ok(new ImageResponse(
                            b64,
                            request.getPrompt()
                    )));
                })
                .onErrorResume(ex ->
                        Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ImageResponse(null, "ERROR: " + ex.getMessage())))
                );
    }

    @PostMapping("/refine-image")
    public Mono<ResponseEntity<ImageResponse>> refineImage(@RequestBody RefineImageRequest request,
                                                           Principal principal) {
        return cloudflareImageService.refine(request)
                .flatMap(resp -> {
                    if (resp == null || resp.getData() == null || resp.getData().isEmpty()
                            || resp.getData().get(0) == null || resp.getData().get(0).getB64_json() == null) {
                        return Mono.error(new IllegalStateException("Invalid image response"));
                    }

                    if (principal == null) {
                        return Mono.error(new IllegalStateException("Principal is null"));
                    }

                    String b64 = resp.getData().get(0).getB64_json();
                    creditService.deductOneCredit(principal.getName());

                    imageAssetService.save(principal.getName(), new SaveImageRequest() {{
                        setTitle("Refined Image");
                        setPrompt(request.getPrompt());
                        setType("refine");
                        setBase64(b64);
                    }});

                    return Mono.just(ResponseEntity.ok(new ImageResponse(
                            b64,
                            request.getPrompt()
                    )));
                })
                .onErrorResume(ex ->
                        Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ImageResponse(null, "ERROR: " + ex.getMessage())))
                );
    }
}