package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Formateur;
import java.util.List;

public interface FormateurService {
    Iterable<Formateur> findAll();
    Formateur findById(Integer id);
    Iterable<Formateur> findByType(String type);
    Iterable<Formateur> searchFormateurs(String keyword);
    Formateur save(Formateur formateur);
    void deleteById(Integer id);
}