package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Utilisateur;

import java.util.List;



public interface UtilisateurService {
    Iterable<Utilisateur> findAll();
    Utilisateur findById(Integer id);
    Utilisateur findByLogin(String login);
    Utilisateur save(Utilisateur utilisateur);
    void deleteById(Integer id);
    boolean existsByLogin(String login);
    Utilisateur authenticate(String login, String password);
}

