package com.oop.gestiondeformation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employeurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employeur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nom_employeur", nullable = false)
    private String nomEmployeur;
}