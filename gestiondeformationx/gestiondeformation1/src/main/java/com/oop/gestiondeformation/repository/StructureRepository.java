package com.oop.gestiondeformation.repository;

import com.oop.gestiondeformation.model.Structure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StructureRepository extends JpaRepository<Structure, Integer> {
    Structure findByLibelle(String libelle);
}