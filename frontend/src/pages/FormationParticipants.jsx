import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/Layout";
import "../App.css";
import api from "../utils/axiosConfig"; 

function FormationParticipants() {
  const { id } = useParams();
  const [formation, setFormation] = useState(null);
  const [formationParticipants, setFormationParticipants] = useState([]);
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();
  const userRole = "simple";
 

  useEffect(() => {
  
    
    // Charger les détails de la formation
    api
      .get(`http://localhost:3001/formations/${id}`)
      .then((res) => {
        setFormation(res.data);
      })
      .catch((err) => console.log(err));
    
    // Charger les participants de la formation
    api
      .get(`http://localhost:3001/formations/${id}/participants`)
      .then((res) => {
        setFormationParticipants(res.data);
      })
      .catch((err) => console.log(err));
    
    // Charger tous les participants disponibles
    api
      .get("http://localhost:3001/participants")
      .then((res) => {
        setAvailableParticipants(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // Filtrer les participants disponibles (ceux qui ne sont pas déjà dans la formation)
  const filteredAvailableParticipants = availableParticipants.filter(
    (participant) => !formationParticipants.some((fp) => fp.id === participant.id)
  );

  const handleAddParticipant = () => {
    if (!selectedParticipant) return;
    
    api
      .post(`http://localhost:8081/formations/${id}/participants`, {
        participantId: selectedParticipant
      })
      .then((res) => {
        // Ajouter le participant à la liste des participants de la formation
        const newParticipant = availableParticipants.find(
          (p) => p.id.toString() === selectedParticipant
        );
        setFormationParticipants([...formationParticipants, newParticipant]);
        setSelectedParticipant("");
      })
      .catch((err) => console.log(err));
  };

  const handleRemoveParticipant = (participantId) => {
    const confirmDelete = window.confirm("Voulez-vous retirer ce participant de la formation ?");
    if (confirmDelete) {
      api
        .delete(`http://localhost:8081/formations/${id}/participants/${participantId}`)
        .then((res) => {
          // Supprimer le participant de la liste des participants de la formation
          setFormationParticipants(
            formationParticipants.filter((p) => p.id !== participantId)
          );
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Filtrer les participants de la formation selon le terme de recherche
  const filteredFormationParticipants = formationParticipants.filter(
    (participant) =>
      participant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.structure?.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.profil?.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!formation) {
    return (
      <Layout title="" userRole={userRole}>
        <div className="loading">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout title="" userRole={userRole} onSearch={handleSearch}>
      <div className="participants-container">
        <div className="form-title">
          Participants de la formation: {formation.titre} ({formation.annee})
        </div>
        
        <div className="add-participant-section">
          <div className="form-group">
            <label htmlFor="selectedParticipant">Ajouter un participant</label>
            <div className="add-participant-form">
              <select
                id="selectedParticipant"
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
                className="participant-select"
              >
                <option value="">Sélectionner un participant</option>
                {filteredAvailableParticipants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.nom} {participant.prenom} - {participant.profil?.libelle} ({participant.structure?.libelle})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn-add"
                disabled={!selectedParticipant}
                onClick={handleAddParticipant}
              >
                <FontAwesomeIcon icon={faPlus} /> Ajouter
              </button>
            </div>
          </div>
        </div>
        
        <div className="participants-list">
          <h3>Liste des participants ({filteredFormationParticipants.length})</h3>
          {filteredFormationParticipants.length === 0 ? (
            <div className="no-data">Aucun participant pour cette formation</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Structure</th>
                  <th>Profil</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFormationParticipants.map((participant) => (
                  <tr key={participant.id}>
                    <td>{participant.nom}</td>
                    <td>{participant.prenom}</td>
                    <td>{participant.email}</td>
                    <td>{participant.tel}</td>
                    <td>{participant.structure?.libelle || "-"}</td>
                    <td>{participant.profil?.libelle || "-"}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="icon-button delete"
                        title="Retirer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="form-buttons">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/formations")}
          >
            Retour
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default FormationParticipants;