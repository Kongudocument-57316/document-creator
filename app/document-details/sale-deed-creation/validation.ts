// Define validation functions for each section of the form

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Validate deed tab
export function validateDeedTab(data: any): ValidationResult {
  const errors: string[] = []

  if (!data.registrationOfficeId) {
    errors.push("சார்பதிவாளர் அலுவலகம் தேர்ந்தெடுக்கப்படவில்லை")
  }

  if (!data.day) {
    errors.push("தேதி உள்ளிடப்படவில்லை")
  }

  if (!data.month) {
    errors.push("மாதம் தேர்ந்தெடுக்கப்படவில்லை")
  }

  if (!data.year) {
    errors.push("ஆண்டு உள்ளிடப்படவில்லை")
  }

  if (!data.documentPreparerId) {
    errors.push("ஆவணம் தயாரித்தவர் தேர்ந்தெடுக்கப்படவில்லை")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Validate seller tab
export function validateSellerTab(data: any[]): ValidationResult {
  const errors: string[] = []

  if (!data || data.length === 0) {
    errors.push("குறைந்தது ஒரு விற்பனையாளரையாவது சேர்க்க வேண்டும்")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Validate buyer tab
export function validateBuyerTab(data: any[]): ValidationResult {
  const errors: string[] = []

  if (!data || data.length === 0) {
    errors.push("குறைந்தது ஒரு வாங்குபவரையாவது சேர்க்க வேண்டும்")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Validate property tab
export function validatePropertyTab(data: any): ValidationResult {
  const errors: string[] = []

  if (!data.propertyType) {
    errors.push("சொத்து வகை தேர்ந்தெடுக்கப்படவில்லை")
  }

  if (!data.propertyAddress) {
    errors.push("சொத்து முகவரி உள்ளிடப்படவில்லை")
  }

  if (!data.propertyArea) {
    errors.push("சொத்தின் அளவு உள்ளிடப்படவில்லை")
  }

  if (!data.propertyValue) {
    errors.push("சொத்தின் மதிப்பு உள்ளிடப்படவில்லை")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Validate payment tab
export function validatePaymentTab(data: any): ValidationResult {
  const errors: string[] = []

  if (!data.totalAmount) {
    errors.push("மொத்த தொகை உள்ளிடப்படவில்லை")
  }

  if (!data.paymentMethod) {
    errors.push("பணம் செலுத்தும் முறை தேர்ந்தெடுக்கப்படவில்லை")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Validate witness tab
export function validateWitnessTab(data: any[]): ValidationResult {
  const errors: string[] = []

  if (!data || data.length === 0) {
    errors.push("குறைந்தது ஒரு சாட்சியாவது சேர்க்க வேண்டும்")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Validate the entire form
export function validateForm(formData: any): {
  isValid: boolean
  errors: Record<string, string[]>
  firstInvalidTab?: string
} {
  const validationResults: Record<string, ValidationResult> = {
    deed: validateDeedTab(formData.deed || {}),
    seller: validateSellerTab(formData.seller || []),
    buyer: validateBuyerTab(formData.buyer || []),
    property: validatePropertyTab(formData.property || {}),
    payment: validatePaymentTab(formData.payment || {}),
    witness: validateWitnessTab(formData.witness || []),
  }

  const errors: Record<string, string[]> = {}
  let isValid = true
  let firstInvalidTab: string | undefined

  // Process validation results
  for (const [tab, result] of Object.entries(validationResults)) {
    if (!result.isValid) {
      errors[tab] = result.errors
      isValid = false
      if (!firstInvalidTab) {
        firstInvalidTab = tab
      }
    }
  }

  return {
    isValid,
    errors,
    firstInvalidTab,
  }
}
