import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUsers, faUserTie } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/Layout";
import "../App.css";
import api from "../utils/axiosConfig"; 

function ManageFormations() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [participants, setParticipants] = useState([]);
  const userRoles = ["admin", "utilisateur"];

  useEffect(() => {
    // Fetch formations
    api
      .get("http://localhost:8081/api/formations")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
    
    // Fetch all participants in a single request
    api
      .get("http://localhost:8081/api/participants")
      .then((res) => {
        setParticipants(res.data);
      })
      .catch((err) => console.log("Error fetching participants:", err));
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Voulez-vous supprimer cette formation ?");
    if (confirmDelete) {
      api
        .delete("http://localhost:8081/api/formations/" + id)
        .then((res) => {
          setData((prevData) => prevData.filter((formation) => formation.id !== id));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredData = data.filter(formation => 
    formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formation.domaine?.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formation.annee.toString().includes(searchTerm)
  );

  const getFormateurName = (formation) => {
    if (!formation.formateur) return "Non assigné";
    return `${formation.formateur.nom} ${formation.formateur.prenom}`;
  };

  // Obtenir les noms des participants d'une formation
  const getFormationParticipants = (formation) => {
    if (!formation.participants || formation.participants.length === 0) {
      return "Aucun participant";
    }
    
    const formationParticipants = formation.participants.map(p => {
      // Rechercher les détails complets du participant
      const participantDetails = participants.find(part => part.id === p.id);
      if (participantDetails) {
        return `${participantDetails.nom} ${participantDetails.prenom}`;
      }
      return `Participant #${p.id}`;
    });
    
    return formationParticipants.join(", ");
  };

  return (
    <Layout title="" userRoles={userRoles} onSearch={handleSearch}>
      <div className="users-table">
        <div className="table-header">
          <div className="table-title">Liste des formations</div>
          <Link to="/addformation" className="btn-success">
            Add +
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Titre</th>
              <th>Année</th>
              <th>Durée (jours)</th>
              <th>Domaine</th>
              <th>Budget</th>
              <th>Formateur</th>
              <th>Participants</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((d, i) => (
              <tr key={i}>
                <td>{d.id}</td>
                <td>{d.titre}</td>
                <td>{d.annee}</td>
                <td>{d.duree}</td>
                <td>{d.domaine?.libelle || "-"}</td>
                <td>{d.budget} DT</td>
                <td>
                  <div className="formateur-info">
                    {getFormateurName(d)}
                  </div>
                </td>
                <td>
                  <div className="participant-info">
                    <span className="participant-names">
                      {getFormationParticipants(d)}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/updateformation/${d.id}`}
                      className="icon-button edit"
                      title="Modifier"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(d.id)}
                      className="icon-button delete"
                      title="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <div className="pagination-numbers">
            <span className="active">1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>...</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ManageFormations;