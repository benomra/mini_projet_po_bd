package com.oop.gestiondeformation.service;



import com.oop.gestiondeformation.model.Formation;
import com.oop.gestiondeformation.model.Participant;
import com.oop.gestiondeformation.model.Profil;
import com.oop.gestiondeformation.model.Structure;
import com.oop.gestiondeformation.dto.FormationDTO;

import java.util.List;




public interface ParticipantService {
    List<Participant> findAll();
    Participant findById(Integer id);
    List<Participant> findByStructure(Structure structure);
    List<Participant> findByProfil(Profil profil);
    List<Participant> searchParticipants(String keyword);
    Participant save(Participant participant);
    void deleteById(Integer id);
}































































/*public interface ParticipantService {
    Participant saveParticipant(Participant participant);
    Participant getParticipantById(Integer id);
    List<Participant> getAllParticipants();
    List<Participant> getParticipantsByStructure(Integer structureId);
    List<Participant> getParticipantsByProfil(Integer profilId);
    List<Participant> searchParticipants(String keyword);
    void deleteParticipant(Integer id);
    Participant updateParticipant(Integer id, Participant participant);
    List<Formation> getFormationsForParticipant(Integer participantId);
    void addParticipantToFormation(Integer participantId, Long formationId);
    void removeParticipantFromFormation(Integer participantId, Long formationId);
}
*/