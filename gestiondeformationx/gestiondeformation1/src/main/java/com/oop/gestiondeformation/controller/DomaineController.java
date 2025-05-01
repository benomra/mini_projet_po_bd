package com.oop.gestiondeformation.controller;
import com.oop.gestiondeformation.model.Domaine;
import com.oop.gestiondeformation.service.DomaineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domaines")
public class DomaineController {

    @Autowired
    private DomaineService domaineService;

    @GetMapping
    public ResponseEntity<Iterable<Domaine>> getAllDomaines() {
        Iterable<Domaine> domaines = domaineService.findAll();
        return new ResponseEntity<>(domaines, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Domaine> getDomaineById(@PathVariable Integer id) {
        Domaine domaine = domaineService.findById(id);
        if (domaine != null) {
            return new ResponseEntity<>(domaine, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Domaine> createDomaine(@RequestBody Domaine domaine) {
        Domaine savedDomaine = domaineService.save(domaine);
        return new ResponseEntity<>(savedDomaine, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Domaine> updateDomaine(@PathVariable Integer id, @RequestBody Domaine domaine) {
        Domaine existingDomaine = domaineService.findById(id);
        if (existingDomaine != null) {
            domaine.setId(id);
            Domaine updatedDomaine = domaineService.save(domaine);
            return new ResponseEntity<>(updatedDomaine, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDomaine(@PathVariable Integer id) {
        Domaine existingDomaine = domaineService.findById(id);
        if (existingDomaine != null) {
            domaineService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}