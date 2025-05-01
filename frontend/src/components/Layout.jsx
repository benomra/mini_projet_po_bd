import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar"; // Import corrigé avec 'B' majuscule
import Header from "./Header";
import "../App.css";

function Layout({ children, title, onSearch }) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem("user");
    
    if (!user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      navigate("/");
      return;
    }
    
    try {
      // Récupérer le rôle de l'utilisateur depuis le localStorage
      const userData = JSON.parse(user);
      const role = userData.role || "utilisateur";
      setUserRole(role);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations utilisateur:", error);
      // En cas d'erreur, déconnecter l'utilisateur
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="layout">
      <SideBar userRoles={userRole} />
      <div className="content-container">
        <Header title={title} onSearch={onSearch} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
export default Layout;