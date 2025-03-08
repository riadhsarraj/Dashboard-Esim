import React, { useState } from 'react';
import { CButton, CCol, CForm, CFormInput, CInputGroup, CInputGroupText, CAlert } from '@coreui/react';

function Plans() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const AddPlan = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await fetch('http://localhost:5000/plans', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la création du plan');
      }
  
      const result = await response.json();
      console.log(result);
      setSuccessMessage('Plan créé avec succès !');
      setErrorMessage('');
  
      e.target.reset();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Erreur lors de la création du plan. Veuillez réessayer.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
      {errorMessage && (
        <CAlert color="danger" className="mb-3">
          {errorMessage}
        </CAlert>
      )}
      <CForm className="row g-3" onSubmit={AddPlan}>
        <CCol md={6}>
          <CFormInput type="text" id="Title" name="Title" label="Title" required />
        </CCol>
        <CCol md={6}>
          <CFormInput type="text" id="Coverage" name="Coverage" label="Coverage" required />
        </CCol>
        <CCol md={6}>
          <CFormInput type="text" id="Data" name="Data" label="Data" required />
        </CCol>
        <CCol md={6}>
          <CFormInput type="text" id="Validity" name="Validity" label="Validity" required />
        </CCol>
        <CInputGroup className="mb-3" style={{ marginTop: "40px" }}>
          <CInputGroupText as="label" htmlFor="inputGroupFile01">
            Upload
          </CInputGroupText>
          <CFormInput type="file" id="inputGroupFile01" name="File" />
        </CInputGroup>
        <CCol md={6}>
          <CFormInput type="text" id="Price" name="Price" label="Price" required />
        </CCol>
        <CCol xs={12} style={{ marginTop: "30px" }}>
          <CButton color="primary" type="submit">
            Add Plan
          </CButton>
        </CCol>
      </CForm>
    </div>
  );
}

export default Plans;