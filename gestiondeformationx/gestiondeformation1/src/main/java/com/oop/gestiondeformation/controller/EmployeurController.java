package com.oop.gestiondeformation.controller;

import com.oop.gestiondeformation.model.Employeur;
import com.oop.gestiondeformation.service.EmployeurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employeurs")
public class EmployeurController {

    @Autowired
    private EmployeurService employeurService;

    @GetMapping
    public ResponseEntity<Iterable<Employeur>> getAllEmployeurs() {
        Iterable<Employeur> employeurs = employeurService.findAll();
        return new ResponseEntity<>(employeurs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employeur> getEmployeurById(@PathVariable Integer id) {
        Employeur employeur = employeurService.findById(id);
        if (employeur != null) {
            return new ResponseEntity<>(employeur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Employeur> createEmployeur(@RequestBody Employeur employeur) {
        Employeur savedEmployeur = employeurService.save(employeur);
        return new ResponseEntity<>(savedEmployeur, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employeur> updateEmployeur(@PathVariable Integer id, @RequestBody Employeur employeur) {
        Employeur existingEmployeur = employeurService.findById(id);
        if (existingEmployeur != null) {
            employeur.setId(id);
            Employeur updatedEmployeur = employeurService.save(employeur);
            return new ResponseEntity<>(updatedEmployeur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployeur(@PathVariable Integer id) {
        Employeur existingEmployeur = employeurService.findById(id);
        if (existingEmployeur != null) {
            employeurService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
