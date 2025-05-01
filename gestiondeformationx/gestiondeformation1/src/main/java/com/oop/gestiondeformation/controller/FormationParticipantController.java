package com.oop.gestiondeformation.controller;

import com.oop.gestiondeformation.model.FormationParticipant;
import com.oop.gestiondeformation.model.FormationParticipant.FormationParticipantId;
import com.oop.gestiondeformation.service.FormationParticipantService;
import com.oop.gestiondeformation.dto.FormationParticipantDTO;
import com.oop.gestiondeformation.dto.ParticipantFormationRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formation-participants")
@CrossOrigin(origins = "*")
public class FormationParticipantController {

    @Autowired
    private FormationParticipantService service;

    @PostMapping
    public ResponseEntity<FormationParticipant> create(@RequestBody FormationParticipant formationParticipant) {
        return ResponseEntity.ok(service.save(formationParticipant));
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignParticipantToFormation(@RequestBody ParticipantFormationRequestDTO request) {
        FormationParticipant result = service.addParticipantToFormation(
                request.getFormationId(),
                request.getParticipantId(),
                request.getPresent()
        );

        if (result != null) {
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            return ResponseEntity.badRequest().body("Le participant est déjà inscrit à cette formation ou données invalides");
        }
    }

    @PutMapping("/presence")
    public ResponseEntity<?> updatePresence(@RequestBody ParticipantFormationRequestDTO request) {
        Boolean result = service.updatePresence(
                request.getFormationId(),
                request.getParticipantId(),
                request.getPresent()
        );

        if (result) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<List<FormationParticipantDTO>> getByFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(service.findByFormationId(formationId));
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<FormationParticipantDTO>> getByParticipant(@PathVariable Integer participantId) {
        return ResponseEntity.ok(service.findByParticipantId(participantId));
    }

    @DeleteMapping("/{formationId}/{participantId}")
    public ResponseEntity<?> delete(@PathVariable Long formationId, @PathVariable Integer participantId) {
        FormationParticipantId id = new FormationParticipantId(formationId, participantId);
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
