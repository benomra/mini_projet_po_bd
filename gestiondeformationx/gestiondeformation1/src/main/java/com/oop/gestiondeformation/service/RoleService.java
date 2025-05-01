package com.oop.gestiondeformation.service;

import com.oop.gestiondeformation.model.Role;
import java.util.List;

public interface RoleService {
    Iterable<Role> findAll();
    Role findById(Integer id);
    Role findByNom(String nom);
    Role save(Role role);
    void deleteById(Integer id);
}