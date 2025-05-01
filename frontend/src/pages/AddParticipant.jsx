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
  message,
  Modal
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "../App.css";

function AddParticipant() {
  const [form] = Form.useForm();
  const [profilForm] = Form.useForm();
  const navigate = useNavigate();

  const [structures, setStructures] = useState([]);
  const [profils, setProfils] = useState([]);
  const [isProfilModalVisible, setIsProfilModalVisible] = useState(false);
  const [profilLoading, setProfilLoading] = useState(false);

  // Charger les structures et profils au chargement du composant
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get("http://localhost:8081/api/structures")
      .then(res => setStructures(res.data))
      .catch(err => console.error("Erreur structures :", err));

    fetchProfils();
  };

  const fetchProfils = () => {
    api.get("http://localhost:8081/api/profils")
      .then(res => {
        console.log("Profils reçus:", res.data);
        setProfils(res.data);
      })
      .catch(err => console.error("Erreur profils :", err));
  };

  const handleSubmit = (values) => {
    console.log("Valeurs du formulaire soumises:", values);
    
    // Adapter les noms des champs pour correspondre au backend
    const participant = {
      nom: values.nomParticipant,
      prenom: values.prenomParticipant,
      email: values.emailParticipant,
      tel: parseInt(values.telParticipant, 10), // Convertir en entier
      structure: { id: values.idStructure },
      profil: { id: values.idProfil }
    };

    console.log("Données envoyées à l'API:", participant);

    api.post("http://localhost:8081/api/participants", participant)
      .then(() => {
        message.success("Participant ajouté avec succès !");
        navigate("/participants"); // Redirige vers la liste
      })
      .catch(err => {
        console.error("Erreur lors de l'ajout du participant:", err);
        message.error("Email déja existant !");
      });
  };

  const showProfilModal = () => {
    setIsProfilModalVisible(true);
    profilForm.resetFields();
  };

  const handleCancelProfilModal = () => {
    setIsProfilModalVisible(false);
  };

  const handleProfilSubmit = () => {
    profilForm.validateFields()
      .then(values => {
        setProfilLoading(true);
        
        // Créer le nouveau profil
        api.post("http://localhost:8081/api/profils", {
          libelle: values.libelleProfil
        })
          .then(response => {
            console.log("Profil ajouté:", response.data);
            message.success("Profil ajouté avec succès !");
            setIsProfilModalVisible(false);
            
            // Rafraîchir la liste des profils
            fetchProfils();
            
            // Pré-sélectionner le nouveau profil
            setTimeout(() => {
              form.setFieldsValue({
                idProfil: response.data.id
              });
            }, 500); // Attendre un peu pour s'assurer que les profils sont chargés
          })
          .catch(error => {
            console.error("Erreur lors de l'ajout du profil:", error);
            message.error("Erreur lors de l'ajout du profil");
          })
          .finally(() => {
            setProfilLoading(false);
          });
      });
  };

  // Débogage des valeurs du formulaire
  const onFieldsChange = (changedFields, allFields) => {
    console.log("Champ modifié:", changedFields);
    console.log("Toutes les valeurs:", form.getFieldsValue());
    console.log("Type de idProfil:", typeof form.getFieldValue('idProfil'));
console.log("Valeur de idProfil:", form.getFieldValue('idProfil'));
  };

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Ajouter un participant
          </Typography.Title>
    
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleSubmit}
            onFieldsChange={onFieldsChange}
          >
      
            <Form.Item
              label="Nom"
              name="nomParticipant"
              rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
              <Input placeholder="Nom" size="large" />
            </Form.Item>

            <Form.Item
              label="Prénom"
              name="prenomParticipant"
              rules={[{ required: true, message: "Veuillez entrer le prénom" }]}
            >
              <Input placeholder="Prénom" size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="emailParticipant"
              rules={[
                { required: true, message: "Veuillez entrer l'email" },
                { type: "email", message: "Email invalide" }
              ]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              label="Téléphone"
              name="telParticipant"
              rules={[
                { required: true, message: "Veuillez entrer le téléphone" },
                { pattern: /^\d+$/, message: "Veuillez entrer uniquement des chiffres" }
              ]}
            >
              <Input placeholder="Téléphone" size="large" />
            </Form.Item>

            <Form.Item
              label="Structure"
              name="idStructure"
              rules={[{ required: true, message: "Veuillez choisir une structure" }]}
            >
              <Select
                placeholder="Sélectionner une structure"
                size="large"
                loading={structures.length === 0}
                optionFilterProp="children"
              >
                {structures.map(structure => (
                  <Select.Option key={structure.id} value={structure.id}>
                    {structure.libelle}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Profil"
              name="idProfil"
              rules={[{ required: true, message: "Veuillez choisir un profil" }]}
            >
              <Flex>
                <Select 
                  placeholder="Choisir un profil" 
                  size="large" 
                  style={{ flex: 1 }}
                  loading={profils.length === 0}
                  optionFilterProp="children"
                  allowClear
                  onChange={(value) => {
                    console.log("Profil sélectionné:", value);
                    form.setFieldsValue({ idProfil: value });
                  }}
                >
                  {profils.map(profil => (
                    <Select.Option key={profil.id} value={profil.id}>
                      {profil.libelle}
                    </Select.Option>
                  ))}
                </Select>
                <Button 
                  type="default" 
                  icon={<PlusOutlined />} 
                  onClick={showProfilModal}
                  style={{ marginLeft: '8px' }}
                  size="large"
                />
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="btn full-width"
              >
                Ajouter
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>

      {/* Modal pour ajouter un nouveau profil */}
      <Modal
        title="Ajouter un nouveau profil"
        open={isProfilModalVisible}
        onCancel={handleCancelProfilModal}
        footer={[
          <Button key="cancel" onClick={handleCancelProfilModal}>
            Annuler
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={profilLoading} 
            onClick={handleProfilSubmit}
          >
            Ajouter
          </Button>
        ]}
      >
        <Form
          form={profilForm}
          layout="vertical"
        >
          <Form.Item
            name="libelleProfil"
            label="Libellé du profil"
            rules={[{ required: true, message: 'Veuillez entrer le libellé du profil' }]}
          >
            <Input placeholder="Libellé du profil" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default AddParticipant;