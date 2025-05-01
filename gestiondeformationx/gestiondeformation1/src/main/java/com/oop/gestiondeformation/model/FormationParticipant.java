package com.oop.gestiondeformation.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Entity
@Table(name = "formations_participants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormationParticipant implements Serializable {

    @EmbeddedId
    private FormationParticipantId id;

    @ManyToOne
    @MapsId("formationId")
    @JoinColumn(name = "formation_id")
    @JsonBackReference
    private Formation formation;

    @ManyToOne
    @MapsId("participantId")
    @JoinColumn(name = "participant_id")
    @JsonManagedReference
    private Participant participant;

    private Boolean present = false;

    // Cette classe imbriquée représente la clé primaire composite
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FormationParticipantId implements Serializable {
        private Long formationId;
        private Integer participantId;
    }
}