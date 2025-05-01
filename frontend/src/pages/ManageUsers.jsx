
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/Layout";
import "../App.css";
import api from "../utils/axiosConfig"; 
function ManageUsers() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userRoles = ["admin"];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/utilisateurs")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des utilisateurs:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Voulez-vous supprimer cet utilisateur ?");
    if (confirmDelete) {
      api
        .delete(`http://localhost:8081/api/utilisateurs/${id}`)
        .then((res) => {
          setData((prevData) => prevData.filter((user) => user.id !== id));
        })
        .catch((err) => console.error("Erreur lors de la suppression:", err));
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredData = data.filter(user => 
    user.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role && user.role.nom && user.role.nom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout title="" userRoles={userRoles} onSearch={handleSearch}>
      <div className="users-table">
        <div className="table-header">
          <div className="table-title">Liste des utilisateurs</div>
          <Link to="/createusers" className="btn-success">
            Add +
          </Link>
        </div>
        {loading ? (
          <div className="loading">Chargement des utilisateurs...</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Identifiant</th>
                  <th>Mot de passe</th>
                  <th>Rôle</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.login}</td>
                      <td>••••••••</td> {/* Masquer le mot de passe */}
                      <td>{user.role && user.role.nom ? user.role.nom : "Non défini"}</td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/updateusers/${user.id}`}
                            className="icon-button edit"
                            title="Modifier"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="icon-button delete"
                            title="Supprimer"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredData.length > 0 && (
              <div className="pagination">
                <div className="pagination-numbers">
                  <span className="active">1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default ManageUsers;