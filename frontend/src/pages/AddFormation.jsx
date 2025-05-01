import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig"; 
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Typography,
  Flex,
  InputNumber,
  message,
  Modal,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "../App.css";

function AddFormation() {
  const [form] = Form.useForm();
  const [domainForm] = Form.useForm();
  const navigate = useNavigate();
  const userRole = "admin";

  const [domaines, setDomaines] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isDomainModalVisible, setIsDomainModalVisible] = useState(false);
  const [addingDomain, setAddingDomain] = useState(false);
  const currentYear = new Date().getFullYear();

  
  // Puis vérifiez que l'appel est correct
 
  const fetchDomaines = () => {
    api
      .get("http://localhost:8081/api/domaines")
      .then((res) => setDomaines(res.data))
      .catch((err) => console.error("Erreur domaines:", err));
  };

  useEffect(() => {
    // Charger la liste des domaines
    fetchDomaines();
    
    // Charger la liste des formateurs
    api
      .get("http://localhost:8081/api/formateurs")
      .then((res) => setFormateurs(res.data || []))
      .catch((err) => {
        console.error("Erreur formateurs:", err);
        setFormateurs([]);
      });
    
    // Charger la liste des participants
    api
      .get("http://localhost:8081/api/participants")
      .then((res) => {
        console.log("Réponse API participants (brute):", res.data);
        
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
          console.log("Participants simplifiés:", simplifiedParticipants);
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
  }, []);
  const handleSubmit = async (values) => {
    console.log("Form values on submit:", values);
    try {
        const selectedParticipantIds = values.participantIds || [];
        console.log("Participants sélectionnés:", selectedParticipantIds);
        
        const formationToSubmit = {
            titre: values.titre,
            annee: Number(values.annee),
            duree: Number(values.duree),
            budget: Number(values.budget),
            domaine: { id: values.idDomaine },
            formateur: { id: values.idFormateur }
        };
        console.log("Formation à soumettre:", formationToSubmit);

        const formationResponse = await api.post("http://localhost:8081/api/formations", formationToSubmit);
        const newFormationId = formationResponse.data.id;
        console.log("Formation créée avec ID:", newFormationId);

        // Ajout des participants
        if (selectedParticipantIds.length > 0) {
            for (const participantId of selectedParticipantIds) {
                try {
                    console.log(`Tentative d'ajout du participant ID:${participantId} à la formation ID:${newFormationId}`);
                    
                    // Utiliser l'API directe pour ajouter le participant, sans passer par l'endpoint /assign
                    const formationParticipant = {
                        id: {
                            formationId: newFormationId,
                            participantId: parseInt(participantId)
                        },
                        present: true,
                        formation: { id: newFormationId },
                        participant: { id: parseInt(participantId) }
                    };
                    
                    // Essayer d'abord avec l'API standard
                    const response = await api.post("http://localhost:8081/api/formation-participants", formationParticipant);
                    console.log(`Participant ${participantId} ajouté avec succès:`, response.data);
                } catch (participantError) {
                    console.error(`Erreur lors de l'ajout du participant ${participantId}:`, participantError);
                    
                    // Si la première méthode échoue, essayer l'API alternative
                    try {
                        const formationIdParam = newFormationId;
                        const participantIdParam = parseInt(participantId);
                        console.log(`Tentative alternative d'ajout du participant ${participantIdParam} à la formation ${formationIdParam}`);
                        
                        const response = await api.post(`http://localhost:8081/api/formations/${formationIdParam}/participants/${participantIdParam}`);
                        console.log(`Participant ${participantId} ajouté avec succès via la méthode alternative:`, response.data);
                    } catch (altError) {
                        console.error(`Erreur avec la méthode alternative pour ${participantId}:`, altError);
                    }
                }
            }
        }

        message.success("Formation ajoutée avec succès !");
        navigate("/formations");
    } catch (err) {
        console.error("Erreur lors de l'ajout de la formation:", err);
        message.error("Erreur lors de l'ajout : " + (err.response?.data?.message || err.message));
    }
};
  const showDomainModal = () => {
    setIsDomainModalVisible(true);
    domainForm.resetFields();
  };

  const handleDomainCancel = () => {
    setIsDomainModalVisible(false);
  };

  const handleDomainSubmit = () => {
    domainForm
      .validateFields()
      .then((values) => {
        setAddingDomain(true);
        
        api
          .post("http://localhost:8081/api/domaines", { libelle: values.libelle })
          .then((response) => {
            message.success("Domaine ajouté avec succès !");
            setIsDomainModalVisible(false);
            fetchDomaines();
            setTimeout(() => {
              form.setFieldsValue({
                idDomaine: response.data.id
              });
            }, 500);
          })
          .catch((err) => {
            console.error("Erreur lors de l'ajout du domaine:", err);
            message.error("Erreur lors de l'ajout du domaine : " + 
              (err.response?.data?.message || err.message));
            })
            .finally(() => {
              setAddingDomain(false);
            });
        });
    };

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Ajouter une formation
          </Typography.Title>
    
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleSubmit}
            initialValues={{
              titre: "",
              annee: currentYear,
              duree: 1,
              idDomaine: "",
              budget: "",
              idFormateur: "",
              participantIds: []
            }}
          >
            <Form.Item
              label="Titre"
              name="titre"
              rules={[{ required: true, message: "Le titre est obligatoire" }]}
            >
              <Input placeholder="Titre de la formation" size="large" />
            </Form.Item>

            <Form.Item
              label="Année"
              name="annee"
              rules={[{ 
                required: true, 
                message: `L'année doit être entre ${currentYear} et ${currentYear + 5}`,
                type: "number",
                min: currentYear,
                max: currentYear + 5
              }]}
            >
              <InputNumber 
                placeholder="Année" 
                size="large" 
                min={currentYear}
                max={currentYear + 5}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="Durée (jours)"
              name="duree"
              rules={[{ 
                required: true, 
                message: "La durée doit être entre 1 et 30 jours",
                type: "number",
                min: 1,
                max: 30
              }]}
            >
              <InputNumber 
                placeholder="Durée en jours" 
                size="large" 
                min={1}
                max={30}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="Domaine"
              name="idDomaine"
              rules={[{ required: true, message: "Veuillez choisir un domaine" }]}
            >
              <Flex>
                <Select 
                  placeholder="Sélectionner un domaine" 
                  size="large"
                  style={{ flex: 1 }}
                  onChange={(value) => form.setFieldsValue({ idDomaine: value })}
                >
                  {Array.isArray(domaines) && domaines.map((domaine) => (
                    <Select.Option key={domaine.id} value={domaine.id}>
                      {domaine.libelle}
                    </Select.Option>
                  ))}
                </Select>
                <Button 
                  type="default" 
                  icon={<PlusOutlined />}
                  onClick={showDomainModal} 
                  style={{ marginLeft: '8px' }}
                  size="large"
                />
              </Flex>
            </Form.Item>

            <Form.Item
              label="Budget (DT)"
              name="budget"
              rules={[{ 
                required: true, 
                message: "Le budget doit être un nombre positif",
                type: "number",
                min: 0
              }]}
            >
              <InputNumber 
                placeholder="Budget" 
                size="large" 
                min={0}
                step={0.01}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="Formateur"
              name="idFormateur"
              rules={[{ required: true, message: "Veuillez choisir un formateur" }]}
            >
              <Select placeholder="Sélectionner un formateur" size="large">
                {Array.isArray(formateurs) && formateurs.map((formateur) => (
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
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="btn full-width"
              >
                Enregistrer
              </Button>
            </Form.Item>
            
            <Form.Item>
              <Button
                type="default"
                size="large"
                className="btn full-width"
                onClick={() => navigate("/formations")}
              >
                Annuler
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>

      {/* Modal pour ajouter un nouveau domaine */}
      <Modal
        title="Ajouter un nouveau domaine"
        open={isDomainModalVisible}
        onCancel={handleDomainCancel}
        footer={[
          <Button key="cancel" onClick={handleDomainCancel}>
            Annuler
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={addingDomain}
            onClick={handleDomainSubmit}
          >
            Ajouter
          </Button>,
        ]}
      >
        <Form form={domainForm} layout="vertical">
          <Form.Item
            name="libelle"
            label="Libellé du domaine"
            rules={[
              { required: true, message: "Veuillez saisir le libellé du domaine" },
              { 
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  const exists = domaines.some(
                    (domaine) => domaine.libelle.toLowerCase() === value.toLowerCase()
                  );
                  
                  return exists 
                    ? Promise.reject(new Error("Ce domaine existe déjà")) 
                    : Promise.resolve();
                }
              }
            ]}
          >
            <Input placeholder="Saisir le libellé du domaine" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default AddFormation;