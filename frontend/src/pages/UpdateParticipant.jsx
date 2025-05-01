import React, { useEffect, useState } from "react";
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
  Spin
} from "antd";
import "../App.css";

function UpdateParticipant() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [structures, setStructures] = useState([]);
  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effet pour charger les données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Charger les structures et profils
        const [structuresRes, profilsRes] = await Promise.all([
          api.get("http://localhost:8081/api/structures"),
          api.get("http://localhost:8081/api/profils")
        ]);
        
        setStructures(structuresRes.data);
        setProfils(profilsRes.data);
        
        // Charger les données du participant
        const participantRes = await api.get(`http://localhost:8081/api/participants/${id}`);
        const participant = participantRes.data;
        
        console.log("Données du participant:", participant);
        
        // Remplir le formulaire avec les données du participant
        form.setFieldsValue({
          id: participant.id,
          nom: participant.nom,
          prenom: participant.prenom,
          email: participant.email,
          tel: participant.tel.toString(), // Convertir le numéro en string pour le formulaire
          structureId: participant.structure?.id,
          profilId: participant.profil?.id
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        message.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  // Vérifier si l'email existe déjà (à l'exception de l'email actuel)
  const checkEmailExists = async (email) => {
    if (!email || email === form.getFieldValue('originalEmail')) {
      return false;
    }
    
    try {
      const response = await api.get(`http://localhost:8081/api/participants/check-email?email=${encodeURIComponent(email)}`);
      return response.data.exists; // Supposons que l'API renvoie { exists: true/false }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      return false;
    }
  };

  const validateEmail = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Veuillez entrer l\'email'));
    }
    
    // Valider le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error('Email invalide'));
    }
    
    // Ignorer la vérification si c'est le même email
    if (value === form.getFieldValue('originalEmail')) {
      return Promise.resolve();
    }
    
    // Vérifier si l'email existe déjà
    const exists = await checkEmailExists(value);
    if (exists) {
      return Promise.reject(new Error('Cet email est déjà utilisé'));
    }
    
    return Promise.resolve();
  };

  // Gestion de la soumission du formulaire
  const onFinish = (values) => {
    // Formater les données pour le backend
    const participantData = {
      id: parseInt(values.id, 10),
      nom: values.nom,
      prenom: values.prenom,
      email: values.email,
      tel: parseInt(values.tel, 10),
      structure: { id: parseInt(values.structureId, 10) },
      profil: { id: parseInt(values.profilId, 10) }
    };

    console.log("Données envoyées pour mise à jour:", participantData);

    api.put(`http://localhost:8081/api/participants/${id}`, participantData)
      .then(() => {
        message.success("Participant mis à jour avec succès !");
        navigate("/participants");
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour:", err.response?.data || err);
        
        // Gérer l'erreur d'email en double si le backend renvoie une erreur spécifique
        if (err.response?.data?.message?.includes("email")) {
          message.error("Cet email est déjà utilisé. Veuillez en utiliser un autre.");
          form.setFields([
            {
              name: 'email',
              errors: ['Cet email est déjà utilisé']
            }
          ]);
        } else {
          message.error("Échec de la mise à jour du participant");
        }
      });
  };

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Modifier un participant
          </Typography.Title>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="large" />
              <p>Chargement des données...</p>
            </div>
          ) : (
            <Form
              layout="vertical"
              form={form}
              autoComplete="off"
              onFinish={onFinish}
              initialValues={{
                originalEmail: '' // Pour stocker l'email original
              }}
            >
              <Form.Item
                label="ID"
                name="id"
                hidden
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="originalEmail"
                hidden
              >
                <Input />
              </Form.Item>

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
                  { validator: validateEmail }
                ]}
                validateTrigger={['onChange', 'onBlur']}
              >
                <Input 
                  size="large" 
                  placeholder="Entrer l'email" 
                  onChange={(e) => {
                    // Stocker l'email original pour la comparaison
                    if (!form.getFieldValue('originalEmail')) {
                      form.setFieldsValue({ originalEmail: e.target.value });
                    }
                  }}
                />
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
                    pattern: /^\d+$/,
                    message: "Veuillez entrer uniquement des chiffres",
                  },
                ]}
              >
                <Input size="large" placeholder="Entrer le numéro de téléphone" />
              </Form.Item>

              <Form.Item
                label="Structure"
                name="structureId"
                rules={[
                  {
                    required: true,
                    message: "La structure est obligatoire",
                  },
                ]}
              >
                <Select 
                  placeholder="Sélectionner une structure" 
                  size="large"
                  loading={structures.length === 0}
                >
                  {structures.map((structure) => (
                    <Select.Option key={structure.id} value={structure.id}>
                      {structure.libelle}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Profil"
                name="profilId"
                rules={[
                  {
                    required: true,
                    message: "Le profil est obligatoire",
                  },
                ]}
              >
                <Select 
                  placeholder="Sélectionner un profil" 
                  size="large"
                  loading={profils.length === 0}
                >
                  {profils.map((profil) => (
                    <Select.Option key={profil.id} value={profil.id}>
                      {profil.libelle}
                    </Select.Option>
                  ))}
                </Select>
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
                    onClick={() => navigate("/participants")}
                  >
                    Annuler
                  </Button>
                </Flex>
              </Form.Item>
            </Form>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}

export default UpdateParticipant;