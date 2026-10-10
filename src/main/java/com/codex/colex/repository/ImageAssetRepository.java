package com.codex.colex.repository;

import com.codex.colex.model.ImageAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageAssetRepository extends JpaRepository<ImageAsset, Long> {
    List<ImageAsset> findByEmailOrderByCreatedAtDesc(String email);
    List<ImageAsset> findByEmailAndFavoriteTrueOrderByCreatedAtDesc(String email);
    Optional<ImageAsset> findByIdAndEmail(Long id, String email);
}