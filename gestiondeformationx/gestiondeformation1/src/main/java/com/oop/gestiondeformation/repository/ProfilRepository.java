package com.oop.gestiondeformation.repository;

import com.oop.gestiondeformation.model.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfilRepository extends JpaRepository<Profil, Integer> {
    Profil findByLibelle(String libelle);
}
