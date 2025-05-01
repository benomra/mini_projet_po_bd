package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Structure;
import com.oop.gestiondeformation.repository.StructureRepository;
import com.oop.gestiondeformation.service.StructureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StructureServiceImpl implements StructureService {

    @Autowired
    private StructureRepository structureRepository;

    @Override
    public List<Structure> findAll() {
        return structureRepository.findAll();
    }

    @Override
    public Structure findById(Integer id) {
        return structureRepository.findById(id).orElse(null);
    }

    @Override
    public Structure findByLibelle(String libelle) {
        return structureRepository.findByLibelle(libelle);
    }

    @Override
    public Structure save(Structure structure) {
        return structureRepository.save(structure);
    }

    @Override
    public void deleteById(Integer id) {
        structureRepository.deleteById(id);
    }
}
