// தரவு சரிபார்ப்புக்கான உதவி செயல்பாடுகள்

// தேவையான புலம் சரிபார்ப்பு
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === "string") return value.trim().length > 0
  if (typeof value === "number") return true
  if (Array.isArray(value)) return value.length > 0
  return !!value
}

// எண் சரிபார்ப்பு
export const isNumber = (value: any): boolean => {
  if (value === null || value === undefined || value === "") return true // காலியாக இருந்தால் சரி (தேவையான புலம் அல்ல)
  return !isNaN(Number(value))
}

// நேர்மறை எண் சரிபார்ப்பு
export const isPositiveNumber = (value: any): boolean => {
  if (value === null || value === undefined || value === "") return true // காலியாக இருந்தால் சரி (தேவையான புலம் அல்ல)
  const num = Number(value)
  return !isNaN(num) && num > 0
}

// தேதி சரிபார்ப்பு
export const isValidDate = (value: any): boolean => {
  if (value === null || value === undefined || value === "") return true // காலியாக இருந்தால் சரி (தேவையான புலம் அல்ல)
  const date = new Date(value)
  return !isNaN(date.getTime())
}

// தேதி எதிர்காலத்தில் இல்லை என சரிபார்ப்பு
export const isNotFutureDate = (value: any): boolean => {
  if (value === null || value === undefined || value === "") return true // காலியாக இருந்தால் சரி (தேவையான புலம் அல்ல)
  const date = new Date(value)
  const today = new Date()
  today.setHours(23, 59, 59, 999) // இன்றைய நாளின் இறுதி நேரம்
  return !isNaN(date.getTime()) && date <= today
}

// மின்னஞ்சல் சரிபார்ப்பு
export const isValidEmail = (value: any): boolean => {
  if (value === null || value === undefined || value === "") return true // காலியாக இருந்தால் சரி (தேவையான புலம் அல்ல)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

// தொலைபேசி எண் சரிபார்ப்பு
export const isValidPhone = (value: any): boolean => {
  if (value === null || value === undefined || value === "") return true // காலியாக இருந்தால் சரி (தேவையான புலம் அல்ல)
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(value.toString().replace(/\D/g, ""))
}

// ஆதார் எண் சரிபார்ப்பு
export const isValidAadhaar = (value: any): boolean => {
  if (value === null || value === undefined || value === "") return true // காலியாக இருந்தால் சரி (தேவையான புலம் அல்ல)
  const aadhaarRegex = /^[0-9]{12}$/
  return aadhaarRegex.test(value.toString().replace(/\D/g, ""))
}

// குறைந்தபட்ச நீளம் சரிபார்ப்பு
export const minLength = (value: any, length: number): boolean => {
  if (value === null || value === undefined || value === "") return true // காலியாக இருந்தால் சரி (தேவையான புலம் அல்ல)
  return value.toString().length >= length
}

// அதிகபட்ச நீளம் சரிபார்ப்பு
export const maxLength = (value: any, length: number): boolean => {
  if (value === null || value === undefined || value === "") return true // காலியாக இருந்தால் சரி (தேவையான புலம் அல்ல)
  return value.toString().length <= length
}

// பிழை செய்திகள்
export const errorMessages = {
  required: "இந்தப் புலம் கட்டாயமாக நிரப்பப்பட வேண்டும்",
  number: "சரியான எண் மதிப்பை உள்ளிடவும்",
  positiveNumber: "நேர்மறை எண் மதிப்பை மட்டும் உள்ளிடவும்",
  date: "சரியான தேதி வடிவத்தில் உள்ளிடவும்",
  futureDate: "எதிர்கால தேதியை உள்ளிட முடியாது",
  email: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்",
  phone: "10 இலக்க தொலைபேசி எண்ணை மட்டும் உள்ளிடவும்",
  aadhaar: "12 இலக்க ஆதார் எண்ணை மட்டும் உள்ளிடவும்",
  minLength: (length: number) => `குறைந்தபட்சம் ${length} எழுத்துக்கள் தேவை`,
  maxLength: (length: number) => `அதிகபட்சம் ${length} எழுத்துக்கள் மட்டுமே அனுமதிக்கப்படும்`,
}
