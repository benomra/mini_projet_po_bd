package com.oop.gestiondeformation.security;

import com.oop.gestiondeformation.config.JwtConfig;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import io.jsonwebtoken.Claims;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtConfig jwtConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String token = null;
        String login = null;

        // Vérifier si l'en-tête Authorization est présent et commence par "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
            try {
                login = jwtConfig.extractLogin(token);
            } catch (Exception e) {
                logger.error("Erreur d'extraction du login depuis le token", e);
            }
        }

        // Vérifier si le login a été extrait et que l'utilisateur n'est pas déjà authentifié
        if (login != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Vérifier si le token est valide
            if (jwtConfig.validateToken(token)) {
                // Extraire le rôle de l'utilisateur depuis le token
                String role = jwtConfig.extractClaim(token, claims -> claims.get("role", String.class));

                // Créer un objet d'authentification
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        login, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}