import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

function UpdateFormateur() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [employeurs, setEmployeurs] = React.useState([]);

  // Effet pour charger les données du formateur et des employeurs
  useEffect(() => {
    // Charger les données du formateur
    api
      .get(`http://localhost:8081/api/formateurs/${id}`)
      .then((res) => {
        console.log("Données du formateur:", res.data);
        // Définir correctement l'ID de l'employeur si disponible
        form.setFieldsValue({
          nom: res.data.nom,
          prenom: res.data.prenom,
          email: res.data.email,
          tel: res.data.tel,
          type: res.data.type,
          idEmployeur: res.data.employeur?.id || null
        });
      })
      .catch((err) => {
        console.error(err);
        message.error("Erreur lors du chargement des données du formateur");
      });

    // Charger la liste des employeurs
    api
      .get("http://localhost:8081/api/employeurs")
      .then((res) => {
        console.log("Liste des employeurs:", res.data);
        setEmployeurs(res.data);
      })
      .catch((err) => {
        console.error(err);
        message.error("Erreur lors du chargement des employeurs");
      });
  }, [id, form]);

  // Gestion de la soumission du formulaire
  const onFinish = (values) => {
    const formateurToSubmit = {
      nom: values.nom,
      prenom: values.prenom,
      email: values.email,
      tel: values.tel,
      type: values.type
    };

    // Si le type est externe et qu'un employeur est sélectionné, ajoutez-le
    if (values.type === "externe" && values.idEmployeur) {
      formateurToSubmit.employeur = { id: values.idEmployeur };
    } else {
      formateurToSubmit.employeur = null;
    }

    console.log("Données à envoyer:", formateurToSubmit);

    api
      .put(`http://localhost:8081/api/formateurs/${id}`, formateurToSubmit)
      .then(() => {
        message.success("Formateur mis à jour avec succès !");
        navigate("/formateurs");
      })
      .catch((err) => {
        console.error(err);
        message.error("Échec de la mise à jour du formateur");
      });
  };

  // Fonction pour gérer le changement de type de formateur
  const handleTypeChange = (value) => {
    if (value === "interne") {
      form.setFieldValue("idEmployeur", null);
    }
  };

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Modifier un formateur
          </Typography.Title>
          <Form
            layout="vertical"
            form={form}
            autoComplete="off"
            onFinish={onFinish}
          >
            <Form.Item
              label="Nom"
              name="nom"
              rules={[
                {
                  required: true,
                  message: "Le nom est obligatoire",
                },
              ]}
            >
              <Input size="large" placeholder="Entrer le nom" />
            </Form.Item>

            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[
                {
                  required: true,
                  message: "Le prénom est obligatoire",
                },
              ]}
            >
              <Input size="large" placeholder="Entrer le prénom" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "L'email est obligatoire",
                },
                {
                  type: "email",
                  message: "Format d'email invalide",
                },
              ]}
            >
              <Input size="large" placeholder="Entrer l'email" />
            </Form.Item>

            <Form.Item
              label="Téléphone"
              name="tel"
              rules={[
                {
                  required: true,
                  message: "Le téléphone est obligatoire",
                },
                {
                  pattern: /^[0-9]{8}$/,
                  message: "Le numéro doit contenir 8 chiffres",
                },
              ]}
            >
              <Input size="large" placeholder="Entrer le numéro de téléphone" />
            </Form.Item>

            <Form.Item
              label="Type de formateur"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Le type de formateur est obligatoire",
                },
              ]}
            >
              <Select 
                placeholder="Sélectionner un type" 
                size="large"
                onChange={handleTypeChange}
              >
                <Select.Option value="interne">Interne</Select.Option>
                <Select.Option value="externe">Externe</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.type !== currentValues.type
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("type") === "externe" ? (
                  <Form.Item
                    label="Employeur"
                    name="idEmployeur"
                    rules={[
                      {
                        required: true,
                        message: "L'employeur est obligatoire pour un formateur externe",
                      },
                    ]}
                  >
                    <Select placeholder="Sélectionner un employeur" size="large">
                      {employeurs.map((emp) => (
                        <Select.Option key={emp.id} value={emp.id}>
                          {emp.nomEmployeur || emp.nomemployeur}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : null
              }
            </Form.Item>

            <Form.Item>
              <Flex gap="middle">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="btn full-width"
                >
                  Mettre à jour
                </Button>
                <Button
                  size="large"
                  className="btn full-width"
                  onClick={() => navigate("/formateurs")}
                >
                  Annuler
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </Card>
  );
}

export default UpdateFormateur;