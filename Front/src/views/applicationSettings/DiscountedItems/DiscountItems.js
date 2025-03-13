import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CTable,
  CButton,
  CForm,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const columns = [
  { key: "article", label: "Article" },
  { key: "reduction", label: "Réduction" },
  { key: "actions", label: "Action" },
];

const ArticleReductions = () => {
  const [articleReductions, setArticleReductions] = useState([]);
  const [articles, setArticles] = useState([]);
  const [reductions, setReductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newArticleReduction, setNewArticleReduction] = useState({ article: "", reduction: "" });
  const [editArticleReduction, setEditArticleReduction] = useState(null);

  // Récupérer les articles, réductions et relations article-réduction
  const fetchData = async () => {
    try {
      const [articleResponse, reductionResponse, articleReductionResponse] = await Promise.all([
        axios.get("http://localhost:5000/articles/getArticles"),
        axios.get("http://localhost:5000/discounts/getReductions"),
        axios.get("http://localhost:5000/discounts/getArticleReductions"),
      ]);
      setArticles(articleResponse.data);
      setReductions(reductionResponse.data);
      setArticleReductions(articleReductionResponse.data);
    } catch (error) {
      setError("Erreur lors de la récupération des données");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ajouter une relation article-réduction
  const handleAddArticleReduction = async () => {
    try {
      const response = await axios.post("http://localhost:5000/discounts/createArticleReduction", newArticleReduction);
      if (response.status === 201) {
        setShowModal(false);
        setNewArticleReduction({ article: "", reduction: "" });
        fetchData();
      }
      alert("Relation article-réduction créée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la relation article-réduction:", error);
      alert("Échec de la création de la relation article-réduction");
    }
  };

  // Modifier une relation article-réduction
  const handleUpdateArticleReduction = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/discounts/updateArticleReduction/${id}`, updatedData);
      if (response.status === 200) {
        alert("Relation article-réduction mise à jour avec succès");
        fetchData();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la relation article-réduction:", error);
      alert("Échec de la mise à jour de la relation article-réduction");
    }
  };

  // Supprimer une relation article-réduction
  const handleDeleteArticleReduction = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/discounts/deleteArticleReduction/${id}`);
      if (response.status === 200) {
        alert("Relation article-réduction supprimée avec succès");
        fetchData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la relation article-réduction:", error);
      alert("Échec de la suppression de la relation article-réduction");
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editArticleReduction) {
      setEditArticleReduction((prevArticleReduction) => ({
        ...prevArticleReduction,
        [name]: value,
      }));
    } else {
      setNewArticleReduction((prevArticleReduction) => ({
        ...prevArticleReduction,
        [name]: value,
      }));
    }
  };

  // Ouvrir le modal pour modifier une relation article-réduction
  const openEditModal = (articleReduction) => {
    setEditArticleReduction(articleReduction);
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
        Ajouter une réduction à l'article
      </CButton>
      <h3>Liste des réductions des articles</h3>
      <CTable
        columns={columns}
        items={articleReductions.map((articleReduction) => ({
          ...articleReduction,
          article: articles.find((article) => article._id === articleReduction.article)?.name || "Article inconnu",
          reduction: reductions.find((reduction) => reduction._id === articleReduction.reduction)?.nom || "Réduction inconnue",
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => openEditModal(articleReduction)}>
                <span style={{ fontSize: "1.2em" }}>✏️</span>
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeleteArticleReduction(articleReduction._id)}>
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
          <CModalTitle>{editArticleReduction ? "Modifier une réduction à l'article" : "Ajouter une réduction à l'article"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Article</CFormLabel>
              <CFormSelect
                name="article"
                value={editArticleReduction ? editArticleReduction.article : newArticleReduction.article}
                onChange={handleInputChange}
              >
                <option value="">Sélectionnez un article</option>
                {articles.map((article) => (
                  <option key={article._id} value={article._id}>
                    {article.name}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Réduction</CFormLabel>
              <CFormSelect
                name="reduction"
                value={editArticleReduction ? editArticleReduction.reduction : newArticleReduction.reduction}
                onChange={handleInputChange}
              >
                <option value="">Sélectionnez une réduction</option>
                {reductions.map((reduction) => (
                  <option key={reduction._id} value={reduction._id}>
                    {reduction.nom}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
          <CButton
            color="primary"
            onClick={editArticleReduction ? () => handleUpdateArticleReduction(editArticleReduction._id, editArticleReduction) : handleAddArticleReduction}
          >
            {editArticleReduction ? "Modifier" : "Enregistrer"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ArticleReductions;