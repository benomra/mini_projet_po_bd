package com.oop.gestiondeformation.service;



import com.oop.gestiondeformation.model.Formation;
import com.oop.gestiondeformation.model.FormationParticipant;
import com.oop.gestiondeformation.model.FormationParticipant.FormationParticipantId;
import com.oop.gestiondeformation.model.Participant;
import com.oop.gestiondeformation.repository.FormationParticipantRepository;
import com.oop.gestiondeformation.repository.FormationRepository;
import com.oop.gestiondeformation.repository.ParticipantRepository;
import com.oop.gestiondeformation.dto.FormationParticipantDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FormationParticipantServiceImpl implements FormationParticipantService {

    @Autowired
    private FormationParticipantRepository repository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private FormationRepository formationRepository;

    @Override
    public FormationParticipant save(FormationParticipant formationParticipant) {
        return repository.save(formationParticipant);
    }

    @Override
    public void deleteById(FormationParticipantId id) {
        repository.deleteById(id);
    }

    @Override
    public List<FormationParticipantDTO> findByFormationId(Long formationId) {
        return repository.findByFormationId(formationId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FormationParticipantDTO> findByParticipantId(Integer participantId) {
        return repository.findByParticipantId(participantId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FormationParticipant addParticipantToFormation(Long formationId, Integer participantId, Boolean present) {
        Formation formation = formationRepository.findById(formationId).orElse(null);
        Participant participant = participantRepository.findById(participantId).orElse(null);

        if (formation != null && participant != null) {
            FormationParticipantId id = new FormationParticipantId(formationId, participantId);

            if (repository.existsById(id)) {
                return null; // Déjà inscrit
            }

            FormationParticipant fp = new FormationParticipant();
            fp.setId(id);
            fp.setFormation(formation);
            fp.setParticipant(participant);
            fp.setPresent(present != null ? present : false);

            return repository.save(fp);
        }
        return null;
    }

    @Override
    @Transactional
    public Boolean updatePresence(Long formationId, Integer participantId, Boolean present) {
        FormationParticipantId id = new FormationParticipantId(formationId, participantId);
        Optional<FormationParticipant> optionalFp = repository.findById(id);

        if (optionalFp.isPresent()) {
            FormationParticipant fp = optionalFp.get();
            fp.setPresent(present);
            repository.save(fp);
            return true;
        }
        return false;
    }

    private FormationParticipantDTO convertToDTO(FormationParticipant formationParticipant) {
        FormationParticipantDTO dto = new FormationParticipantDTO();
        dto.setFormationId(formationParticipant.getId().getFormationId());
        dto.setParticipantId(formationParticipant.getId().getParticipantId());
        dto.setPresent(formationParticipant.getPresent());

        // Ajouter des informations supplémentaires si nécessaire
        dto.setTitreFormation(formationParticipant.getFormation().getTitre());
        dto.setNomParticipant(formationParticipant.getParticipant().getNom() + " " +
                formationParticipant.getParticipant().getPrenom());

        return dto;
    }
}