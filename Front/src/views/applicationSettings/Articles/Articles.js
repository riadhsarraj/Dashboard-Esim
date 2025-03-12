import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CTable,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const columns = [
  { key: "name", label: "Nom" },
  { key: "description", label: "Description" },
  { key: "barcode", label: "Code-barres" },
  { key: "price", label: "Prix" },
  { key: "actions", label: "Action" },
  { key: "images", label: "Images" },
  { key: "filterConfig", label: "Filtrer la configuration" },
];

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ name: "", description: "", barcode: "", price: 0, images: [] });
  const [editArticle, setEditArticle] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getArticles");
      setArticles(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des articles");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAddArticle = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createArticle", newArticle);
      if (response.status === 201) {
        setShowModal(false);
        setNewArticle({ name: "", description: "", barcode: "", price: 0, images: [] });
        fetchArticles();
      }
      alert("Article créé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article:", error);
      alert("Échec de la création de l'article");
    }
  };

  const handleUpdateArticle = async (name, updatedData) => {
    try {
      const encodedName = encodeURIComponent(name);
      const response = await axios.put(`http://localhost:5000/updateArticleByName/${encodedName}`, updatedData);
      if (response.status === 200) {
        alert("Article mis à jour avec succès");
        fetchArticles();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article:", error);
      alert("Échec de la mise à jour de l'article");
    }
  };

  const handleDeleteArticle = async (name) => {
    try {
      const encodedName = encodeURIComponent(name);
      const response = await axios.delete(`http://localhost:5000/deleteArticleByName/${encodedName}`);
      if (response.status === 200) {
        alert("Article supprimé avec succès");
        fetchArticles();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      alert("Échec de la suppression de l'article");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editArticle) {
      setEditArticle((prevArticle) => ({
        ...prevArticle,
        [name]: value,
      }));
    } else {
      setNewArticle((prevArticle) => ({
        ...prevArticle,
        [name]: value,
      }));
    }
  };

  const openEditModal = (article) => {
    setEditArticle(article);
    setShowModal(true);
  };

  const openQRModal = async (article) => {
    try {
      const response = await axios.get(`http://localhost:5000/generateQR/${article.name} - ${article.barcode}`);
      setSelectedArticle({ ...article, qrCode: response.data.qrCode });
      setShowQRModal(true);
    } catch (error) {
      console.error("Erreur lors de la génération du QR Code:", error);
      alert("Erreur lors de la génération du QR Code");
    }
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
        Ajouter un article
      </CButton>
      <h3>Tableau des articles</h3>
      <CTable
        columns={columns}
        items={articles.map((article) => ({
          ...article,
          barcode: <span style={{ color: "pink" }}>🔳</span>,
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => openEditModal(article)}>
                <span style={{ fontSize: "1.2em" }}>✏️</span>
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeleteArticle(article.name)}>
                <span style={{ fontSize: "1.2em" }}>🗑️</span>
              </CButton>
            </div>
          ),
          images: (
            <CButton color="info" size="sm" onClick={() => openQRModal(article)}>
              <span style={{ fontSize: "1.2em" }}>📷</span>
            </CButton>
          ),
          filterConfig: <CButton color="success" size="sm"><span style={{ fontSize: "1.2em" }}>⚙️</span></CButton>,
        }))}
        tableHeadProps={{ color: "light" }}
        striped
        bordered
        hover
      />

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>{editArticle ? "Modifier un article" : "Ajouter un article"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom</CFormLabel>
              <CFormInput
                type="text"
                name="name"
                value={editArticle ? editArticle.name : newArticle.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormInput
                type="text"
                name="description"
                value={editArticle ? editArticle.description : newArticle.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Code-barres</CFormLabel>
              <CFormInput
                type="text"
                name="barcode"
                value={editArticle ? editArticle.barcode : newArticle.barcode}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Prix</CFormLabel>
              <CFormInput
                type="number"
                name="price"
                value={editArticle ? editArticle.price : newArticle.price}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
          <CButton
            color="primary"
            onClick={editArticle ? () => handleUpdateArticle(editArticle.name, editArticle) : handleAddArticle}
          >
            {editArticle ? "Modifier" : "Enregistrer"}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={showQRModal} onClose={() => setShowQRModal(false)}>
        <CModalHeader>
          <CModalTitle>QR Code pour {selectedArticle?.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div style={{ textAlign: "center" }}>
            {selectedArticle?.qrCode && (
              <img src={selectedArticle.qrCode} alt="QR Code" style={{ width: "200px" }} />
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowQRModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ArticleList;