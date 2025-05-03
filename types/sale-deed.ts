export interface BuildingDetail {
  id: string
  buildingType: string
  facingDirection: string
  totalSqFeet: string
  buildingAge: string
  floors: string
  rooms: string
  description: string
}

export interface SaleDeedFormData {
  documentName: string
  documentDate: string | null
  saleAmount: string | null
  saleAmountWords: string | null
  previousDocumentDate: string | null
  subRegistrarOfficeId: string | null
  bookNumberId: string | null
  documentYear: string | null
  documentNumber: string | null
  documentTypeId: string | null
  submissionTypeId: string | null
  typistId: string | null
  typistPhone: string | null
  officeId: string | null
  landTypes: string[]
  valueTypes: string[]
  paymentMethods: string[]
  documentContent: string
  buyers: number[]
  sellers: number[]
  witnesses: number[]
  properties: number[]
  propertyDetails: string[]
  buildings?: BuildingDetail[]
  paymentDetails?: {
    paymentMethodId: string
    buyerBankName: string
    buyerBankBranch: string
    buyerAccountType: string
    buyerAccountNumber: string
    sellerBankName: string
    sellerBankBranch: string
    sellerAccountType: string
    sellerAccountNumber: string
    transactionNumber: string
    transactionDate: string | null
    amount: number | null
  } | null
}

export interface SaleDeedDocument {
  id: number
  document_name: string
  document_number: string | null
  document_date: string | null
  sale_amount: number | null
  sale_amount_words: string | null
  previous_document_date: string | null
  document_year: string | null
  document_content: string | null
  created_at: string
  updated_at: string
  sub_registrar_office_id: number | null
  book_number_id: number | null
  document_type_id: number | null
  submission_type_id: number | null
  typist_id: number | null
  typist_phone: string | null
  office_id: number | null
}

export interface SaleDeedSearchParams {
  documentNumber?: string
  documentDate?: string
  buyerName?: string
  sellerName?: string
  propertyDetails?: string
  fromDate?: string
  toDate?: string
}

export interface SaleDeedSearchResult extends SaleDeedDocument {
  buyers: { id: number; name: string }[]
  sellers: { id: number; name: string }[]
  properties: { id: number; property_name: string }[]
}
