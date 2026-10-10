package com.codex.colex.service;

import com.codex.colex.dto.ImageGenerationResponse;
import com.codex.colex.dto.ImageGenerateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ImageGenerationService {

    private final CloudflareImageService cloudflareImageService;
    private final PromptHelperService promptHelperService;
    private final CreditService creditService;

    public Mono<ImageGenerationResponse> generateIconAndDeduct(String email, ImageGenerateRequest request) {
        String finalPrompt = promptHelperService.enhanceIconPrompt(request.getPrompt(), request.getStyle());

        return cloudflareImageService.generateIcon(finalPrompt)
                .doOnSuccess(resp -> creditService.deductOneCredit(email));
    }

    public Mono<ImageGenerationResponse> generateLogoAndDeduct(String email, ImageGenerateRequest request) {
        String finalPrompt = promptHelperService.enhanceLogoPrompt(request.getPrompt(), request.getStyle());

        return cloudflareImageService.generateLogo(finalPrompt)
                .doOnSuccess(resp -> creditService.deductOneCredit(email));
    }
}