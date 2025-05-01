package com.oop.gestiondeformation.repository;

import com.oop.gestiondeformation.model.Participant;
import com.oop.gestiondeformation.model.Profil;
import com.oop.gestiondeformation.model.Structure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Integer> {
    List<Participant> findByStructure(Structure structure);
    List<Participant> findByProfil(Profil profil);

    @Query("SELECT p FROM Participant p WHERE p.nom LIKE %:keyword% OR p.prenom LIKE %:keyword% OR p.email LIKE %:keyword%")
    List<Participant> searchParticipants(String keyword);
}
