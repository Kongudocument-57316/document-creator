export interface MortgageParty {
  id: string // Unique ID for UI operations
  name: string
  age: string
  relationsName: string
  relationType: string
  doorNo: string
  addressLine1: string
  addressLine2: string
  addressLine3: string
  taluk: string
  district: string
  pincode: string
  aadharNo: string
  phoneNo: string
}

export interface MortgageLoanFormValues {
  // Document date
  documentDate: string

  // Buyer details (multiple)
  buyers: MortgageParty[]

  // Seller details (multiple)
  sellers: MortgageParty[]

  // Property document details
  prDocumentDate: string
  subRegisterOffice: string
  prBookNo: string
  prDocumentYear: string
  prDocumentNo: string
  prDocumentType: string

  // Loan details
  loanAmount: string
  loanAmountInWords: string
  interestRate: string
  loanStartDate: string
  loanDuration: string
  loanDurationType: string

  // Property details
  propertyDetails: string

  // Witness details
  witness1Name: string
  witness1Age: string
  witness1RelationsName: string
  witness1RelationType: string
  witness1DoorNo: string
  witness1AddressLine1: string
  witness1AddressLine2: string
  witness1AddressLine3: string
  witness1Taluk: string
  witness1District: string
  witness1Pincode: string
  witness1AadharNo: string

  witness2Name: string
  witness2Age: string
  witness2RelationsName: string
  witness2RelationType: string
  witness2DoorNo: string
  witness2AddressLine1: string
  witness2AddressLine2: string
  witness2AddressLine3: string
  witness2Taluk: string
  witness2District: string
  witness2Pincode: string
  witness2AadharNo: string

  // Typist details
  typistName: string
  typistOfficeName: string
  typistPhoneNo: string
}
