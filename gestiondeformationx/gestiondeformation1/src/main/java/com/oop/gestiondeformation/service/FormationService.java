package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Domaine;
import com.oop.gestiondeformation.model.Formation;
import com.oop.gestiondeformation.model.Formateur;
import com.oop.gestiondeformation.dto.ParticipantDTO;
import com.oop.gestiondeformation.model.Participant;
import java.util.List;
import java.util.Map;

public interface FormationService {
    List<Formation> findAll();
    Formation findById(Long id);
    List<Formation> findByAnnee(Integer annee);
    List<Formation> findByDomaine(Domaine domaine);
    List<Formation> findByFormateur(Formateur formateur);
    List<Formation> searchFormations(String keyword);
    List<Formation> findFormationsByParticipantId(Integer participantId);
    Formation save(Formation formation);
    void deleteById(Long id);
    void addParticipant(Long formationId, Integer participantId);
    void removeParticipant(Long formationId, Integer participantId);
    Long countFormationsByYear(Integer annee);
    List<Object[]> countFormationsByDomain();
}
