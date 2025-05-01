package com.oop.gestiondeformation.dto;

import com.oop.gestiondeformation.model.Utilisateur;
import lombok.Data;

@Data
public class AuthenticationResponse {
    private Integer id;
    private String login;
    private String role;
    private String token;
    private String message;
    private boolean success;

    public static AuthenticationResponse fromUtilisateur(Utilisateur utilisateur) {
        AuthenticationResponse response = new AuthenticationResponse();
        response.setId(utilisateur.getId());
        response.setLogin(utilisateur.getLogin());
        response.setRole(utilisateur.getRole().getNom());
        response.setSuccess(true);
        response.setMessage("Authentification réussie");
        return response;
    }

    public static AuthenticationResponse failed() {
        AuthenticationResponse response = new AuthenticationResponse();
        response.setSuccess(false);
        response.setMessage("Login ou mot de passe incorrect");
        return response;
    }
}