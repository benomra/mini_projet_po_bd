package com.oop.gestiondeformation.controller;


import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.oop.gestiondeformation.model.Utilisateur;
import com.oop.gestiondeformation.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "http://localhost:3000") // Ajoutez ceci pour permettre les requêtes depuis votre frontend React

public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity< Iterable<Utilisateur>> getAllUtilisateurs() {
        Iterable<Utilisateur> utilisateurs = utilisateurService.findAll();
        return new ResponseEntity<>(utilisateurs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Integer id) {
        Utilisateur utilisateur = utilisateurService.findById(id);
        if (utilisateur != null) {
            return new ResponseEntity<>(utilisateur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/by-login/{login}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Utilisateur> getUtilisateurByLogin(@PathVariable String login) {
        Utilisateur utilisateur = utilisateurService.findByLogin(login);
        if (utilisateur != null) {
            return new ResponseEntity<>(utilisateur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Utilisateur> createUtilisateur(@RequestBody Utilisateur utilisateur) {
        // Vérifier si le login existe déjà
        if (utilisateurService.existsByLogin(utilisateur.getLogin())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        Utilisateur savedUtilisateur = utilisateurService.save(utilisateur);
        return new ResponseEntity<>(savedUtilisateur, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(@PathVariable Integer id, @RequestBody Utilisateur utilisateur) {
        Utilisateur existingUtilisateur = utilisateurService.findById(id);
        if (existingUtilisateur != null) {
            // Vérifier si le login existe déjà et n'appartient pas à cet utilisateur
            if (!existingUtilisateur.getLogin().equals(utilisateur.getLogin())
                    && utilisateurService.existsByLogin(utilisateur.getLogin())) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
            utilisateur.setId(id);
            Utilisateur updatedUtilisateur = utilisateurService.save(utilisateur);
            return new ResponseEntity<>(updatedUtilisateur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Integer id) {
        Utilisateur existingUtilisateur = utilisateurService.findById(id);
        if (existingUtilisateur != null) {
            utilisateurService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
