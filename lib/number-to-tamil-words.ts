// Function to convert numbers to Tamil words
export function convertNumberToTamilWords(num: number): string {
  if (num === 0) return "பூஜ்ஜியம்"

  const units = [
    "",
    "ஒன்று",
    "இரண்டு",
    "மூன்று",
    "நான்கு",
    "ஐந்து",
    "ஆறு",
    "ஏழு",
    "எட்டு",
    "ஒன்பது",
    "பத்து",
    "பதினொன்று",
    "பன்னிரண்டு",
    "பதிமூன்று",
    "பதினான்கு",
    "பதினைந்து",
    "பதினாறு",
    "பதினேழு",
    "பதினெட்டு",
    "பத்தொன்பது",
  ]

  const tens = ["", "பத்து", "இருபது", "முப்பது", "நாற்பது", "ஐம்பது", "அறுபது", "எழுபது", "எண்பது", "தொண்ணூறு"]

  const scales = ["", "நூறு", "ஆயிரம்", "லட்சம்", "கோடி"]

  // Handle negative numbers
  if (num < 0) return "கழித்தல் " + convertNumberToTamilWords(Math.abs(num))

  // Handle decimal numbers
  if (!Number.isInteger(num)) {
    const parts = num.toString().split(".")
    const integerPart = Number.parseInt(parts[0])
    const decimalPart = Number.parseInt(parts[1])

    if (decimalPart === 0) {
      return convertNumberToTamilWords(integerPart)
    }

    return convertNumberToTamilWords(integerPart) + " புள்ளி " + convertNumberToTamilWords(decimalPart)
  }

  // Convert numbers less than 20
  if (num < 20) {
    return units[num]
  }

  // Convert numbers less than 100
  if (num < 100) {
    return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + units[num % 10] : "")
  }

  // Convert numbers less than 1000
  if (num < 1000) {
    if (num === 100) return "நூறு"
    return (
      (num < 200 ? "நூற்றி " : units[Math.floor(num / 100)] + " நூற்றி ") +
      (num % 100 !== 0 ? convertNumberToTamilWords(num % 100) : "")
    )
  }

  // Convert numbers less than 100,000
  if (num < 100000) {
    if (num === 1000) return "ஆயிரம்"
    return (
      (num < 2000 ? "ஆயிரத்து " : units[Math.floor(num / 1000)] + " ஆயிரத்து ") +
      (num % 1000 !== 0 ? convertNumberToTamilWords(num % 1000) : "")
    )
  }

  // Convert numbers less than 10,000,000 (1 crore)
  if (num < 10000000) {
    const lakhs = Math.floor(num / 100000)
    const remainder = num % 100000

    if (lakhs === 1) {
      return "ஒரு லட்சத்து " + (remainder !== 0 ? convertNumberToTamilWords(remainder) : "")
    }

    return convertNumberToTamilWords(lakhs) + " லட்சத்து " + (remainder !== 0 ? convertNumberToTamilWords(remainder) : "")
  }

  // Convert numbers greater than or equal to 10,000,000 (1 crore)
  const crores = Math.floor(num / 10000000)
  const remainder = num % 10000000

  if (crores === 1) {
    return "ஒரு கோடி " + (remainder !== 0 ? convertNumberToTamilWords(remainder) : "")
  }

  return convertNumberToTamilWords(crores) + " கோடி " + (remainder !== 0 ? convertNumberToTamilWords(remainder) : "")
}

// Function to convert numbers to English words (for fallback)
export function convertNumberToEnglishWords(num: number): string {
  const units = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]

  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  const scales = ["", "Thousand", "Million", "Billion", "Trillion"]

  // Handle negative numbers
  if (num < 0) return "Negative " + convertNumberToEnglishWords(Math.abs(num))

  // Handle decimal numbers
  if (!Number.isInteger(num)) {
    const parts = num.toString().split(".")
    const integerPart = Number.parseInt(parts[0])
    const decimalPart = Number.parseInt(parts[1])

    if (decimalPart === 0) {
      return convertNumberToEnglishWords(integerPart)
    }

    return convertNumberToEnglishWords(integerPart) + " Point " + convertNumberToEnglishWords(decimalPart)
  }

  // Convert numbers less than 20
  if (num < 20) {
    return units[num]
  }

  // Convert numbers less than 100
  if (num < 100) {
    return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + units[num % 10] : "")
  }

  // Convert numbers less than 1000
  if (num < 1000) {
    return (
      units[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 !== 0 ? " and " + convertNumberToEnglishWords(num % 100) : "")
    )
  }

  // For larger numbers, break them down by thousands
  let result = ""
  let i = 0

  while (num > 0) {
    if (num % 1000 !== 0) {
      result = convertNumberToEnglishWords(num % 1000) + (scales[i] ? " " + scales[i] + " " : "") + result
    }

    num = Math.floor(num / 1000)
    i++
  }

  return result.trim()
}

// Function to convert number to words based on language preference
export function convertNumberToWords(num: number, language: "tamil" | "english" = "tamil"): string {
  if (language === "tamil") {
    return convertNumberToTamilWords(num)
  } else {
    return convertNumberToEnglishWords(num)
  }
}
