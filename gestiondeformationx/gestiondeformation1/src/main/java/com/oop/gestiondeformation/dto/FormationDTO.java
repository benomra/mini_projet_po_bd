package com.oop.gestiondeformation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormationDTO {
    private Long id;
    private String titre;
    private Integer annee;
    private Integer duree;
    private Double budget;
    private String domaineName;
    private String formateurName;
    private Boolean present; // pour indiquer si le participant était présent
}