package com.oop.gestiondeformation.controller;

import com.oop.gestiondeformation.config.JwtConfig;
import com.oop.gestiondeformation.dto.AuthenticationRequest;
import com.oop.gestiondeformation.dto.AuthenticationResponse;
import com.oop.gestiondeformation.model.Utilisateur;
import com.oop.gestiondeformation.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private JwtConfig jwtConfig;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        Utilisateur utilisateur = utilisateurService.authenticate(request.getLogin(), request.getPassword());

        if (utilisateur != null) {
            // Générer un token JWT
            String token = jwtConfig.generateToken(
                    utilisateur.getLogin(),
                    utilisateur.getId(),
                    utilisateur.getRole().getNom()
            );

            // Créer la réponse
            AuthenticationResponse response = AuthenticationResponse.fromUtilisateur(utilisateur);
            response.setToken(token);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.ok(AuthenticationResponse.failed());
        }
    }
}