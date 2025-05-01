package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Profil;
import com.oop.gestiondeformation.repository.ProfilRepository;
import com.oop.gestiondeformation.service.ProfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProfilServiceImpl implements ProfilService {

    @Autowired
    private ProfilRepository profilRepository;

    @Override
    public List<Profil> findAll() {
        return profilRepository.findAll();
    }

    @Override
    public Profil findById(Integer id) {
        return profilRepository.findById(id).orElse(null);
    }

    @Override
    public Profil findByLibelle(String libelle) {
        return profilRepository.findByLibelle(libelle);
    }

    @Override
    public Profil save(Profil profil) {
        return profilRepository.save(profil);
    }

    @Override
    public void deleteById(Integer id) {
        profilRepository.deleteById(id);
    }
}