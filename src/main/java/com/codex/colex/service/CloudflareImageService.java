package com.codex.colex.service;

import com.codex.colex.dto.GenerateGhibliRequest;
import com.codex.colex.dto.ImageGenerationResponse;
import com.codex.colex.dto.RefineImageRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
public class CloudflareImageService {

    private final WebClient webClient;
    private final PromptHelperService promptHelperService;

    @Value("${cloudflare.image.url}")
    private String imageUrl;

    @Value("${cloudflare.image.api-key}")
    private String apiKey;

    public CloudflareImageService(WebClient.Builder builder,
                                  PromptHelperService promptHelperService) {
        this.webClient = builder
                .codecs(c -> c.defaultCodecs().maxInMemorySize(20 * 1024 * 1024))
                .build();
        this.promptHelperService = promptHelperService;
    }

    public Mono<ImageGenerationResponse> generateLogo(String prompt) {
        return generateTextImage(prompt);
    }

    public Mono<ImageGenerationResponse> generateIcon(String prompt) {
        return generateTextImage(prompt);
    }

    public Mono<ImageGenerationResponse> generateGhibli(GenerateGhibliRequest request) {
        String prompt = promptHelperService.enhanceGhibliPrompt(request.getPrompt());
        return generateTextImage(prompt);
    }

    public Mono<ImageGenerationResponse> refine(RefineImageRequest request) {
        return generateTextImage(request.getPrompt());
    }

    private Mono<ImageGenerationResponse> generateTextImage(String prompt) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", "@cf/black-forest-labs/flux-1-schnell");
        body.put("prompt", prompt);

        String url = imageUrl + "/v1/images/generations";
        System.out.println("Cloudflare URL=" + url);
        System.out.println("Cloudflare prompt=" + prompt);

        return webClient.post()
                .uri(url)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), response ->
                        response.bodyToMono(String.class).flatMap(errorBody -> {
                            System.err.println("Cloudflare status=" + response.statusCode());
                            System.err.println("Cloudflare error body=" + errorBody);
                            return Mono.error(new RuntimeException(
                                    "Cloudflare error " + response.statusCode() + ": " + errorBody
                            ));
                        })
                )
                .bodyToMono(ImageGenerationResponse.class)
                .doOnNext(resp -> System.out.println("Cloudflare response received"))
                .doOnError(err -> System.err.println("Cloudflare error=" + err.getMessage()));
    }
}