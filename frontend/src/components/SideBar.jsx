import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faChartLine,
  faUsers,
  faPerson,
  faLaptop,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ userRoles }) => {
  const location = useLocation();
  
  // Convertir un rôle unique en tableau si nécessaire
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  
  // Définir les menus selon le rôle de l'utilisateur
  const getMenuItems = () => {
    const allMenuItems = [
      {
        path: "/manageusers",
        icon: faUsers,
        text: "Utilisateurs",
        roles: ["admin"]
      },
      {
        path: "/dashboard",
        icon: faChartLine,
        text: "Statistiques",
        roles: ["admin", "responsable"]
      },
      {
        path: "/participants",
        icon: faPerson,
        text: "Participants",
        roles: ["admin", "utilisateur"]
      },
      {
        path: "/Formateurs",
        icon: faChalkboardTeacher,
        text: "Formateurs",
        roles: ["admin", "utilisateur"]
      },
      {
        path: "/Formations",
        icon: faLaptop,
        text: "Formations",
        roles: ["admin", "utilisateur"]
      },
    ];

    // Si aucun rôle n'est spécifié, afficher tous les menus (pour le développement)
    if (!roles || roles.length === 0) return allMenuItems;
    
    // Filtrer les menus selon les rôles de l'utilisateur
    return allMenuItems.filter(item => 
      item.roles.some(role => roles.includes(role))
    );
  };

  const menuItems = getMenuItems();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    // Ajoutez ici votre logique de déconnexion
    localStorage.removeItem('token');
    // window.location.href = '/login';
    localStorage.removeItem("user");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebartitle">FormaPro</h2>
      
      {/* Container principal qui prend toute la hauteur disponible */}
      <div className="sidebar-content">
        {/* Menu de navigation principal */}
        <ul className="nav-links">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={location.pathname === item.path ? "active" : ""}
            >
              <Link to={item.path}>
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Lien de déconnexion en bas */}
        <div className="logout-container">
          <Link to="/" onClick={handleLogout} className="logout-link">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Déconnexion</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;