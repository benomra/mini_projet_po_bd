package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Structure;
import java.util.List;

public interface StructureService {
    Iterable<Structure> findAll();
    Structure findById(Integer id);
    Structure findByLibelle(String libelle);
    Structure save(Structure structure);
    void deleteById(Integer id);
}
