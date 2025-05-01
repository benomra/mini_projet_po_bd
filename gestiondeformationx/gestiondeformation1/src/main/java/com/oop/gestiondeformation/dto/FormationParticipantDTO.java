package com.oop.gestiondeformation.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormationParticipantDTO {
    private Long formationId;
    private Integer participantId;
    private Boolean present;

    // Informations supplémentaires pour l'affichage
    private String titreFormation;
    private String nomParticipant;
}