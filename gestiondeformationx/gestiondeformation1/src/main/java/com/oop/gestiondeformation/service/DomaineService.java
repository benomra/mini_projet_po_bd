package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Domaine;
import java.util.List;

public interface DomaineService {
    Iterable<Domaine> findAll();
    Domaine findById(Integer id);
    Domaine findByLibelle(String libelle);
    Domaine save(Domaine domaine);
    void deleteById(Integer id);
}