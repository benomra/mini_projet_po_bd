package com.oop.gestiondeformation.controller;

import com.oop.gestiondeformation.model.Structure;
import com.oop.gestiondeformation.service.StructureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/structures")
public class StructureController {

    @Autowired
    private StructureService structureService;

    @GetMapping
    public ResponseEntity<Iterable<Structure>> getAllStructures() {
        Iterable<Structure> structures = structureService.findAll();
        return new ResponseEntity<>(structures, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Structure> getStructureById(@PathVariable Integer id) {
        Structure structure = structureService.findById(id);
        if (structure != null) {
            return new ResponseEntity<>(structure, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Structure> createStructure(@RequestBody Structure structure) {
        Structure savedStructure = structureService.save(structure);
        return new ResponseEntity<>(savedStructure, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Structure> updateStructure(@PathVariable Integer id, @RequestBody Structure structure) {
        Structure existingStructure = structureService.findById(id);
        if (existingStructure != null) {
            structure.setId(id);
            Structure updatedStructure = structureService.save(structure);
            return new ResponseEntity<>(updatedStructure, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStructure(@PathVariable Integer id) {
        Structure existingStructure = structureService.findById(id);
        if (existingStructure != null) {
            structureService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}