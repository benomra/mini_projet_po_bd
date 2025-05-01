package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Domaine;
import com.oop.gestiondeformation.repository.DomaineRepository;
import com.oop.gestiondeformation.service.DomaineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DomaineServiceImpl implements DomaineService {

    @Autowired
    private DomaineRepository domaineRepository;

    @Override
    public List<Domaine> findAll() {
        return domaineRepository.findAll();
    }

    @Override
    public Domaine findById(Integer id) {
        return domaineRepository.findById(id).orElse(null);
    }

    @Override
    public Domaine findByLibelle(String libelle) {
        return domaineRepository.findByLibelle(libelle);
    }

    @Override
    public Domaine save(Domaine domaine) {
        return domaineRepository.save(domaine);
    }

    @Override
    public void deleteById(Integer id) {
        domaineRepository.deleteById(id);
    }
}