package com.oop.gestiondeformation.controller;

import com.oop.gestiondeformation.model.Formateur;
import com.oop.gestiondeformation.service.FormateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formateurs")
public class FormateurController {

    @Autowired
    private FormateurService formateurService;

    @GetMapping
    public ResponseEntity<Iterable<Formateur>> getAllFormateurs() {
        Iterable<Formateur> formateurs = formateurService.findAll();
        return new ResponseEntity<>(formateurs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formateur> getFormateurById(@PathVariable Integer id) {
        Formateur formateur = formateurService.findById(id);
        if (formateur != null) {
            return new ResponseEntity<>(formateur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Iterable<Formateur>> getFormateursByType(@PathVariable String type) {
        Iterable<Formateur> formateurs = formateurService.findByType(type);
        return new ResponseEntity<>(formateurs, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity< Iterable<Formateur>> searchFormateurs(@RequestParam String keyword) {
        Iterable<Formateur> formateurs = formateurService.searchFormateurs(keyword);
        return new ResponseEntity<>(formateurs, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Formateur> createFormateur(@RequestBody Formateur formateur) {
        Formateur savedFormateur = formateurService.save(formateur);
        return new ResponseEntity<>(savedFormateur, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Formateur> updateFormateur(@PathVariable Integer id, @RequestBody Formateur formateur) {
        Formateur existingFormateur = formateurService.findById(id);
        if (existingFormateur != null) {
            formateur.setId(id);
            Formateur updatedFormateur = formateurService.save(formateur);
            return new ResponseEntity<>(updatedFormateur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormateur(@PathVariable Integer id) {
        Formateur existingFormateur = formateurService.findById(id);
        if (existingFormateur != null) {
            formateurService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}