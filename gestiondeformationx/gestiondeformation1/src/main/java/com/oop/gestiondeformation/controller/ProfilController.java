package com.oop.gestiondeformation.controller;

import com.oop.gestiondeformation.model.Profil;
import com.oop.gestiondeformation.service.ProfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profils")
public class ProfilController {

    @Autowired
    private ProfilService profilService;

    @GetMapping
    public ResponseEntity<Iterable<Profil>> getAllProfils() {
        Iterable<Profil> profils = profilService.findAll();
        return new ResponseEntity<>(profils, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profil> getProfilById(@PathVariable Integer id) {
        Profil profil = profilService.findById(id);
        if (profil != null) {
            return new ResponseEntity<>(profil, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Profil> createProfil(@RequestBody Profil profil) {
        Profil savedProfil = profilService.save(profil);
        return new ResponseEntity<>(savedProfil, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profil> updateProfil(@PathVariable Integer id, @RequestBody Profil profil) {
        Profil existingProfil = profilService.findById(id);
        if (existingProfil != null) {
            profil.setId(id);
            Profil updatedProfil = profilService.save(profil);
            return new ResponseEntity<>(updatedProfil, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfil(@PathVariable Integer id) {
        Profil existingProfil = profilService.findById(id);
        if (existingProfil != null) {
            profilService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}