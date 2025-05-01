package com.oop.gestiondeformation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantFormationRequestDTO {
    private Long formationId;
    private Integer participantId;
    private Boolean present;
}