package com.codex.colex.service;

import org.springframework.stereotype.Service;

@Service
public class PromptEnhancementService {

    public String enhanceLogoPrompt(String userDescription, String style) {

        String description = (userDescription == null || userDescription.isBlank())
                ? "modern technology company"
                : userDescription.trim();

        String logoStyle = getStyle(style);

        return """
Create EXACTLY ONE professional vector logo.

Brand Description:
%s

Logo Style:
%s

Design Requirements:
- Generate ONLY ONE logo
- Center the logo on a pure white background
- Professional brand identity
- Premium startup quality
- Flat vector illustration
- Clean geometric construction
- Strong memorable symbol
- Minimalist design
- Modern visual identity
- Elegant proportions
- Balanced composition
- Consistent symmetry
- High contrast
- Crisp sharp edges
- Scalable from favicon to billboard
- Suitable for website, mobile app, packaging, social media and print
- Limited professional color palette
- Simple but distinctive
- Award-winning branding quality

Strictly Avoid:
- Multiple logos
- Logo sheets
- Grid layouts
- Mockups
- Business cards
- T-shirts
- Sign boards
- Office walls
- Packaging previews
- Watermarks
- Decorative backgrounds
- Shadows outside the logo
- 3D scenes
- Photographs
- Realistic objects
- Characters
- Animals unless requested
- Landscapes
- Extra icons
- Clipart
- Cartoon style
- Low quality
- Blurry edges

Output:
One finished premium vector logo only.
""".formatted(description, logoStyle);
    }

    private String getStyle(String style) {

        if (style == null || style.isBlank()) {
            return "Modern Minimalist";
        }

        return switch (style.toLowerCase()) {

            case "minimalist" ->
                    "Minimalist, simple geometry, maximum negative space, one iconic symbol, premium startup branding.";

            case "modern" ->
                    "Modern geometric branding, clean lines, premium technology company appearance.";

            case "luxury" ->
                    "Luxury branding, elegant shapes, premium gold and black aesthetic, sophisticated identity.";

            case "flat" ->
                    "Flat vector design, solid colors, no gradients, clean scalable shapes.";

            case "gradient" ->
                    "Modern gradient branding with smooth color transitions while maintaining simplicity.";

            case "line art" ->
                    "Elegant line-art logo using clean monoline strokes and balanced proportions.";

            case "geometric" ->
                    "Geometric logo built using circles, squares and precise symmetry.";

            case "3d" ->
                    "Premium 3D logo with subtle depth, realistic lighting, maintaining a clean brand identity.";

            case "vintage" ->
                    "Vintage emblem logo with timeless branding, classic badge style and retro typography.";

            default ->
                    style;
        };
    }
}