export function validateForm(formData: any) {
  const errors: Record<string, string[]> = {}
  let isValid = true
  let firstInvalidTab = null

  // Validate Deed Tab
  const deedErrors = validateDeedTab(formData.deed)
  if (deedErrors.length > 0) {
    errors.deed = deedErrors
    isValid = false
    firstInvalidTab = firstInvalidTab || "deed"
  }

  // Validate Seller Tab
  const sellerErrors = validateSellerTab(formData.seller)
  if (sellerErrors.length > 0) {
    errors.seller = sellerErrors
    isValid = false
    firstInvalidTab = firstInvalidTab || "seller"
  }

  // Validate Buyer Tab
  const buyerErrors = validateBuyerTab(formData.buyer)
  if (buyerErrors.length > 0) {
    errors.buyer = buyerErrors
    isValid = false
    firstInvalidTab = firstInvalidTab || "buyer"
  }

  // Validate Property Tab
  const propertyErrors = validatePropertyTab(formData.property)
  if (propertyErrors.length > 0) {
    errors.property = propertyErrors
    isValid = false
    firstInvalidTab = firstInvalidTab || "property"
  }

  // Validate Payment Tab
  const paymentErrors = validatePaymentTab(formData.payment)
  if (paymentErrors.length > 0) {
    errors.payment = paymentErrors
    isValid = false
    firstInvalidTab = firstInvalidTab || "payment"
  }

  return {
    isValid,
    errors,
    firstInvalidTab,
  }
}

function validateDeedTab(deedData: any = {}) {
  const errors: string[] = []

  if (!deedData.documentType) {
    errors.push("ஆவண வகையைத் தேர்ந்தெடுக்கவும்")
  }

  if (!deedData.documentDate) {
    errors.push("ஆவண தேதியை உள்ளிடவும்")
  }

  return errors
}

function validateSellerTab(sellerData: any[] = []) {
  const errors: string[] = []

  if (!sellerData || sellerData.length === 0) {
    errors.push("குறைந்தது ஒரு விற்பனையாளரையாவது சேர்க்கவும்")
  }

  return errors
}

function validateBuyerTab(buyerData: any[] = []) {
  const errors: string[] = []

  if (!buyerData || buyerData.length === 0) {
    errors.push("குறைந்தது ஒரு வாங்குபவரையாவது சேர்க்கவும்")
  }

  return errors
}

function validatePropertyTab(propertyData: any = {}) {
  const errors: string[] = []

  if (propertyData.propertySelectionType === "existing") {
    if (!propertyData.propertyType) {
      errors.push("சொத்து வகையைத் தேர்ந்தெடுக்கவும்")
    }

    if (!propertyData.propertyValue) {
      errors.push("சொத்தின் மதிப்பை உள்ளிடவும்")
    }

    if (!propertyData.propertyAddress) {
      errors.push("சொத்து முகவரியை உள்ளிடவும்")
    }

    if (!propertyData.propertyArea) {
      errors.push("சொத்தின் அளவை உள்ளிடவும்")
    }
  } else if (propertyData.propertySelectionType === "site") {
    if (!propertyData.siteDetails || propertyData.siteDetails.length === 0) {
      errors.push("குறைந்தது ஒரு மனை விவரத்தையாவது சேர்க்கவும்")
    }
  } else if (propertyData.propertySelectionType === "building") {
    if (!propertyData.buildingDetails || propertyData.buildingDetails.length === 0) {
      errors.push("குறைந்தது ஒரு கட்டட விவரத்தையாவது சேர்க்கவும்")
    }
  }

  return errors
}

function validatePaymentTab(paymentData: any = {}) {
  const errors: string[] = []

  // Validate total amount
  if (!paymentData.totalAmount) {
    errors.push("மொத்த தொகையை உள்ளிடவும்")
  } else if (isNaN(Number.parseFloat(paymentData.totalAmount)) || Number.parseFloat(paymentData.totalAmount) <= 0) {
    errors.push("சரியான மொத்த தொகையை உள்ளிடவும்")
  }

  // Validate amount in words
  if (!paymentData.amountInWords || paymentData.amountInWords === "Zero") {
    errors.push("தொகையை எழுத்துகளில் உள்ளிடவும்")
  }

  // Validate individual payment entries
  if (!paymentData.payments || paymentData.payments.length === 0) {
    errors.push("குறைந்தது ஒரு பணப்பட்டுவாடா விவரத்தையாவது சேர்க்கவும்")
  } else {
    // Calculate total of individual payments
    let totalPaymentAmount = 0

    // Check each payment entry
    for (let i = 0; i < paymentData.payments.length; i++) {
      const payment = paymentData.payments[i]
      const paymentErrors: string[] = []

      // Required fields for all payment methods
      if (!payment.fromBuyer) {
        paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: வாங்குபவரைத் தேர்ந்தெடுக்கவும்`)
      }

      if (!payment.toSeller) {
        paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: விற்பவரைத் தேர்ந்தெடுக்கவும்`)
      }

      if (!payment.amount) {
        paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: தொகையை உள்ளிடவும்`)
      } else if (isNaN(Number.parseFloat(payment.amount)) || Number.parseFloat(payment.amount) <= 0) {
        paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: சரியான தொகையை உள்ளிடவும்`)
      } else {
        totalPaymentAmount += Number.parseFloat(payment.amount)
      }

      if (!payment.paymentMethod) {
        paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: பணப்பட்டுவாடா முறையைத் தேர்ந்தெடுக்கவும்`)
      } else {
        // Validate fields specific to payment methods
        if (payment.paymentMethod === "2") {
          // Cheque
          if (!payment.transactionNo) {
            paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: காசோலை எண்ணை உள்ளிடவும்`)
          }
          if (!payment.bankName) {
            paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: வங்கி பெயரை உள்ளிடவும்`)
          }
        } else if (["3", "4", "5", "6", "7"].includes(payment.paymentMethod)) {
          // DD, NEFT, RTGS, IMPS, UPI
          if (!payment.transactionNo) {
            const fieldName = payment.paymentMethod === "3" ? "வரைவோலை எண்ணை" : "பரிவர்த்தனை எண்ணை"
            paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: ${fieldName} உள்ளிடவும்`)
          }
          if (!payment.bankName) {
            paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: செலுத்துபவர் வங்கி பெயரை உள்ளிடவும்`)
          }
          if (!payment.recipientBankName) {
            paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: பெறுநர் வங்கி பெயரை உள்ளிடவும்`)
          }
        }

        // Transaction date is required for all payment methods
        if (!payment.transactionDate) {
          paymentErrors.push(`பணப்பட்டுவாடா #${i + 1}: பரிவர்த்தனை தேதியை உள்ளிடவும்`)
        }
      }

      // Add all payment errors to the main errors array
      errors.push(...paymentErrors)
    }

    // Validate that sum of payments matches total amount
    if (totalPaymentAmount > 0 && !isNaN(Number.parseFloat(paymentData.totalAmount))) {
      const totalAmount = Number.parseFloat(paymentData.totalAmount)
      if (Math.abs(totalPaymentAmount - totalAmount) > 0.01) {
        // Allow small rounding differences
        errors.push(`பணப்பட்டுவாடா தொகைகளின் கூட்டுத்தொகை (${totalPaymentAmount}) மொத்த தொகையுடன் (${totalAmount}) பொருந்தவில்லை`)
      }
    }
  }

  return errors
}
