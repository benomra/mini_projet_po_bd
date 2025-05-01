package com.oop.gestiondeformation.repository;

import com.oop.gestiondeformation.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    Utilisateur findByLogin(String login);
    boolean existsByLogin(String login);
}