package com.oop.gestiondeformation.repository;



import com.oop.gestiondeformation.model.FormationParticipant;
import com.oop.gestiondeformation.model.FormationParticipant.FormationParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormationParticipantRepository extends JpaRepository<FormationParticipant, FormationParticipantId> {

    @Query("SELECT fp FROM FormationParticipant fp WHERE fp.id.formationId = :formationId")
    List<FormationParticipant> findByFormationId(Long formationId);

    @Query("SELECT fp FROM FormationParticipant fp WHERE fp.id.participantId = :participantId")
    List<FormationParticipant> findByParticipantId(Integer participantId);

    @Query("SELECT COUNT(fp) > 0 FROM FormationParticipant fp WHERE fp.id.formationId = :formationId AND fp.id.participantId = :participantId")
    boolean existsByFormationIdAndParticipantId(Long formationId, Integer participantId);
}