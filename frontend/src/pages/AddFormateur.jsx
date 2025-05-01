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

function AddFormateur() {
  const [form] = Form.useForm();
  const [employeurForm] = Form.useForm();
  const navigate = useNavigate();

  const [employeurs, setEmployeurs] = useState([]);
  const [formType, setFormType] = useState("interne");
  const [isEmployeurModalVisible, setIsEmployeurModalVisible] = useState(false);
  const [employeurLoading, setEmployeurLoading] = useState(false);

  useEffect(() => {
    // Charger la liste des employeurs
    fetchEmployeurs();
  }, []);

  const fetchEmployeurs = () => {
    api
      .get("http://localhost:8081/api/employeurs")
      .then((res) => {
        console.log("Employeurs reçus:", res.data);
        setEmployeurs(res.data);
      })
      .catch((err) => console.error("Erreur employeurs:", err));
  };

  const handleTypeChange = (value) => {
    setFormType(value);
    // Si on change de interne à externe, on reset la valeur de l'employeur
    if (value === "interne") {
      form.setFieldsValue({ idEmployeur: undefined });
    }
  };

  const handleSubmit = (values) => {
    console.log("Valeurs soumises:", values);
    
    // Si le type est interne, on réinitialise l'employeur
    const formateurToSubmit = { 
      nom: values.nom,
      prenom: values.prenom,
      email: values.email,
      tel: values.tel,
      type: values.type
    };
    
    // Ajouter l'employeur seulement s'il est externe
    if (values.type === "externe" && values.idEmployeur) {
      formateurToSubmit.employeur = { id: values.idEmployeur };
    }
    
    console.log("Données formatées pour l'API:", formateurToSubmit);
    
    api
      .post("http://localhost:8081/api/formateurs", formateurToSubmit)
      .then(() => {
        message.success("Formateur ajouté avec succès !");
        navigate("/formateurs");
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout:", err);
        message.error("Email existe déja!");
      });
  };

  // Fonctions pour gérer le modal d'ajout d'employeur
  const showEmployeurModal = () => {
    setIsEmployeurModalVisible(true);
    employeurForm.resetFields();
  };

  const handleCancelEmployeurModal = () => {
    setIsEmployeurModalVisible(false);
  };

  const handleEmployeurSubmit = () => {
    employeurForm.validateFields()
      .then(values => {
        setEmployeurLoading(true);
        
        // Créer le nouvel employeur
        api.post("http://localhost:8081/api/employeurs", {
          nomEmployeur: values.nomEmployeur
        })
          .then(response => {
            console.log("Employeur ajouté:", response.data);
            message.success("Employeur ajouté avec succès !");
            setIsEmployeurModalVisible(false);
            
            // Rafraîchir la liste des employeurs
            fetchEmployeurs();
            
            // Pré-sélectionner le nouvel employeur
            setTimeout(() => {
              form.setFieldsValue({
                idEmployeur: response.data.id
              });
            }, 500); // Attendre un peu pour s'assurer que les employeurs sont chargés
          })
          .catch(error => {
            console.error("Erreur lors de l'ajout de l'employeur:", error);
            message.error("Erreur lors de l'ajout de l'employeur");
          })
          .finally(() => {
            setEmployeurLoading(false);
          });
      });
  };

  // Fonction pour déboguer les changements de champs
  const onFieldsChange = (changedFields, allFields) => {
    console.log("Champ modifié:", changedFields);
    console.log("Toutes les valeurs:", form.getFieldsValue());
    console.log("Valeur de idEmployeur:", form.getFieldValue('idEmployeur'));
  };

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Ajouter un formateur
          </Typography.Title>
    
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleSubmit}
            onFieldsChange={onFieldsChange}
            initialValues={{
              nom: "",
              prenom: "",
              email: "",
              tel: "",
              type: "interne"
            }}
          >
            <Form.Item
              label="Nom"
              name="nom"
              rules={[{ required: true, message: "Le nom est obligatoire" }]}
            >
              <Input placeholder="Nom" size="large" />
            </Form.Item>

            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[{ required: true, message: "Le prénom est obligatoire" }]}
            >
              <Input placeholder="Prénom" size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "L'email est obligatoire" },
                { type: "email", message: "Format d'email invalide" }
              ]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              label="Téléphone"
              name="tel"
              rules={[{ 
                required: true, 
                message: "Le numéro doit contenir 8 chiffres",
                pattern: /^[0-9]{8}$/
              }]}
            >
              <Input placeholder="Téléphone" size="large" />
            </Form.Item>

            <Form.Item
              label="Type de formateur"
              name="type"
              rules={[{ required: true, message: "Veuillez choisir un type" }]}
            >
              <Select 
                placeholder="Type de formateur" 
                size="large"
                onChange={handleTypeChange}
              >
                <Select.Option value="interne">Interne</Select.Option>
                <Select.Option value="externe">Externe</Select.Option>
              </Select>
            </Form.Item>

            {formType === "externe" && (
              <Form.Item
                label="Employeur"
                name="idEmployeur"
                rules={[{ required: true, message: "Veuillez choisir un employeur" }]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <Flex>
                  <Select 
                    placeholder="Sélectionner un employeur" 
                    size="large"
                    style={{ flex: 1 }}
                    loading={employeurs.length === 0}
                    optionFilterProp="children"
                    onChange={(value) => {
                      console.log("Employeur sélectionné:", value);
                      form.setFieldsValue({ idEmployeur: value });
                    }}
                  >
                    {employeurs.map((emp) => (
                      <Select.Option key={emp.id} value={emp.id}>
                        {emp.nomEmployeur}
                      </Select.Option>
                    ))}
                  </Select>
                  <Button 
                    type="default" 
                    icon={<PlusOutlined />} 
                    onClick={showEmployeurModal}
                    style={{ marginLeft: '8px' }}
                    size="large"
                  />
                </Flex>
              </Form.Item>
            )}

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
                onClick={() => navigate("/formateurs")}
              >
                Annuler
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>

      {/* Modal pour ajouter un nouvel employeur */}
      <Modal
        title="Ajouter un nouvel employeur"
        open={isEmployeurModalVisible}
        onCancel={handleCancelEmployeurModal}
        footer={[
          <Button key="cancel" onClick={handleCancelEmployeurModal}>
            Annuler
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={employeurLoading} 
            onClick={handleEmployeurSubmit}
          >
            Ajouter
          </Button>
        ]}
      >
        <Form
          form={employeurForm}
          layout="vertical"
        >
          <Form.Item
            name="nomEmployeur"
            label="Nom de l'employeur"
            rules={[{ required: true, message: 'Veuillez entrer le nom de l\'employeur' }]}
          >
            <Input placeholder="Nom de l'employeur" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default AddFormateur;