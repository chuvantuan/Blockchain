package com.dao.adminservice.service;

import com.dao.adminservice.dto.CrackDemoResponse;
import com.dao.adminservice.dto.CrackResult;
import com.dao.adminservice.entity.CrackDemoHistory;
import com.dao.adminservice.repository.CrackDemoHistoryRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

@Service
public class SecurityDemoService {

    private final PasswordEncoder passwordEncoder;
    private final CrackDemoHistoryRepository historyRepository;

    public SecurityDemoService(PasswordEncoder passwordEncoder, CrackDemoHistoryRepository historyRepository) {
        this.passwordEncoder = passwordEncoder;
        this.historyRepository = historyRepository;
    }

    public List<CrackDemoHistory> getHistory() {
        return historyRepository.findAll();
    }

    @Transactional
    public CrackDemoResponse runDemo(String password) {
        List<CrackResult> results = new ArrayList<>();

        // MD5
        results.add(runIndividualTest("MD5", password));

        // SHA-1
        results.add(runIndividualTest("SHA-1", password));

        // Bcrypt
        results.add(runIndividualTest("Bcrypt", password));

        return new CrackDemoResponse(password, results);
    }

    private CrackResult runIndividualTest(String algorithm, String password) {
        long startTime, endTime;
        String hash;

        // 1. Hashing
        if ("Bcrypt".equals(algorithm)) {
            hash = passwordEncoder.encode(password);
        } else {
            hash = hashWith(algorithm, password);
        }

        // 2. Cracking
        startTime = System.currentTimeMillis();
        BruteForceResult bruteForceResult;
        if ("Bcrypt".equals(algorithm)) {
            // For Bcrypt, we set a timeout to demonstrate its resistance
            bruteForceResult = bruteForceAttackWithTimeout(hash, 5000); // 5 second timeout
        } else {
            // For MD5/SHA-1, we let it run until it finds the password (should be fast for simple passwords)
            bruteForceResult = bruteForceAttack(hash, algorithm);
        }
        endTime = System.currentTimeMillis();

        long timeTaken = endTime - startTime;

        // 3. Save result to history
        saveResultToHistory(password, algorithm, hash, bruteForceResult, timeTaken);

        return new CrackResult(
                algorithm,
                hash,
                bruteForceResult.isCracked(),
                timeTaken,
                bruteForceResult.getAttempts(),
                bruteForceResult.getCrackedPassword()
        );
    }

    private void saveResultToHistory(String originalPassword, String algorithm, String hash, BruteForceResult result, long timeTaken) {
        CrackDemoHistory historyEntry = new CrackDemoHistory();
        historyEntry.setOriginalPassword(originalPassword);
        historyEntry.setAlgorithm(algorithm);
        historyEntry.setHashValue(hash);
        historyEntry.setCracked(result.isCracked());
        historyEntry.setTimeTakenMs(timeTaken);
        historyEntry.setAttempts(result.getAttempts());
        historyEntry.setCrackedPassword(result.getCrackedPassword());
        historyRepository.save(historyEntry);
    }

    private String hashWith(String algorithm, String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance(algorithm);
            byte[] encodedhash = digest.digest(text.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Could not find algorithm " + algorithm, e);
        }
    }

    private BruteForceResult bruteForceAttack(String targetHash, String algorithm) {
        long attempts = 0;
        long startTime = System.currentTimeMillis();
        long timeout = 10000; // 10 second timeout for MD5/SHA-1
        
        // A simple character set for the demo
        // Using only digits for faster demo (0-9 = 10 chars instead of 36)
        String charset = "0123456789abcdefghijklmnopqrstuvwxyz";
        int maxLength = 8; // Limit length to avoid running forever

        for (int length = 1; length <= maxLength; length++) {
            char[] currentGuess = new char[length];
            Generator generator = new Generator(charset, currentGuess);
            while (generator.hasNext()) {
                // Check timeout every 10000 attempts for performance
                if (attempts % 10000 == 0 && System.currentTimeMillis() - startTime > timeout) {
                    return new BruteForceResult(false, attempts, null);
                }
                
                attempts++;
                String guess = generator.next();
                String guessHash = hashWith(algorithm, guess);
                if (targetHash.equals(guessHash)) {
                    return new BruteForceResult(true, attempts, guess);
                }
            }
        }
        return new BruteForceResult(false, attempts, null);
    }

    private BruteForceResult bruteForceAttackWithTimeout(String targetHash, long timeoutMs) {
        long attempts = 0;
        long startTime = System.currentTimeMillis();
        String charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        int maxLength = 10; // A bit longer to show it will time out

        for (int length = 1; length <= maxLength; length++) {
            char[] currentGuess = new char[length];
            Generator generator = new Generator(charset, currentGuess);
            while (generator.hasNext()) {
                if (System.currentTimeMillis() - startTime > timeoutMs) {
                    return new BruteForceResult(false, attempts, null); // Timed out
                }
                attempts++;
                String guess = generator.next();
                if (passwordEncoder.matches(guess, targetHash)) {
                    return new BruteForceResult(true, attempts, guess);
                }
            }
        }
        return new BruteForceResult(false, attempts, null);
    }


    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    // Helper class for brute-force generation
    private static class BruteForceResult {
        private final boolean cracked;
        private final long attempts;
        private final String crackedPassword;

        public BruteForceResult(boolean cracked, long attempts, String crackedPassword) {
            this.cracked = cracked;
            this.attempts = attempts;
            this.crackedPassword = crackedPassword;
        }

        public boolean isCracked() { return cracked; }
        public long getAttempts() { return attempts; }
        public String getCrackedPassword() { return crackedPassword; }
    }

    // Helper for generating permutations
    private static class Generator {
        private final String charset;
        private final char[] currentGuess;
        private boolean hasNext = true;

        Generator(String charset, char[] currentGuess) {
            this.charset = charset;
            this.currentGuess = currentGuess;
            for (int i = 0; i < currentGuess.length; i++) {
                currentGuess[i] = charset.charAt(0);
            }
        }

        public boolean hasNext() {
            return hasNext;
        }

        public String next() {
            String result = new String(currentGuess);
            int i = currentGuess.length - 1;
            while (i >= 0) {
                if (currentGuess[i] == charset.charAt(charset.length() - 1)) {
                    currentGuess[i] = charset.charAt(0);
                    i--;
                } else {
                    currentGuess[i] = charset.charAt(charset.indexOf(currentGuess[i]) + 1);
                    return result;
                }
            }
            hasNext = false;
            return result;
        }
    }
}
