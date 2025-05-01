import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig"; 
import {
  Button,
  Card,
  Select,
  Flex,
  Form,
  Input,
  Typography,
  message,
  Spin,
} from "antd";
import "../App.css";

function UpdateUsers() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Charger les rôles disponibles depuis le backend
  useEffect(() => {
    api
      .get("http://localhost:8081/api/roles")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des rôles:", error);
        message.error("Impossible de charger les rôles disponibles");
      });
  }, []);

  // Charger les données de l'utilisateur à modifier
  useEffect(() => {
    setLoading(true);
    api
      .get(`http://localhost:8081/api/utilisateurs/${id}`)
      .then((res) => {
        // Préparer les données pour le formulaire
        const userData = {
          id: res.data.id,
          login: res.data.login,
          // Ne pas afficher le mot de passe réel
          password: "", // Laisser vide ou mettre un placeholder
          roleId: res.data.role?.id // ID du rôle
        };
        form.setFieldsValue(userData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement de l'utilisateur:", err);
        message.error("Impossible de charger les données de l'utilisateur");
        setLoading(false);
      });
  }, [id, form]);

  // Soumission du formulaire
  const onFinish = (values) => {
    setSubmitting(true);
    
    // Trouver l'objet rôle complet à partir de son ID
    const selectedRole = roles.find(role => role.id === values.roleId);
    
    // Créer l'objet utilisateur avec la structure attendue par le backend
    const utilisateur = {
      id: parseInt(id),
      login: values.login,
      password: values.password,
      role: selectedRole
    };
    
    api
      .put(`http://localhost:8081/api/utilisateurs/${id}`, utilisateur)
      .then(() => {
        message.success("Utilisateur mis à jour avec succès !");
        navigate("/manageusers"); // redirige après MAJ
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour:", err);
        if (err.response && err.response.status === 409) {
          message.error("Cet identifiant existe déjà.");
        } else {
          message.error("Échec de la mise à jour de l'utilisateur.");
        }
        setSubmitting(false);
      });
  };

  return (
    <Card className="form-container">
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p>Chargement des données de l'utilisateur...</p>
        </div>
      ) : (
        <Flex gap="large" align="center">
          <Flex vertical flex={1}>
            <Typography.Title level={3} strong className="title">
              Modifier un utilisateur
            </Typography.Title>
            <Form
              layout="vertical"
              form={form}
              autoComplete="off"
              onFinish={onFinish}
            >
              <Form.Item
                label="ID"
                name="id"
              >
                <Input size="large" disabled />
              </Form.Item>

              <Form.Item
                label="Identifiant"
                name="login"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer l'identifiant",
                  },
                ]}
              >
                <Input size="large" placeholder="Entrer l'identifiant" />
              </Form.Item>

              <Form.Item
                label="Mot de passe"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le mot de passe",
                  },
                ]}
              >
                <Input.Password 
                  size="large" 
                  placeholder="Entrer le nouveau mot de passe" 
                />
              </Form.Item>

              <Form.Item
                label="Rôle"
                name="roleId"
                rules={[
                  {
                    required: true,
                    message: "Veuillez choisir un rôle",
                  },
                ]}
              >
                <Select
                  placeholder="Sélectionner un rôle"
                  size="large"
                  loading={roles.length === 0}
                >
                  {roles.map(role => (
                    <Select.Option key={role.id} value={role.id}>
                      {role.nom}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="form-buttons">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="btn full-width"
                  loading={submitting}
                >
                  Mettre à jour
                </Button>
                <Button
                  size="large"
                  className="btn full-width"
                  onClick={() => navigate("/manageusers")}
                  disabled={submitting}
                >
                  Annuler
                </Button>
              </div>
            </Form>
          </Flex>
        </Flex>
      )}
    </Card>
  );
}

export default UpdateUsers;