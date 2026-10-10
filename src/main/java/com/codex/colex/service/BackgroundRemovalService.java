package com.codex.colex.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.File;

@Service
public class BackgroundRemovalService {

    private final WebClient webClient;

    @Value("${bg.remove.api.url}")
    private String apiUrl;

    @Value("${bg.remove.api.key}")
    private String apiKey;

    public BackgroundRemovalService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                        .build())
                .build();
    }

    public Mono<byte[]> removeBackground(File imageFile) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("image_file", new FileSystemResource(imageFile));

        return webClient.post()
                .uri(apiUrl)
                .header("X-Api-Key", apiKey)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(builder.build())
                .retrieve()
                .bodyToMono(byte[].class);
    }
}