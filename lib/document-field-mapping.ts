// Field mapping for document templates
export const documentFieldMapping = {
  // Buyer fields
  "buyer.name": {
    label: "வாங்குபவர் பெயர்",
    description: "வாங்குபவரின் முழுப் பெயர்",
    category: "buyers",
  },
  "buyer.age": {
    label: "வாங்குபவர் வயது",
    description: "வாங்குபவரின் வயது",
    category: "buyers",
  },
  "buyer.relation": {
    label: "வாங்குபவர் உறவுமுறை",
    description: "வாங்குபவரின் உறவுமுறை (மகன்/மகள்/மனைவி)",
    category: "buyers",
  },

  // Seller fields
  "seller.name": {
    label: "விற்பவர் பெயர்",
    description: "விற்பவரின் முழுப் பெயர்",
    category: "sellers",
  },
  "seller.age": {
    label: "விற்பவர் வயது",
    description: "விற்பவரின் வயது",
    category: "sellers",
  },
  "seller.relation": {
    label: "விற்பவர் உறவுமுறை",
    description: "விற்பவரின் உறவுமுறை (மகன்/மகள்/மனைவி)",
    category: "sellers",
  },

  // Property fields
  "property.totalArea": {
    label: "மொத்த பரப்பளவு",
    description: "சொத்தின் மொத்த பரப்பளவு",
    category: "property",
  },
  "property.surveyNumber": {
    label: "சர்வே எண்",
    description: "சொத்தின் சர்வே எண்",
    category: "property",
  },
  "property.northBoundary": {
    label: "வடக்கு எல்லை",
    description: "சொத்தின் வடக்கு எல்லை",
    category: "property",
  },
  "property.southBoundary": {
    label: "தெற்கு எல்லை",
    description: "சொத்தின் தெற்கு எல்லை",
    category: "property",
  },
  "property.eastBoundary": {
    label: "கிழக்கு எல்லை",
    description: "சொத்தின் கிழக்கு எல்லை",
    category: "property",
  },
  "property.westBoundary": {
    label: "மேற்கு எல்லை",
    description: "சொத்தின் மேற்கு எல்லை",
    category: "property",
  },

  // Payment fields
  "payment.amount": {
    label: "பணத்தொகை",
    description: "பணப்பட்டுவாடா தொகை",
    category: "payment",
  },
  "payment.method": {
    label: "பணப்பட்டுவாடா முறை",
    description: "பணப்பட்டுவாடா முறை (ரொக்கம்/காசோலை/வங்கி பரிமாற்றம்)",
    category: "payment",
  },
  "payment.date": {
    label: "பணப்பட்டுவாடா தேதி",
    description: "பணப்பட்டுவாடா தேதி",
    category: "payment",
  },

  // Document fields
  "document.number": {
    label: "ஆவண எண்",
    description: "ஆவணத்தின் எண்",
    category: "documents",
  },
  "document.date": {
    label: "ஆவண தேதி",
    description: "ஆவணத்தின் தேதி",
    category: "documents",
  },
  "document.type": {
    label: "ஆவண வகை",
    description: "ஆவணத்தின் வகை",
    category: "documents",
  },
}

// Function to get field value from form data
export function getFieldValue(formData: any, fieldPath: string): string {
  try {
    const parts = fieldPath.split(".")
    let value = formData

    for (const part of parts) {
      if (value === undefined || value === null) return ""
      value = value[part]
    }

    return value?.toString() || ""
  } catch (error) {
    console.error(`Error getting field value for ${fieldPath}:`, error)
    return ""
  }
}

// Function to get all fields for a specific category
export function getCategoryFields(category: string): Record<string, any> {
  const result: Record<string, any> = {}

  Object.entries(documentFieldMapping).forEach(([key, value]) => {
    if (value.category === category) {
      result[key] = value
    }
  })

  return result
}
