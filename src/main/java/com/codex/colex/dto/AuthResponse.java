package com.codex.colex.dto;

public record AuthResponse(String accessToken, String refreshToken, UserDto user) {}
