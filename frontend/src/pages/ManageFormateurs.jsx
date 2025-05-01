import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/Layout";
import "../App.css";
import api from "../utils/axiosConfig"; 

function ManageFormateurs() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userRoles = ["admin", "utilisateur"];
  useEffect(() => {
    api
      .get("http://localhost:8081/api/formateurs")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Voulez-vous supprimer ce formateur ?");
    if (confirmDelete) {
      api
        .delete("http://localhost:8081/api/formateurs/" + id)
        .then((res) => {
          setData((prevData) => prevData.filter((formateur) => formateur.id !== id));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredData = data.filter(formateur => 
    formateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formateur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formateur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formateur.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="" userRoles={userRoles} onSearch={handleSearch}>
      <div className="users-table">
        <div className="table-header">
          <div className="table-title">Liste des formateurs</div>
          <Link to="/addformateur" className="btn-success">
            Add +
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Type</th>
              <th>Employeur</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((d, i) => (
              <tr key={i}>
                <td>{d.id}</td>
                <td>{d.nom}</td>
                <td>{d.prenom}</td>
                <td>{d.email}</td>
                <td>{d.tel}</td>
                <td>{d.type}</td>
                <td>{d.employeur?.nomEmployeur || "-"}</td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/updateformateur/${d.id}`}
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

export default ManageFormateurs;