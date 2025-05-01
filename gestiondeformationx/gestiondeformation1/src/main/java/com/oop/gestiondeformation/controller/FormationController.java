package com.oop.gestiondeformation.controller;

import com.oop.gestiondeformation.model.Domaine;
import com.oop.gestiondeformation.model.Formation;
import com.oop.gestiondeformation.model.Formateur;
import com.oop.gestiondeformation.service.DomaineService;
import com.oop.gestiondeformation.service.FormationService;
import com.oop.gestiondeformation.service.FormateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/formations")
public class FormationController {

    @Autowired
    private FormationService formationService;

    @Autowired
    private DomaineService domaineService;

    @Autowired
    private FormateurService formateurService;

    @GetMapping
    public ResponseEntity<List<Formation>> getAllFormations() {
        List<Formation> formations = formationService.findAll();
        return new ResponseEntity<>(formations, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        Formation formation = formationService.findById(id);
        if (formation != null) {
            return new ResponseEntity<>(formation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/annee/{annee}")
    public ResponseEntity<List<Formation>> getFormationsByAnnee(@PathVariable Integer annee) {
        List<Formation> formations = formationService.findByAnnee(annee);
        return new ResponseEntity<>(formations, HttpStatus.OK);
    }

    @GetMapping("/domaine/{domaineId}")
    public ResponseEntity<List<Formation>> getFormationsByDomaine(@PathVariable Integer domaineId) {
        Domaine domaine = domaineService.findById(domaineId);
        if (domaine != null) {
            List<Formation> formations = formationService.findByDomaine(domaine);
            return new ResponseEntity<>(formations, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/formateur/{formateurId}")
    public ResponseEntity<List<Formation>> getFormationsByFormateur(@PathVariable Integer formateurId) {
        Formateur formateur = formateurService.findById(formateurId);
        if (formateur != null) {
            List<Formation> formations = formationService.findByFormateur(formateur);
            return new ResponseEntity<>(formations, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<Formation>> getFormationsByParticipant(@PathVariable Integer participantId) {
        List<Formation> formations = formationService.findFormationsByParticipantId(participantId);
        return new ResponseEntity<>(formations, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Formation>> searchFormations(@RequestParam String keyword) {
        List<Formation> formations = formationService.searchFormations(keyword);
        return new ResponseEntity<>(formations, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Formation> createFormation(@RequestBody Formation formation) {
        Formation savedFormation = formationService.save(formation);
        return new ResponseEntity<>(savedFormation, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Formation> updateFormation(@PathVariable Long id, @RequestBody Formation formation) {
        Formation existingFormation = formationService.findById(id);
        if (existingFormation != null) {
            formation.setId(id);
            Formation updatedFormation = formationService.save(formation);
            return new ResponseEntity<>(updatedFormation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) {
        Formation existingFormation = formationService.findById(id);
        if (existingFormation != null) {
            formationService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{formationId}/participants/{participantId}")
    public ResponseEntity<Void> addParticipantToFormation(@PathVariable Long formationId, @PathVariable Integer participantId) {
        formationService.addParticipant(formationId, participantId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{formationId}/participants/{participantId}")
    public ResponseEntity<Void> removeParticipantFromFormation(@PathVariable Long formationId, @PathVariable Integer participantId) {
        formationService.removeParticipant(formationId, participantId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/stats/count-by-year")
    public ResponseEntity<Map<String, Long>> getFormationsCountByYear(@RequestParam Integer annee) {
        Long count = formationService.countFormationsByYear(annee);
        Map<String, Long> response = new HashMap<>();
        response.put("annee", (long) annee);
        response.put("count", count);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/stats/count-by-domain")
    public ResponseEntity<List<Object[]>> getFormationsCountByDomain() {
        List<Object[]> stats = formationService.countFormationsByDomain();
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}