package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Employeur;
import java.util.List;

public interface EmployeurService {
    Iterable<Employeur> findAll();
    Employeur findById(Integer id);
    Employeur findByNomEmployeur(String nomEmployeur);
    Employeur save(Employeur employeur);
    void deleteById(Integer id);
}