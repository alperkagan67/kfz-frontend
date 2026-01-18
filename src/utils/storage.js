// Hilfsfunktionen für die Datenspeicherung
export const STORAGE_KEYS = {
  CUSTOMER_FORMS: 'kfz_customer_forms'
}

export const saveCustomerForm = (formData) => {
  const forms = getCustomerForms()
  const newForm = {
    id: Date.now(),
    date: new Date().toISOString(),
    status: 'neu',
    customerName: formData.contactName,
    email: formData.email,
    phone: formData.phone,
    vehicle: {
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      mileage: formData.mileage,
      price: formData.price,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      power: formData.power,
      description: formData.description
    },
    images: formData.images.map(file => URL.createObjectURL(file))
  }
  
  forms.unshift(newForm) // Neue Formulare am Anfang hinzufügen
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_FORMS, JSON.stringify(forms))
  return newForm
}

export const getCustomerForms = () => {
  const forms = localStorage.getItem(STORAGE_KEYS.CUSTOMER_FORMS)
  return forms ? JSON.parse(forms) : []
}

export const updateFormStatus = (formId, newStatus) => {
  const forms = getCustomerForms()
  const updatedForms = forms.map(form => 
    form.id === formId ? { ...form, status: newStatus } : form
  )
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_FORMS, JSON.stringify(updatedForms))
}
