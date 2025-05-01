package com.oop.gestiondeformation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantDTO {
    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private Integer tel;
    private String structureName;
    private String profilName;
    private Boolean present; // pour indiquer si le participant était présent
}