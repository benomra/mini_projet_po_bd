package com.oop.gestiondeformation.repository;

import com.oop.gestiondeformation.model.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FormateurRepository extends JpaRepository<Formateur, Integer> {
    List<Formateur> findByType(String type);

    @Query("SELECT f FROM Formateur f WHERE f.nom LIKE %:keyword% OR f.prenom LIKE %:keyword% OR f.email LIKE %:keyword%")
    List<Formateur> searchFormateurs(String keyword);
}