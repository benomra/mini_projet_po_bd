import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/Layout";
import "../App.css";
import api from "../utils/axiosConfig"; 

function ManageParticipants() {
  const [participants, setParticipants] = useState([]);
  const [structures, setStructures] = useState([]);
  const [profils, setProfils] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const userRoles = ["admin", "utilisateur"];
  const [selectedStructure, setSelectedStructure] = useState("");
  const [selectedProfil, setSelectedProfil] = useState("");
  useEffect(() => {
    // Charger les données
    const fetchData = async () => {
      setLoading(true);
      try {
        const [participantsRes, structuresRes, profilsRes] = await Promise.all([
          api.get("http://localhost:8081/api/participants"),
          api.get("http://localhost:8081/api/structures"),
          api.get("http://localhost:8081/api/profils")
        ]);
        
        // Utilisez les données selon la structure exacte retournée par votre API
        console.log("Participants:", participantsRes.data);
        console.log("Structures:", structuresRes.data);
        console.log("Profils:", profilsRes.data);
        
        setParticipants(participantsRes.data);
        setStructures(structuresRes.data);
        setProfils(profilsRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Voulez-vous supprimer ?');
    if (confirmDelete) {
      api.delete(`http://localhost:8081/api/participants/${id}`)
        .then(() => {
          // Mettre à jour la liste après suppression
          setParticipants(prevParticipants => 
            prevParticipants.filter(participant => participant.id !== id)
          );
        })
        .catch(err => console.error("Erreur lors de la suppression:", err));
    }
  };
  
  // Fonction pour obtenir le nom de la structure
  const getStructureName = (structureObj) => {
    if (!structureObj) return "N/A";
    // Accès correct à l'ID de la structure
    const structure = structures.find(s => s.id === structureObj.id);
    return structure ? structure.libelle : "N/A";
  };

  // Fonction pour obtenir le nom du profil
  const getProfilName = (profilObj) => {
    if (!profilObj) return "N/A";
    // Accès correct à l'ID du profil
    const profil = profils.find(p => p.id === profilObj.id);
    return profil ? profil.libelle : "N/A";
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearchTerm = !searchTerm.trim() || (
      participant.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getStructureName(participant.structure)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProfilName(participant.profil)?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const matchesStructure = !selectedStructure || (participant.structure && participant.structure.id.toString() === selectedStructure);
    const matchesProfil = !selectedProfil || (participant.profil && participant.profil.id.toString() === selectedProfil);
  
    return matchesSearchTerm && matchesStructure && matchesProfil;
  });
  
  return (
    <Layout title="Participants" userRoles={userRoles} onSearch={handleSearch}>
      <div className="filter-section">
        <div className="filter-group">
          <label>Structure</label>
          <div className="select-container">
          <select value={selectedStructure} onChange={(e) => setSelectedStructure(e.target.value)}>
  <option value="">Toutes les structures</option>
  {structures.map(structure => (
    <option key={structure.id} value={structure.id}>
      {structure.libelle}
    </option>
  ))}
</select>
          </div>
        </div>
        <div className="filter-group">
          <label>Profil</label>
          <div className="select-container">
          <select value={selectedProfil} onChange={(e) => setSelectedProfil(e.target.value)}>
  <option value="">Tous les profils</option>
  {profils.map(profil => (
    <option key={profil.id} value={profil.id}>
      {profil.libelle}
    </option>
  ))}
</select>
          </div>
        </div>
       
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="table-title">Liste des participants</div>
          <Link to="/addparticipant" className="btn-success">
            Add +
          </Link>
        </div>
        
        {loading ? (
          <div className="loading-message">Chargement des participants...</div>
        ) : (
          <>
            {filteredParticipants.length === 0 ? (
              <div className="no-data-message">Aucun participant trouvé</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Id</th>
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
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id}>
                      <td>{participant.id}</td>
                      <td>{participant.nom}</td>
                      <td>{participant.prenom}</td>
                      <td>{participant.email}</td>
                      <td>{participant.tel}</td>
                      <td>{getStructureName(participant.structure)}</td>
                      <td>{getProfilName(participant.profil)}</td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/updateparticipant/${participant.id}`}
                            className="icon-button edit" 
                            title="Modifier"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(participant.id)} 
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
            )}
            
            <div className="pagination">
              <div className="pagination-numbers">
                <span className="active">1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>...</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default ManageParticipants;