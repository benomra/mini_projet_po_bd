import React, { useState } from "react";
import { Alert, Button, Card, Flex, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "../App.css";
import loginImage from "../assets/login.png";
import "../Login.css";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: values.login,
          password: values.password
        }),
      });
  
      console.log("Statut de la réponse:", response.status);
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La réponse n'est pas au format JSON");
      }
  
      const data = await response.json();
      console.log("Données reçues:", data);
  
      if (response.ok) {
        // Correction ici
        let userRole = "";
  
        if (data.role) {
          if (typeof data.role === "object" && data.role.nom) {
            userRole = data.role.nom.toLowerCase();
          } else if (typeof data.role === "string") {
            userRole = data.role.toLowerCase();
          } else if (typeof data.role === "number") {
            console.warn("Attention : Le rôle est un ID et non un nom !");
             
          }
        }
  
        localStorage.setItem("user", JSON.stringify({
          id: data.id,
          login: data.login,
          role: userRole
        }));
  
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
  
        // Redirection
        if (userRole === "admin" ) {
          navigate("/manageusers", { state: { userRole } });
        } else if (userRole === "utilisateur") {
          navigate("/participants", { state: { userRole } });
        }else if (userRole === "responsable") {
          navigate("/dashboard", { state: { userRole } });
        } else {
          console.error("Rôle inconnu :", userRole);
          setError("Rôle inconnu. Veuillez contacter l'administrateur.");
        }
      } else {
        setError(data.message || "Identifiants incorrects. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Erreur détaillée:", err);
      setError("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Card className="form-container1">
      <Flex gap="large" align="center">
        <Flex flex={1}>
          <img src={loginImage} className="auth-image" alt="Login" />
        </Flex>
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Se connecter
          </Typography.Title>
          <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
            <Form.Item
              label="Identifiant"
              name="login"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer votre identifiant",
                },
              ]}
            >
              <Input size="large" placeholder="Entrer votre identifiant" />
            </Form.Item>

            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer votre mot de passe",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Entrer votre mot de passe"
              />
            </Form.Item>

            {error && (
              <Alert
                description={error}
                type="error"
                showIcon
                closable
                className="alert"
              />
            )}
            
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="btn full-width"
                loading={loading}
              >
                Se connecter
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Login;