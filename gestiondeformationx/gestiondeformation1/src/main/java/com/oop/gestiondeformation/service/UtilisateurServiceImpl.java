package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Utilisateur;
import com.oop.gestiondeformation.repository.UtilisateurRepository;
import com.oop.gestiondeformation.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UtilisateurServiceImpl implements UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Utilisateur> findAll() {
        return utilisateurRepository.findAll();
    }

    @Override
    public Utilisateur findById(Integer id) {
        return utilisateurRepository.findById(id).orElse(null);
    }

    @Override
    public Utilisateur findByLogin(String login) {
        return utilisateurRepository.findByLogin(login);
    }

    @Override
    public Utilisateur save(Utilisateur utilisateur) {
        utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        return utilisateurRepository.save(utilisateur);
    }

    @Override
    public void deleteById(Integer id) {
        utilisateurRepository.deleteById(id);
    }

    @Override
    public boolean existsByLogin(String login) {
        return utilisateurRepository.existsByLogin(login);
    }
    @Override
    public Utilisateur authenticate(String login, String password) {
        Utilisateur utilisateur = utilisateurRepository.findByLogin(login);
        if (utilisateur != null && passwordEncoder.matches(password, utilisateur.getPassword())) {
            return utilisateur;
        }
        return null;
    }
}