package com.oop.gestiondeformation.repository;

import com.oop.gestiondeformation.model.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DomaineRepository extends JpaRepository<Domaine, Integer> {
    Domaine findByLibelle(String libelle);
}
