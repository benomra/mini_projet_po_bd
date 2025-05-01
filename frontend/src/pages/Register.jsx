import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
} from "antd";
import "../App.css";

function Register() {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = (values) => {
    setLoading(true);
    console.log("Valeurs du formulaire:", values);
    
    // Trouver l'objet rôle complet à partir de son ID
    const selectedRole = roles.find(role => role.id === values.roleId);
    
    // Créer l'objet utilisateur avec la structure attendue par le backend
    const utilisateur = {
      login: values.login,
      password: values.password,
      role: selectedRole // Utiliser l'objet rôle complet
    };
    
    console.log("Données envoyées au backend:", utilisateur);
    
    api
      .post("http://localhost:8081/api/utilisateurs", utilisateur)
      .then((res) => {
        console.log("Utilisateur créé:", res.data);
        message.success("Utilisateur créé avec succès!");
        navigate("/manageusers");
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout:", err);
        if (err.response && err.response.status === 409) {
          message.error("Cet identifiant existe déjà.");
        } else {
          message.error("Erreur lors de la création de l'utilisateur");
        }
        setLoading(false);
      });
  };

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Créer un utilisateur
          </Typography.Title>
          <Form 
            form={form}
            layout="vertical" 
            onFinish={handleSubmit} 
            autoComplete="off"
          >
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
              <Input.Password size="large" placeholder="Entrer le mot de passe" />
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="btn full-width"
                loading={loading}
              >
                Créer l'utilisateur
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </Card>
  );
}

export default Register;