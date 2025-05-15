package com.smoke.emailsenderultimate.controller;

import com.smoke.emailsenderultimate.model.User;
import com.smoke.emailsenderultimate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Endpoint per la registrazione.
     * Riceve i dati dell'utente in formato JSON tramite il corpo della richiesta.
     * Restituisce una ResponseEntity con una mappa contenente lo status e un messaggio.
     *
     * Esempio di URL: http://localhost:8080/api/users/register
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User userData) {
        Map<String, Object> response = new HashMap<>();

        // Validazione basilare dei campi
        if (!StringUtils.hasText(userData.getUsername()) ||
                !StringUtils.hasText(userData.getEmail()) ||
                !StringUtils.hasText(userData.getPassword())) {
            response.put("status", "error");
            response.put("message", "Tutti i campi sono obbligatori.");
            return ResponseEntity.badRequest().body(response);
        }

        // Controlla se esiste già un utente con la stessa email o username
        Optional<User> existingByEmail = userRepository.findByEmail(userData.getEmail());
        Optional<User> existingByUsername = userRepository.findByUsername(userData.getUsername());
        if (existingByEmail.isPresent() || existingByUsername.isPresent()) {
            response.put("status", "error");
            response.put("message", "Utente già esistente. Effettua il login.");
            return ResponseEntity.badRequest().body(response);
        }

        // Salvataggio dell'utente nel database
        User savedUser = userRepository.save(userData);

        response.put("status", "success");
        response.put("message", "Registrazione completata con successo.");
        // Puoi restituire dati utili se vuoi precompilare il form di login
        response.put("email", savedUser.getEmail());
        response.put("password", savedUser.getPassword());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint per il login.
     * Riceve l'email e la password in formato JSON nel body della richiesta.
     * Restituisce una ResponseEntity con una mappa che indica il risultato dell'autenticazione.
     *
     * Esempio di URL: http://localhost:8080/api/users/login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> loginData) {
        Map<String, Object> response = new HashMap<>();
        String email = loginData.get("email");
        String password = loginData.get("password");

        if (!StringUtils.hasText(email) || !StringUtils.hasText(password)) {
            response.put("status", "error");
            response.put("message", "Email e password sono obbligatorie.");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            response.put("status", "error");
            response.put("message", "Utente non trovato. Registrati prima.");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userOptional.get();
        // Confronto semplice (in produzione utilizzare un encoder come BCrypt)
        if (!user.getPassword().equals(password)) {
            response.put("status", "error");
            response.put("message", "Credenziali non valide. Riprova.");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("status", "success");
        response.put("message", "Login avvenuto con successo.");
        return ResponseEntity.ok(response);
    }
}
