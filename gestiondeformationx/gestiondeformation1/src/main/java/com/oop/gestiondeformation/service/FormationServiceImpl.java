package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Formateur;
import com.oop.gestiondeformation.model.Formation;
import com.oop.gestiondeformation.model.Domaine;
import com.oop.gestiondeformation.model.Participant;
import com.oop.gestiondeformation.repository.FormationRepository;
import com.oop.gestiondeformation.repository.FormationParticipantRepository;
import com.oop.gestiondeformation.dto.ParticipantDTO;
import com.oop.gestiondeformation.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


import java.util.Set;

@Service
public class FormationServiceImpl implements FormationService {

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Override
    public List<Formation> findAll() {
        return formationRepository.findAll();
    }

    @Override
    public Formation findById(Long id) {
        return formationRepository.findById(id).orElse(null);
    }

    @Override
    public List<Formation> findByAnnee(Integer annee) {
        return formationRepository.findByAnnee(annee);
    }

    @Override
    public List<Formation> findByDomaine(Domaine domaine) {
        return formationRepository.findByDomaine(domaine);
    }

    @Override
    public List<Formation> findByFormateur(Formateur formateur) {
        return formationRepository.findByFormateur(formateur);
    }

    @Override
    public List<Formation> searchFormations(String keyword) {
        return formationRepository.searchFormations(keyword);
    }

    @Override
    public List<Formation> findFormationsByParticipantId(Integer participantId) {
        return formationRepository.findFormationsByParticipantId(participantId);
    }

    @Override
    public Formation save(Formation formation) {
        return formationRepository.save(formation);
    }

    @Override
    public void deleteById(Long id) {
        formationRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void addParticipant(Long formationId, Integer participantId) {
        Formation formation = formationRepository.findById(formationId).orElse(null);
        Participant participant = participantRepository.findById(participantId).orElse(null);

        if (formation != null && participant != null) {
            Set<Participant> participants = formation.getParticipants();
            participants.add(participant);
            formation.setParticipants(participants);
            formationRepository.save(formation);
        }
    }

    @Override
    @Transactional
    public void removeParticipant(Long formationId, Integer participantId) {
        Formation formation = formationRepository.findById(formationId).orElse(null);
        Participant participant = participantRepository.findById(participantId).orElse(null);

        if (formation != null && participant != null) {
            Set<Participant> participants = formation.getParticipants();
            participants.remove(participant);
            formation.setParticipants(participants);
            formationRepository.save(formation);
        }
    }

    @Override
    public Long countFormationsByYear(Integer annee) {
        return formationRepository.countFormationsByYear(annee);
    }

    @Override
    public List<Object[]> countFormationsByDomain() {
        return formationRepository.countFormationsByDomain();
    }
}




