package com.oop.gestiondeformation.controller;

import com.oop.gestiondeformation.model.Participant;
import com.oop.gestiondeformation.model.Profil;
import com.oop.gestiondeformation.model.Structure;
import com.oop.gestiondeformation.service.ParticipantService;
import com.oop.gestiondeformation.service.ProfilService;
import com.oop.gestiondeformation.service.StructureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    @Autowired
    private ParticipantService participantService;

    @Autowired
    private StructureService structureService;

    @Autowired
    private ProfilService profilService;

    @GetMapping
    public ResponseEntity<List<Participant>> getAllParticipants() {
        List<Participant> participants = participantService.findAll();
        return new ResponseEntity<>(participants, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Participant> getParticipantById(@PathVariable Integer id) {
        Participant participant = participantService.findById(id);
        if (participant != null) {
            return new ResponseEntity<>(participant, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/structure/{structureId}")
    public ResponseEntity<List<Participant>> getParticipantsByStructure(@PathVariable Integer structureId) {
        Structure structure = structureService.findById(structureId);
        if (structure != null) {
            List<Participant> participants = participantService.findByStructure(structure);
            return new ResponseEntity<>(participants, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/profil/{profilId}")
    public ResponseEntity<List<Participant>> getParticipantsByProfil(@PathVariable Integer profilId) {
        Profil profil = profilService.findById(profilId);
        if (profil != null) {
            List<Participant> participants = participantService.findByProfil(profil);
            return new ResponseEntity<>(participants, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Participant>> searchParticipants(@RequestParam String keyword) {
        List<Participant> participants = participantService.searchParticipants(keyword);
        return new ResponseEntity<>(participants, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Participant> createParticipant(@RequestBody Participant participant) {
        Participant savedParticipant = participantService.save(participant);
        return new ResponseEntity<>(savedParticipant, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Participant> updateParticipant(@PathVariable Integer id, @RequestBody Participant participant) {
        Participant existingParticipant = participantService.findById(id);
        if (existingParticipant != null) {
            participant.setId(id);
            Participant updatedParticipant = participantService.save(participant);
            return new ResponseEntity<>(updatedParticipant, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable Integer id) {
        Participant existingParticipant = participantService.findById(id);
        if (existingParticipant != null) {
            participantService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
