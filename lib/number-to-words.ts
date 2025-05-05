// Tamil number to words conversion
const tamilUnits = [
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
  "பனிரெண்டு",
  "பதிமூன்று",
  "பதினான்கு",
  "பதினைந்து",
  "பதினாறு",
  "பதினேழு",
  "பதினெட்டு",
  "பத்தொன்பது",
]

const tamilTens = ["", "பத்து", "இருபது", "முப்பது", "நாற்பது", "ஐம்பது", "அறுபது", "எழுபது", "எண்பது", "தொண்ணூறு"]

export function numToTamilWords(num: number): string {
  if (num === 0) return "பூஜ்ஜியம்"

  // Handle rupees formatting
  const rupees = Math.floor(num)
  const paisas = Math.round((num - rupees) * 100)

  let result = ""

  if (rupees > 0) {
    result += convertNumberToTamilWords(rupees) + " ரூபாய்"
  }

  if (paisas > 0) {
    if (result !== "") result += " மற்றும் "
    result += convertNumberToTamilWords(paisas) + " காசு"
  }

  return result
}

function convertNumberToTamilWords(num: number): string {
  if (num === 0) return ""

  // For numbers less than 20
  if (num < 20) return tamilUnits[num]

  // For numbers between 20 and 99
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const unit = num % 10
    return unit === 0 ? tamilTens[ten] : tamilTens[ten] + " " + tamilUnits[unit]
  }

  // For numbers between 100 and 999
  if (num < 1000) {
    const hundred = Math.floor(num / 100)
    const remainder = num % 100
    return remainder === 0
      ? tamilUnits[hundred] + " நூறு"
      : tamilUnits[hundred] + " நூற்று " + convertNumberToTamilWords(remainder)
  }

  // For numbers between 1,000 and 99,999
  if (num < 100000) {
    const thousand = Math.floor(num / 1000)
    const remainder = num % 1000

    let thousandText = ""
    if (thousand === 1) {
      thousandText = "ஆயிரம்"
    } else {
      thousandText = convertNumberToTamilWords(thousand) + " ஆயிரம்"
    }

    return remainder === 0 ? thousandText : thousandText + " " + convertNumberToTamilWords(remainder)
  }

  // For numbers between 100,000 and 9,999,999 (lakhs)
  if (num < 10000000) {
    const lakh = Math.floor(num / 100000)
    const remainder = num % 100000

    let lakhText = ""
    if (lakh === 1) {
      lakhText = "ஒரு இலட்சம்"
    } else {
      lakhText = convertNumberToTamilWords(lakh) + " இலட்சம்"
    }

    return remainder === 0 ? lakhText : lakhText + " " + convertNumberToTamilWords(remainder)
  }

  // For numbers between 10,000,000 and 999,999,999 (crores)
  const crore = Math.floor(num / 10000000)
  const remainder = num % 10000000

  let croreText = ""
  if (crore === 1) {
    croreText = "ஒரு கோடி"
  } else {
    croreText = convertNumberToTamilWords(crore) + " கோடி"
  }

  return remainder === 0 ? croreText : croreText + " " + convertNumberToTamilWords(remainder)
}
