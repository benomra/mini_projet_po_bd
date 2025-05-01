package com.oop.gestiondeformation.service;


import com.oop.gestiondeformation.model.Profil;
import java.util.List;

public interface ProfilService {
    Iterable<Profil> findAll();
    Profil findById(Integer id);
    Profil findByLibelle(String libelle);
    Profil save(Profil profil);
    void deleteById(Integer id);
}
