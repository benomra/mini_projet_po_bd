import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AddFormation from './pages/AddFormation.jsx';
import Register from './pages/Register.jsx';
import Login from './Auth/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import UpdateUsers from './pages/UpdateUsers.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import AddParticipant from './pages/AddParticipant.jsx';
import ManageParticipants from './pages/ManageParticipants.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ManageFormateurs from './pages/ManageFormateurs.jsx';
import UpdateFormateur from './pages/UpdateFormateur.jsx';
import AddFormateur from './pages/AddFormateur.jsx';
import ManageFormations from './pages/ManageFormations.jsx';
import UpdateFormation from './pages/UpdateFormation.jsx';
import FormationParticipants from './pages/FormationParticipants.jsx';
import UpdateParticipant from './pages/UpdateParticipant.jsx';

// Composant de route protégée qui vérifie le rôle de l'utilisateur
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
    return <Navigate to="/" />;
  }
  
  // Vérifier si l'utilisateur a un rôle défini
  if (!user.role) {
    // Redirection vers page not found si aucun rôle n'est spécifié
    return <Navigate to="/not-found" />;
  }
  
  // Vérifier si le rôle de l'utilisateur est autorisé pour cette route
  if (allowedRoles.includes(user.role)) {
    return children;
  }
  
  // Redirection vers page not found si l'utilisateur n'a pas le rôle requis
  return <Navigate to="/not-found" />;
};

const App = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Récupérer les informations de l'utilisateur au chargement de l'application
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Login />} />
        
        {/* Routes pour le tableau de bord - accessible à tous les utilisateurs authentifiés */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'responsable']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Routes pour la gestion des utilisateurs - accessible uniquement aux administrateurs */}
        <Route path="/manageusers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
        } />
        <Route path="/createusers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Register />
          </ProtectedRoute>
        } />
        <Route path="/updateusers/:id" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UpdateUsers />
          </ProtectedRoute>
        } />
        
        {/* Routes pour la gestion des formations - accessible aux admins et responsables */}
        <Route path="/formations" element={
          <ProtectedRoute allowedRoles={['admin', 'utilisateur']}>
            <ManageFormations />
          </ProtectedRoute>
        } />
        <Route path="/addformation" element={
          <ProtectedRoute allowedRoles={['admin', 'utilisateur']}>
            <AddFormation />
          </ProtectedRoute>
        } />
        <Route path="/updateformation/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'utilisateur']}>
            <UpdateFormation />
          </ProtectedRoute>
        } />
        <Route path="/formationparticipants/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'utilisateur']}>
            <FormationParticipants />
          </ProtectedRoute>
        } />
        
        {/* Routes pour la gestion des formateurs - accessible aux admins et responsables */}
        <Route path="/formateurs" element={
          <ProtectedRoute allowedRoles={['admin', 'utilisateur']}>
            <ManageFormateurs />
          </ProtectedRoute>
        } />
        <Route path="/addformateur" element={
          <ProtectedRoute allowedRoles={['admin', 'utilisateur']}>
            <AddFormateur />
          </ProtectedRoute>
        } />
        <Route path="/updateformateur/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'utilisateur']}>
            <UpdateFormateur />
          </ProtectedRoute>
        } />
        
        {/* Routes pour la gestion des participants - accessible à tous les utilisateurs authentifiés */}
        <Route path="/participants" element={
          <ProtectedRoute allowedRoles={['admin', 'utilisateur']}>
            <ManageParticipants />
          </ProtectedRoute>
        } />
        <Route path="/addparticipant" element={
          <ProtectedRoute allowedRoles={['admin', 'utilisateur']}>
            <AddParticipant />
          </ProtectedRoute>
        } />
        <Route path="/updateparticipant/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'utilisateur']}>
            <UpdateParticipant />
          </ProtectedRoute>
        } />
        
        {/* Page Not Found */}
        <Route path="/not-found" element={<NotFound />} />
        
        {/* Route par défaut - redirection vers la page de connexion */}
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </Router>
  );
};

export default App;