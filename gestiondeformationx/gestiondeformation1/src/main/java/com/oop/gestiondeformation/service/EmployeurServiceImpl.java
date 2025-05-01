package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Employeur;
import com.oop.gestiondeformation.repository.EmployeurRepository;
import com.oop.gestiondeformation.service.EmployeurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeurServiceImpl implements EmployeurService {

    @Autowired
    private EmployeurRepository employeurRepository;

    @Override
    public List<Employeur> findAll() {
        return employeurRepository.findAll();
    }

    @Override
    public Employeur findById(Integer id) {
        return employeurRepository.findById(id).orElse(null);
    }

    @Override
    public Employeur findByNomEmployeur(String nomEmployeur) {
        return employeurRepository.findByNomEmployeur(nomEmployeur);
    }

    @Override
    public Employeur save(Employeur employeur) {
        return employeurRepository.save(employeur);
    }

    @Override
    public void deleteById(Integer id) {
        employeurRepository.deleteById(id);
    }
}