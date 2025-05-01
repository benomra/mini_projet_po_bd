package com.oop.gestiondeformation.service;



import com.oop.gestiondeformation.model.Formation;
import com.oop.gestiondeformation.model.Participant;
import com.oop.gestiondeformation.repository.FormationRepository;
import com.oop.gestiondeformation.repository.ParticipantRepository;
import com.oop.gestiondeformation.repository.StructureRepository;
import com.oop.gestiondeformation.repository.ProfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SatisticServiceImpl implements StatisticsService {

    @Autowired
    private FormationRepository formationRepository;
    @Autowired
    private ParticipantRepository participantRepository;
    @Autowired
    private StructureRepository structureRepository;
    @Autowired
    private ProfilRepository profilRepository;

    // Statistiques par année
    @Override
    public Long countFormationsByYear(Integer annee) {
        return formationRepository.countByAnnee(annee);
    }

    @Override
    public Double getTotalBudgetByYear(Integer annee) {
        List<Formation> formations = formationRepository.findByAnnee(annee);
        return formations.stream().mapToDouble(f -> f.getBudget() != null ? f.getBudget() : 0.0).sum();
    }

    // Statistiques par domaine
    @Override
    public Map<String, Long> countFormationsByDomain() {
        List<Formation> formations = formationRepository.findAll();
        return formations.stream()
                .collect(Collectors.groupingBy(f -> f.getDomaine().getLibelle(), Collectors.counting()));
    }

    @Override
    public Map<String, Double> getBudgetByDomain() {
        List<Formation> formations = formationRepository.findAll();
        return formations.stream()
                .collect(Collectors.groupingBy(
                        f -> f.getDomaine().getLibelle(),
                        Collectors.summingDouble(f -> f.getBudget() != null ? f.getBudget() : 0.0)
                ));
    }

    // Statistiques par structure
    @Override
    public Map<String, Long> countParticipantsByStructure() {
        List<Participant> participants = participantRepository.findAll();
        return participants.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getStructure().getLibelle(),
                        Collectors.counting()
                ));
    }

    @Override
    public Map<String, Long> countFormationsByStructure(Integer annee) {
        List<Formation> formations = formationRepository.findByAnnee(annee);
        Map<String, Long> result = new HashMap<>();
        for (Formation f : formations) {
            for (Participant p : f.getParticipants()) {
                String structure = p.getStructure().getLibelle();
                result.put(structure, result.getOrDefault(structure, 0L) + 1);
            }
        }
        return result;
    }

    // Statistiques par profil
    @Override
    public Map<String, Long> countParticipantsByProfil() {
        List<Participant> participants = participantRepository.findAll();
        return participants.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getProfil().getLibelle(),
                        Collectors.counting()
                ));
    }

    // Statistiques combinées
    @Override
    public List<Map<String, Object>> getFormationsStatsByDomainAndYear(Integer startYear, Integer endYear) {
        List<Formation> formations = formationRepository.findByAnneeBetween(startYear, endYear);
        Map<String, Map<Integer, Long>> stats = new HashMap<>();
        for (Formation f : formations) {
            String domaine = f.getDomaine().getLibelle();
            Integer annee = f.getAnnee();
            stats.putIfAbsent(domaine, new HashMap<>());
            Map<Integer, Long> yearMap = stats.get(domaine);
            yearMap.put(annee, yearMap.getOrDefault(annee, 0L) + 1);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (String domaine : stats.keySet()) {
            for (Integer annee : stats.get(domaine).keySet()) {
                Map<String, Object> map = new HashMap<>();
                map.put("domaine", domaine);
                map.put("annee", annee);
                map.put("count", stats.get(domaine).get(annee));
                result.add(map);
            }
        }
        return result;
    }
    @Override
    public Map<Integer, Double> getBudgetByYear() {
        List<Formation> formations = formationRepository.findAll();
        Map<Integer, Double> result = new HashMap<>();
        for (Formation f : formations) {
            Integer annee = f.getAnnee();
            Double budget = f.getBudget() != null ? f.getBudget() : 0.0;
            result.put(annee, result.getOrDefault(annee, 0.0) + budget);
        }
        return result;
    }
    @Override
    public Long countParticipantsByYear(Integer annee) {
        List<Formation> formations = formationRepository.findByAnnee(annee);
        Set<Integer> uniqueParticipantIds = new HashSet<>();
        for (Formation f : formations) {
            for (Participant p : f.getParticipants()) {
                uniqueParticipantIds.add(p.getId());
            }
        }
        return (long) uniqueParticipantIds.size();
    }



    @Override
    public List<Map<String, Object>> getParticipationStatsByStructureAndYear(Integer startYear, Integer endYear) {
        List<Formation> formations = formationRepository.findByAnneeBetween(startYear, endYear);
        Map<String, Map<Integer, Set<Integer>>> stats = new HashMap<>();
        for (Formation f : formations) {
            Integer annee = f.getAnnee();
            for (Participant p : f.getParticipants()) {
                String structure = p.getStructure().getLibelle();
                stats.putIfAbsent(structure, new HashMap<>());
                Map<Integer, Set<Integer>> yearMap = stats.get(structure);
                yearMap.putIfAbsent(annee, new HashSet<>());
                yearMap.get(annee).add(p.getId());
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (String structure : stats.keySet()) {
            for (Integer annee : stats.get(structure).keySet()) {
                Map<String, Object> map = new HashMap<>();
                map.put("structure", structure);
                map.put("annee", annee);
                map.put("count", stats.get(structure).get(annee).size());
                result.add(map);
            }
        }
        return result;
    }
}