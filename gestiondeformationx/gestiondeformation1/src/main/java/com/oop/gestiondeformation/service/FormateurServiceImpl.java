package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Formateur;
import com.oop.gestiondeformation.repository.FormateurRepository;
import com.oop.gestiondeformation.service.FormateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FormateurServiceImpl implements FormateurService {

    @Autowired
    private FormateurRepository formateurRepository;

    @Override
    public List<Formateur> findAll() {
        return formateurRepository.findAll();
    }

    @Override
    public Formateur findById(Integer id) {
        return formateurRepository.findById(id).orElse(null);
    }

    @Override
    public List<Formateur> findByType(String type) {
        return formateurRepository.findByType(type);
    }

    @Override
    public List<Formateur> searchFormateurs(String keyword) {
        return formateurRepository.searchFormateurs(keyword);
    }

    @Override
    public Formateur save(Formateur formateur) {
        return formateurRepository.save(formateur);
    }

    @Override
    public void deleteById(Integer id) {
        formateurRepository.deleteById(id);
    }
}