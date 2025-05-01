package com.oop.gestiondeformation.repository;

import com.oop.gestiondeformation.model.Domaine;
import com.oop.gestiondeformation.model.Formation;
import com.oop.gestiondeformation.model.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByAnnee(Integer annee);
    List<Formation> findByDomaine(Domaine domaine);
    List<Formation> findByFormateur(Formateur formateur);

    @Query("SELECT f FROM Formation f WHERE f.titre LIKE %:keyword%")
    List<Formation> searchFormations(String keyword);

    @Query("SELECT COUNT(f) FROM Formation f WHERE f.annee = :annee")
    Long countFormationsByYear(Integer annee);

    @Query("SELECT f.domaine.libelle, COUNT(f) FROM Formation f GROUP BY f.domaine.libelle")
    List<Object[]> countFormationsByDomain();

    @Query("SELECT f FROM Formation f JOIN f.participants p WHERE p.id = :participantId")
    List<Formation> findFormationsByParticipantId(Integer participantId);
    Long countByAnnee(Integer annee);

    List<Formation> findByAnneeBetween(Integer startYear, Integer endYear);
}