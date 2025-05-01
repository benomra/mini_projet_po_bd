package com.oop.gestiondeformation.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "formations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Formation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private Integer annee;

    @Column(nullable = false)
    private Integer duree; // nombre de jours

    @ManyToOne
    @JoinColumn(name = "id_domaine", nullable = false)
    private Domaine domaine;

    @Column(nullable = false)
    private Double budget;

    @ManyToOne
    @JoinColumn(name = "id_formateur")
    private Formateur formateur;

    @ManyToMany
    @JoinTable(
            name = "formations_participants",
            joinColumns = @JoinColumn(name = "formation_id"),
            inverseJoinColumns = @JoinColumn(name = "participant_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Participant> participants = new HashSet<>();
}
