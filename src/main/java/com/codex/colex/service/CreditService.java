package com.codex.colex.service;

import com.codex.colex.model.User;
import com.codex.colex.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreditService {

    private final UserRepository userRepository;

    @Transactional
    public void deductOneCredit(String email) {
        System.out.println("CreditService called for email=" + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Integer credits = user.getCredits();
        System.out.println("Credits before=" + credits);

        if (credits == null || credits <= 0) {
            throw new IllegalStateException("Not enough credits");
        }

        user.setCredits(credits - 1);
        userRepository.save(user);

        System.out.println("Credits after=" + user.getCredits());
    }
}