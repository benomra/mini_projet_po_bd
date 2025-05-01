import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotFound = () => {
    const handleLogout = () => {
        // Ajoutez ici votre logique de déconnexion
        localStorage.removeItem('token');
        // window.location.href = '/login';
        localStorage.removeItem("user");
      };
    


  return (
    <div className="not-found-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{ fontSize: '7rem', marginBottom: '1rem', color: '#dc3545' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#343a40' }}>Page Non Trouvée</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', color: '#6c757d' }}>
        La page que vous recherchez n'existe pas ou vous n'avez pas les permissions nécessaires pour y accéder.
      </p>
  
      <Link to="/" onClick={handleLogout} className="logout-link" style={{
        display: 'inline-block',
        marginTop: '15px',
        padding: '12px 24px',
        backgroundColor: '#6c757d',
        color: '#ffffff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
      }}>
     
   
           
              <FontAwesomeIcon  />
              <span>Page de Connexion</span>
            </Link>
    </div>
  );
};

export default NotFound;