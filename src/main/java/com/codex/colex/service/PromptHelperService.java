package com.codex.colex.service;

import org.springframework.stereotype.Service;

@Service
public class PromptHelperService {

    public String enhance(String shortText, String mode) {
        String text = (shortText == null || shortText.isBlank()) ? "modern technology startup" : shortText.trim();
        String m = (mode == null || mode.isBlank()) ? "logo" : mode.trim().toLowerCase();

        return switch (m) {
            case "logo" -> enhanceLogoPrompt(text, "default");
            case "icon" -> enhanceIconPrompt(text, "default");
            case "ghibli" -> enhanceGhibliPrompt(text);
            default -> enhanceLogoPrompt(text, "default");
        };
    }

    public String enhanceLogoPrompt(String prompt, String style) {
        prompt = (prompt == null || prompt.isBlank())
                ? "modern technology startup"
                : prompt.trim();

        style = (style == null || style.isBlank())
                ? "minimal"
                : style.trim();

        return """
Create EXACTLY ONE world-class vector logo for:

%s

Brand Style:
%s

Design Requirements:
• Premium brand identity
• Fortune 500 quality
• Similar visual quality to Apple, Stripe, Airbnb, Notion, Slack, Figma, Linear and Spotify branding
• Unique and original
• Instantly recognizable
• Minimal geometric design
• Bold silhouette
• Flat vector style
• Elegant proportions
• Clean symmetry
• Strong visual balance
• Timeless design
• Premium negative space usage
• Modern startup branding
• Professional visual identity
• Single centered logo
• Sharp edges
• Crisp vector appearance
• High contrast
• Luxury aesthetic
• White background
• No gradients unless essential
• Suitable for websites, mobile apps, favicon, business cards and merchandise

Negative Prompt:
• No text
• No company name
• No letters unless explicitly requested
• No watermark
• No mockup
• No business card
• No paper
• No 3D render
• No background scene
• No multiple logos
• No logo sheet
• No collage
• No drop shadow
• No texture
• No border

Output:
Exactly ONE premium professional vector logo centered on a plain white background.
""".formatted(prompt, style);
    }

    public String enhanceIconPrompt(String description, String style) {
        description = description == null || description.isBlank()
                ? "modern mobile application"
                : description.trim();

        return """
Create EXACTLY ONE premium mobile app icon.

App:
%s

Design Style:
Modern Apple App Store quality.

Requirements:
• Rounded square icon
• Premium mobile app icon
• Soft gradient background
• Beautiful lighting
• Soft shadows
• Soft reflections
• Glassmorphism
• Claymorphism
• Centered object
• High depth
• Elegant composition
• Modern UI design
• Minimal details
• Bright colors
• Premium quality
• High resolution
• Icon fills most of the canvas
• Symmetrical composition
• Professional mobile application branding

Negative Prompt:
• No multiple icons
• No icon sheet
• No collage
• No watermark
• No text
• No screenshot
• No phone frame
• No UI
• No border
• No realistic photo
• No background scene
• No people
• No animals unless requested

Output:
Exactly ONE premium app icon.
""".formatted(description);
    }

    public String enhanceGhibliPrompt(String description) {
        description = (description == null || description.isBlank())
                ? "peaceful countryside at sunset"
                : description.trim();

        return """
Create a Studio Ghibli style illustration of: %s.
Use soft watercolor textures, warm light, whimsical atmosphere, hand-painted details, and a nostalgic cinematic mood.
""".formatted(description);
    }
}