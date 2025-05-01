package com.oop.gestiondeformation.service;

import java.util.Map;
import java.util.List;

public interface StatisticsService {
    // Statistiques par année
    Long countFormationsByYear(Integer annee);
    Double getTotalBudgetByYear(Integer annee);

    // Statistiques par domaine
    Map<String, Long> countFormationsByDomain();
    Map<String, Double> getBudgetByDomain();

    // Statistiques par structure
    Map<String, Long> countParticipantsByStructure();
    Map<String, Long> countFormationsByStructure(Integer annee);

    // Statistiques par profil
    Map<String, Long> countParticipantsByProfil();

    // Statistiques combinées
    List<Map<String, Object>> getFormationsStatsByDomainAndYear(Integer startYear, Integer endYear);

    Long countParticipantsByYear(Integer annee);

    List<Map<String, Object>> getParticipationStatsByStructureAndYear(Integer startYear, Integer endYear);

    default Map<Integer, Double> getBudgetByYear() {
        return null;
    }
}