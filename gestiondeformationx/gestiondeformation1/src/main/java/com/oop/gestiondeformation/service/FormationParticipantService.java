package com.oop.gestiondeformation.service;



import com.oop.gestiondeformation.model.FormationParticipant;
import com.oop.gestiondeformation.model.FormationParticipant.FormationParticipantId;
import com.oop.gestiondeformation.dto.FormationParticipantDTO;

import java.util.List;

public interface FormationParticipantService {
    FormationParticipant save(FormationParticipant formationParticipant);
    void deleteById(FormationParticipantId id);
    List<FormationParticipantDTO> findByFormationId(Long formationId);
    List<FormationParticipantDTO> findByParticipantId(Integer participantId);
    FormationParticipant addParticipantToFormation(Long formationId, Integer participantId, Boolean present);
    Boolean updatePresence(Long formationId, Integer participantId, Boolean present);
}