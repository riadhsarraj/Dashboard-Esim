import React, { useEffect, useState } from "react";
import axios from "axios";
import { CTable, CButton, CForm, CFormInput, CFormLabel, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";

const columns = [
  { key: "holderName", label: "Nom du titulaire" },
  { key: "cardNumber", label: "Numéro de carte" },
  { key: "expirationDate", label: "Date d’expiration" },
  { key: "cardType", label: "Type de carte" },
  { key: "email", label: "E-mail associé" },
  { key: "actions", label: "Action" },
];

const ListPayment = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCard, setNewCard] = useState({ holderName: "", cardNumber: "", expirationDate: "", cardType: "", email: "" });
  const [editCard, setEditCard] = useState(null);

  const fetchCards = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getCards");
      setCards(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des cartes");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);
  const handleAddCard = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createCard", newCard);
      if (response.status === 200) {
        setNewCard({ holderName: "", cardNumber: "", expirationDate: "", cardType: "", email: "" });
        setShowModal(false);
        fetchCards();
        alert("Carte de paiement créée avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la carte:", error);
      alert("Échec de la création de la carte");
    }
  };
  const handleUpdateCard = async (cardNumber, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/updateCardByNumber/${cardNumber}`, updatedData);
      if (response.status === 200) {
        setShowModal(false);
        fetchCards();
        alert("Carte de paiement mise à jour avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la carte:", error);
      alert("Échec de la mise à jour de la carte");
    }
  };

  const handleDeleteCard = async (cardNumber) => {
    try {
      const response = await axios.delete(`http://localhost:5000/deleteCardByNumber/${cardNumber}`);
      if (response.status === 200) {
        fetchCards();
        alert("Carte de paiement supprimée avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la carte:", error);
      alert("Échec de la suppression de la carte");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editCard) {
      setEditCard((prevCard) => ({
        ...prevCard,
        [name]: value,
      }));
    } else {
      setNewCard((prevCard) => ({
        ...prevCard,
        [name]: value,
      }));
    }
  };
  const openEditModal = (card) => {
    setEditCard(card);
    setShowModal(true);
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <CButton color="primary" onClick={() => setShowModal(true)}>
        Ajouter une carte de paiement
      </CButton>
      <h3>Liste des Cartes de paiment</h3>
      <CTable
        columns={columns}
        items={cards.map((card) => ({
          ...card,
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => openEditModal(card)}>
              <span style={{ fontSize: "1.2em" }}>✏️</span>
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeleteCard(card.cardNumber)}>
              <span style={{ fontSize: "1.2em" }}>🗑️</span>
              </CButton>
            </div>
          ),
        }))}
        tableHeadProps={{ color: "light" }}
        striped
        bordered
        hover
      />

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>{editCard ? "Modifier une carte de paiement" : "Ajouter une carte de paiement"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom du titulaire</CFormLabel>
              <CFormInput
                type="text"
                name="holderName"
                value={editCard ? editCard.holderName : newCard.holderName}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Numéro de carte</CFormLabel>
              <CFormInput
                type="text"
                name="cardNumber"
                value={editCard ? editCard.cardNumber : newCard.cardNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Date d’expiration</CFormLabel>
              <CFormInput
                type="text"
                name="expirationDate"
                value={editCard ? editCard.expirationDate : newCard.expirationDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Type de carte</CFormLabel>
              <CFormInput
                type="text"
                name="cardType"
                value={editCard ? editCard.cardType : newCard.cardType}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>E-mail associé</CFormLabel>
              <CFormInput
                type="email"
                name="email"
                value={editCard ? editCard.email : newCard.email}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={editCard ? () => handleUpdateCard(editCard.cardNumber, editCard) : handleAddCard}>
            {editCard ? "Modifier" : "Ajouter"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ListPayment;