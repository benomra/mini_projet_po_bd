package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Participant;
import com.oop.gestiondeformation.model.Profil;
import com.oop.gestiondeformation.model.Structure;
import com.oop.gestiondeformation.repository.ParticipantRepository;
import com.oop.gestiondeformation.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ParticipantServiceImpl implements ParticipantService {

    @Autowired
    private ParticipantRepository participantRepository;

    @Override
    public List<Participant> findAll() {
        return participantRepository.findAll();
    }

    @Override
    public Participant findById(Integer id) {
        return participantRepository.findById(id).orElse(null);
    }

    @Override
    public List<Participant> findByStructure(Structure structure) {
        return participantRepository.findByStructure(structure);
    }

    @Override
    public List<Participant> findByProfil(Profil profil) {
        return participantRepository.findByProfil(profil);
    }

    @Override
    public List<Participant> searchParticipants(String keyword) {
        return participantRepository.searchParticipants(keyword);
    }

    @Override
    public Participant save(Participant participant) {
        return participantRepository.save(participant);
    }

    @Override
    public void deleteById(Integer id) {
        participantRepository.deleteById(id);
    }
}