package com.oop.gestiondeformation.controller;

import com.oop.gestiondeformation.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/formations-by-year")
    public Long getFormationsByYear(@RequestParam Integer annee) {
        return statisticsService.countFormationsByYear(annee);
    }

    @GetMapping("/budget-by-year")
    public Double getBudgetByYear(@RequestParam Integer annee) {
        return statisticsService.getTotalBudgetByYear(annee);
    }

    @GetMapping("/formations-by-domain")
    public Map<String, Long> getFormationsByDomain() {
        return statisticsService.countFormationsByDomain();
    }

    @GetMapping("/budget-by-domain")
    public Map<String, Double> getBudgetByDomain() {
        return statisticsService.getBudgetByDomain();
    }

    @GetMapping("/participants-by-structure")
    public Map<String, Long> getParticipantsByStructure() {
        return statisticsService.countParticipantsByStructure();
    }

    @GetMapping("/formations-by-structure")
    public Map<String, Long> getFormationsByStructure(@RequestParam Integer annee) {
        return statisticsService.countFormationsByStructure(annee);
    }

    @GetMapping("/participants-by-profil")
    public Map<String, Long> getParticipantsByProfil() {
        return statisticsService.countParticipantsByProfil();
    }

    @GetMapping("/formations-domain-year")
    public List<Map<String, Object>> getFormationsStatsByDomainAndYear(
            @RequestParam Integer startYear,
            @RequestParam Integer endYear) {
        return statisticsService.getFormationsStatsByDomainAndYear(startYear, endYear);
    }
    @GetMapping("/budget-by-year/all")
    public Map<Integer, Double> getBudgetByYear() {
        return statisticsService.getBudgetByYear();
    }


    @GetMapping("/participants-by-year")
    public Long getParticipantsByYear(@RequestParam Integer annee) {
        return statisticsService.countParticipantsByYear(annee);
    }

    @GetMapping("/participation-structure-year")
    public List<Map<String, Object>> getParticipationStatsByStructureAndYear(
            @RequestParam Integer startYear,
            @RequestParam Integer endYear) {
        return statisticsService.getParticipationStatsByStructureAndYear(startYear, endYear);
    }

}