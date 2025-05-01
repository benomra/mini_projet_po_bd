package com.oop.gestiondeformation.repository;
import com.oop.gestiondeformation.model.Employeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeurRepository extends JpaRepository<Employeur, Integer> {
    Employeur findByNomEmployeur(String nomEmployeur);
}
