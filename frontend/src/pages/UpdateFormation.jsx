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
  InputNumber,
  Typography,
  message,
} from "antd";
import "../App.css";

function UpdateFormation() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userRole = "simple";
  const [domaines, setDomaines] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [formationParticipants, setFormationParticipants] = useState([]);
  const currentYear = new Date().getFullYear();

  // Effet pour charger les données
  useEffect(() => {
    // Charger les données de la formation
    api
      .get(`http://localhost:8081/api/formations/${id}`)
      .then((res) => {
        form.setFieldsValue({
          ...res.data,
          idDomaine: res.data.idDomaine || res.data.domaine?.id,
          idFormateur: res.data.idFormateur || res.data.formateur?.id,
        });
        
        // Si la formation a des participants, stocker leurs IDs
        if (res.data.participants && Array.isArray(res.data.participants)) {
          const participantIds = res.data.participants.map(p => p.id);
          form.setFieldsValue({ participantIds });
          setFormationParticipants(participantIds);
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Erreur lors du chargement des données de la formation");
      });

    // Charger la liste des domaines
    api
      .get("http://localhost:8081/api/domaines")
      .then((res) => setDomaines(res.data))
      .catch((err) => {
        console.error(err);
        message.error("Erreur lors du chargement des domaines");
      });

    // Charger la liste des formateurs
    api
      .get("http://localhost:8081/api/formateurs")
      .then((res) => setFormateurs(res.data))
      .catch((err) => {
        console.error(err);
        message.error("Erreur lors du chargement des formateurs");
      });
      
    // Charger la liste des participants
    api
      .get("http://localhost:8081/api/participants")
      .then((res) => {
        console.log("Participants chargés:", res.data);
        // Extraction des données nécessaires pour éviter la récursion
        if (Array.isArray(res.data)) {
          const simplifiedParticipants = res.data.map(participant => ({
            id: participant.id,
            nom: participant.nom,
            prenom: participant.prenom,
            email: participant.email,
            tel: participant.tel,
            structure: participant.structure ? {
              id: participant.structure.id,
              libelle: participant.structure.libelle
            } : null,
            profil: participant.profil ? {
              id: participant.profil.id,
              libelle: participant.profil.libelle
            } : null
          }));
          setParticipants(simplifiedParticipants);
        } else {
          console.warn("Les données de participants ne sont pas un tableau:", res.data);
          setParticipants([]);
        }
      })
      .catch((err) => {
        console.error("Erreur participants:", err);
        setParticipants([]);
      });
      
    // Charger les participants associés à cette formation
    api
      .get(`http://localhost:8081/api/formation-participants/formation/${id}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          const currentParticipantIds = res.data.map(p => p.participantId);
          setFormationParticipants(currentParticipantIds);
          form.setFieldsValue({ participantIds: currentParticipantIds });
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des participants de la formation:", err);
      });
  }, [id, form]);

  // Gestion de la soumission du formulaire
  const onFinish = async (values) => {
    try {
      // Convertir les valeurs numériques
      const formationToSubmit = {
        ...values,
        annee: Number(values.annee),
        duree: Number(values.duree),
        budget: Number(values.budget),
        domaine: { id: values.idDomaine },
        formateur: { id: values.idFormateur }
      };
      
      // Mise à jour de la formation
      await api.put(`http://localhost:8081/api/formations/${id}`, formationToSubmit);
      
      // Gestion des participants
      const selectedParticipantIds = values.participantIds || [];
      const participantsToAdd = selectedParticipantIds.filter(
        pId => !formationParticipants.includes(pId)
      );
      const participantsToRemove = formationParticipants.filter(
        pId => !selectedParticipantIds.includes(pId)
      );
      
      // Ajouter les nouveaux participants
      for (const participantId of participantsToAdd) {
        try {
          const formationParticipant = {
            id: {
              formationId: parseInt(id),
              participantId: parseInt(participantId)
            },
            present: true,
            formation: { id: parseInt(id) },
            participant: { id: parseInt(participantId) }
          };
          
          await api.post("http://localhost:8081/api/formation-participants", formationParticipant);
        } catch (error) {
          console.error(`Erreur lors de l'ajout du participant ${participantId}:`, error);
          
          // Tentative avec l'API alternative
          try {
            await api.post(`http://localhost:8081/api/formations/${id}/participants/${participantId}`);
          } catch (altError) {
            console.error(`Erreur avec la méthode alternative pour ${participantId}:`, altError);
          }
        }
      }
      
// Supprimer les participants qui ne sont plus sélectionnés
for (const participantId of participantsToRemove) {
  try {
    // Convertir explicitement les valeurs en nombres
    const formationIdNum = parseInt(id); // Utiliser 'id' du useParams() 
    const participantIdNum = parseInt(participantId);
    
    // Utiliser ces valeurs dans l'URL
    await api.delete(`http://localhost:8081/api/formation-participants/${formationIdNum}/${participantIdNum}`);
    console.log(`Participant ${participantIdNum} supprimé avec succès de la formation ${formationIdNum}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du participant ${participantId} de la formation ${id}:`, error);
    
    // Tentative avec l'API alternative
    try {
      await api.delete(`http://localhost:8081/api/formations/${id}/participants/${participantId}`);
      console.log(`Participant ${participantId} supprimé avec succès via l'API alternative`);
    } catch (altError) {
      console.error(`Échec de la suppression via l'API alternative:`, altError);
    }
  }
}
      
      message.success("Formation mise à jour avec succès !");
      navigate("/formations");
    } catch (err) {
      console.error(err);
      message.error("Échec de la mise à jour de la formation");
    }
  };

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Modifier une formation
          </Typography.Title>
          <Form
            layout="vertical"
            form={form}
            autoComplete="off"
            onFinish={onFinish}
          >
            <Form.Item
              label="Titre"
              name="titre"
              rules={[
                {
                  required: true,
                  message: "Le titre est obligatoire",
                },
              ]}
            >
              <Input size="large" placeholder="Entrer le titre" />
            </Form.Item>

            <Form.Item
              label="Année"
              name="annee"
              rules={[
                {
                  required: true,
                  message: "L'année est obligatoire",
                },
                {
                  type: "number",
                  min: currentYear - 1,
                  max: currentYear + 5,
                  message: `L'année doit être entre ${currentYear - 1} et ${currentYear + 5}`,
                },
              ]}
            >
              <InputNumber
                size="large"
                placeholder="Entrer l'année"
                min={currentYear - 1}
                max={currentYear + 5}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Durée (jours)"
              name="duree"
              rules={[
                {
                  required: true,
                  message: "La durée est obligatoire",
                },
                {
                  type: "number",
                  min: 1,
                  max: 30,
                  message: "La durée doit être entre 1 et 30 jours",
                },
              ]}
            >
              <InputNumber
                size="large"
                placeholder="Entrer la durée"
                min={1}
                max={30}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Domaine"
              name="idDomaine"
              rules={[
                {
                  required: true,
                  message: "Le domaine est obligatoire",
                },
              ]}
            >
              <Select placeholder="Sélectionner un domaine" size="large">
                {domaines.map((domaine) => (
                  <Select.Option key={domaine.id} value={domaine.id}>
                    {domaine.libelle}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Budget (DT)"
              name="budget"
              rules={[
                {
                  required: true,
                  message: "Le budget est obligatoire",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Le budget doit être un nombre positif",
                },
              ]}
            >
              <InputNumber
                size="large"
                placeholder="Entrer le budget"
                min={0}
                step={0.01}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Formateur"
              name="idFormateur"
              rules={[
                {
                  required: true,
                  message: "Le formateur est obligatoire",
                },
              ]}
            >
              <Select placeholder="Sélectionner un formateur" size="large">
                {formateurs.map((formateur) => (
                  <Select.Option key={formateur.id} value={formateur.id}>
                    {formateur.nom} {formateur.prenom} ({formateur.type})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              label="Participants"
              name="participantIds"
              rules={[{ required: false }]}
            >
              <Select 
                mode="multiple" 
                placeholder="Sélectionner des participants" 
                size="large"
                optionFilterProp="children"
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {Array.isArray(participants) && participants.length > 0 ? (
                  participants.map((participant) => (
                    <Select.Option key={participant.id} value={participant.id}>
                      {participant.nom} {participant.prenom} - {participant.email}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option disabled value="">Aucun participant disponible</Select.Option>
                )}
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
                  onClick={() => navigate("/formations")}
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

export default UpdateFormation;