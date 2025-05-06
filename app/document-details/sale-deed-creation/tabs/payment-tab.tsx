"use client"

import { useState, useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { CreditCard, Calendar, DollarSign, Plus, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RequiredFieldLabel } from "../components/required-field-label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { convertNumberToWords } from "@/lib/number-to-tamil-words"

interface PaymentTabProps {
  data: any
  updateData: (data: any) => void
  errors?: string[]
}

export function PaymentTab({ data, updateData, errors = [] }: PaymentTabProps) {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()
  const initialRender = useRef(true)
  const propertyValueRef = useRef(data.propertyValue)

  const [formValues, setFormValues] = useState({
    totalAmount: data.totalAmount || "",
    amountInWords: data.amountInWords || "Zero",
    isManualEdit: data.isManualEdit || false,
    payments: data.payments || [createNewPayment()],
  })

  function createNewPayment() {
    return {
      id: Date.now().toString(),
      fromBuyer: "",
      toSeller: "",
      amount: "",
      amountInWords: "",
      paymentMethod: "",
      transactionNo: "",
      transactionDate: "",
      // Bank details for various payment methods
      bankName: "",
      bankBranch: "",
      accountType: "",
      accountNo: "",
      // Recipient bank details
      recipientBankName: "",
      recipientBankBranch: "",
      recipientAccountType: "",
      recipientAccountNo: "",
    }
  }

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        setLoading(true)
        const { data: methodsData } = await supabase.from("payment_methods").select("id, name").order("name")
        if (methodsData) setPaymentMethods(methodsData)
      } catch (error) {
        console.error("Error fetching payment methods:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentMethods()
  }, [supabase])

  // Auto-populate total amount from property value
  useEffect(() => {
    // Skip on initial render to avoid conflicts with existing data
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    // Only update if property value has changed and we're not in manual edit mode
    if (data.propertyValue !== propertyValueRef.current && !formValues.isManualEdit) {
      propertyValueRef.current = data.propertyValue

      const propertyValue = Number.parseFloat(data.propertyValue)
      if (!isNaN(propertyValue)) {
        setFormValues((prev) => ({
          ...prev,
          totalAmount: propertyValue.toString(),
          amountInWords: convertNumberToWords(propertyValue),
        }))

        // Only update parent if we're not in manual edit mode
        updateData({
          ...data,
          totalAmount: propertyValue.toString(),
          amountInWords: convertNumberToWords(propertyValue),
        })
      }
    }
  }, [data.propertyValue, data, formValues.isManualEdit, updateData])

  // Calculate total of individual payments
  const calculateTotalPayments = () => {
    return formValues.payments.reduce((total, payment) => {
      const amount = Number.parseFloat(payment.amount)
      return total + (isNaN(amount) ? 0 : amount)
    }, 0)
  }

  // Check if total payments match the total amount
  const totalPaymentsMatch = () => {
    const totalAmount = Number.parseFloat(formValues.totalAmount)
    const totalPayments = calculateTotalPayments()

    if (isNaN(totalAmount) || totalPayments === 0) return true // Skip validation if values aren't set yet
    return Math.abs(totalAmount - totalPayments) <= 0.01 // Allow small rounding differences
  }

  const handleTotalAmountChange = (value: string) => {
    const numValue = Number.parseFloat(value)

    setFormValues({
      ...formValues,
      totalAmount: value,
      amountInWords: !isNaN(numValue) ? convertNumberToWords(numValue) : "Zero",
    })

    updateData({
      ...data,
      totalAmount: value,
      amountInWords: !isNaN(numValue) ? convertNumberToWords(numValue) : "Zero",
    })
  }

  const handleManualEditChange = (value: boolean) => {
    setFormValues({
      ...formValues,
      isManualEdit: value,
    })
    updateData({
      ...data,
      isManualEdit: value,
    })
  }

  const handleAmountInWordsChange = (value: string) => {
    setFormValues({
      ...formValues,
      amountInWords: value,
    })
    updateData({
      ...data,
      amountInWords: value,
    })
  }

  const handlePaymentChange = (index: number, field: string, value: string) => {
    const updatedPayments = [...formValues.payments]

    // If changing amount, also update amountInWords
    if (field === "amount") {
      const numValue = Number.parseFloat(value)
      updatedPayments[index] = {
        ...updatedPayments[index],
        [field]: value,
        amountInWords: !isNaN(numValue) ? convertNumberToWords(numValue) : "",
      }
    } else {
      updatedPayments[index] = {
        ...updatedPayments[index],
        [field]: value,
      }
    }

    const newFormValues = {
      ...formValues,
      payments: updatedPayments,
    }

    setFormValues(newFormValues)
    updateData({
      ...data,
      payments: updatedPayments,
    })
  }

  const addPayment = () => {
    const newPayment = createNewPayment()
    const updatedPayments = [...formValues.payments, newPayment]

    setFormValues({
      ...formValues,
      payments: updatedPayments,
    })

    updateData({
      ...data,
      payments: updatedPayments,
    })
  }

  const removePayment = (index: number) => {
    const updatedPayments = formValues.payments.filter((_, i) => i !== index)

    setFormValues({
      ...formValues,
      payments: updatedPayments,
    })

    updateData({
      ...data,
      payments: updatedPayments,
    })
  }

  // Check if a field has an error
  const hasError = (fieldName: string) => {
    return errors.some((error) => error.toLowerCase().includes(fieldName.toLowerCase()))
  }

  // Get payment-specific errors
  const getPaymentErrors = (index: number) => {
    return errors.filter((error) => error.includes(`பணப்பட்டுவாடா #${index + 1}`))
  }

  const renderPaymentMethodFields = (payment: any, index: number) => {
    const method = payment.paymentMethod

    // Common fields for all payment methods
    const commonFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <RequiredFieldLabel htmlFor={`transaction-date-${index}`} className="text-purple-700">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                பரிவர்த்தனை தேதி (Transaction Date)
              </span>
            </RequiredFieldLabel>
            <Input
              id={`transaction-date-${index}`}
              type="date"
              value={payment.transactionDate}
              onChange={(e) => handlePaymentChange(index, "transactionDate", e.target.value)}
              className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                hasError(`பணப்பட்டுவாடா #${index + 1}: பரிவர்த்தனை தேதி`) ? "border-red-500" : ""
              }`}
            />
          </div>
        </div>
      </>
    )

    // Fields specific to Cash payment
    if (method === "1") {
      // Cash
      return commonFields
    }

    // Fields specific to Cheque payment
    if (method === "2") {
      // Cheque
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <RequiredFieldLabel htmlFor={`cheque-no-${index}`} className="text-purple-700">
                காசோலை எண் (Cheque No)
              </RequiredFieldLabel>
              <Input
                id={`cheque-no-${index}`}
                placeholder="பரிவர்த்தனை எண்ணை உள்ளிடவும்"
                value={payment.transactionNo}
                onChange={(e) => handlePaymentChange(index, "transactionNo", e.target.value)}
                className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                  hasError(`பணப்பட்டுவாடா #${index + 1}: காசோலை எண்`) ? "border-red-500" : ""
                }`}
              />
            </div>
            <div>
              <RequiredFieldLabel htmlFor={`transaction-date-${index}`} className="text-purple-700">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  பரிவர்த்தனை தேதி (Transaction Date)
                </span>
              </RequiredFieldLabel>
              <Input
                id={`transaction-date-${index}`}
                type="date"
                value={payment.transactionDate}
                onChange={(e) => handlePaymentChange(index, "transactionDate", e.target.value)}
                className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                  hasError(`பணப்பட்டுவாடா #${index + 1}: பரிவர்த்தனை தேதி`) ? "border-red-500" : ""
                }`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <RequiredFieldLabel htmlFor={`bank-name-${index}`} className="text-purple-700">
                வங்கி பெயர் (Bank Name)
              </RequiredFieldLabel>
              <Input
                id={`bank-name-${index}`}
                placeholder="வங்கி பெயரை உள்ளிடவும்"
                value={payment.bankName}
                onChange={(e) => handlePaymentChange(index, "bankName", e.target.value)}
                className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                  hasError(`பணப்பட்டுவாடா #${index + 1}: வங்கி பெயர்`) ? "border-red-500" : ""
                }`}
              />
            </div>
            <div>
              <Label htmlFor={`bank-branch-${index}`} className="text-purple-700">
                வங்கி கிளை (Bank Branch)
              </Label>
              <Input
                id={`bank-branch-${index}`}
                placeholder="வங்கி கிளையை உள்ளிடவும்"
                value={payment.bankBranch}
                onChange={(e) => handlePaymentChange(index, "bankBranch", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor={`account-type-${index}`} className="text-purple-700">
                கணக்கு வகை (Account Type)
              </Label>
              <Input
                id={`account-type-${index}`}
                placeholder="கணக்கு வகையை உள்ளிடவும்"
                value={payment.accountType}
                onChange={(e) => handlePaymentChange(index, "accountType", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <Label htmlFor={`account-no-${index}`} className="text-purple-700">
                கணக்கு எண் (Account No)
              </Label>
              <Input
                id={`account-no-${index}`}
                placeholder="கணக்கு எண்ணை உள்ளிடவும்"
                value={payment.accountNo}
                onChange={(e) => handlePaymentChange(index, "accountNo", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
        </>
      )
    }

    // Fields for electronic payments (DD, NEFT, RTGS, IMPS, UPI)
    if (["3", "4", "5", "6", "7"].includes(method)) {
      const transactionLabel = method === "3" ? "வரைவோலை எண் (DD No)" : "பரிவர்த்தனை எண் (Transaction No)"

      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <RequiredFieldLabel htmlFor={`transaction-no-${index}`} className="text-purple-700">
                {transactionLabel}
              </RequiredFieldLabel>
              <Input
                id={`transaction-no-${index}`}
                placeholder="பரிவர்த்தனை எண்ணை உள்ளிடவும்"
                value={payment.transactionNo}
                onChange={(e) => handlePaymentChange(index, "transactionNo", e.target.value)}
                className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                  hasError(`பணப்பட்டுவாடா #${index + 1}: ${method === "3" ? "வரைவோலை எண்" : "பரிவர்த்தனை எண்"}`)
                    ? "border-red-500"
                    : ""
                }`}
              />
            </div>
            <div>
              <RequiredFieldLabel htmlFor={`transaction-date-${index}`} className="text-purple-700">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  பரிவர்த்தனை தேதி (Transaction Date)
                </span>
              </RequiredFieldLabel>
              <Input
                id={`transaction-date-${index}`}
                type="date"
                value={payment.transactionDate}
                onChange={(e) => handlePaymentChange(index, "transactionDate", e.target.value)}
                className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                  hasError(`பணப்பட்டுவாடா #${index + 1}: பரிவர்த்தனை தேதி`) ? "border-red-500" : ""
                }`}
              />
            </div>
          </div>

          <RequiredFieldLabel className="text-purple-700 mt-4 block">
            செலுத்துபவர் வங்கி விவரங்கள் (Payer Bank Details)
          </RequiredFieldLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <RequiredFieldLabel htmlFor={`bank-name-${index}`} className="text-purple-700">
                வங்கி பெயர் (Bank Name)
              </RequiredFieldLabel>
              <Input
                id={`bank-name-${index}`}
                placeholder="வங்கி பெயரை உள்ளிடவும்"
                value={payment.bankName}
                onChange={(e) => handlePaymentChange(index, "bankName", e.target.value)}
                className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                  hasError(`பணப்பட்டுவாடா #${index + 1}: செலுத்துபவர் வங்கி பெயர்`) ? "border-red-500" : ""
                }`}
              />
            </div>
            <div>
              <Label htmlFor={`bank-branch-${index}`} className="text-purple-700">
                வங்கி கிளை (Bank Branch)
              </Label>
              <Input
                id={`bank-branch-${index}`}
                placeholder="வங்கி கிளையை உள்ளிடவும்"
                value={payment.bankBranch}
                onChange={(e) => handlePaymentChange(index, "bankBranch", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor={`account-type-${index}`} className="text-purple-700">
                கணக்கு வகை (Account Type)
              </Label>
              <Input
                id={`account-type-${index}`}
                placeholder="கணக்கு வகையை உள்ளிடவும்"
                value={payment.accountType}
                onChange={(e) => handlePaymentChange(index, "accountType", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <Label htmlFor={`account-no-${index}`} className="text-purple-700">
                கணக்கு எண் (Account No)
              </Label>
              <Input
                id={`account-no-${index}`}
                placeholder="கணக்கு எண்ணை உள்ளிடவும்"
                value={payment.accountNo}
                onChange={(e) => handlePaymentChange(index, "accountNo", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>

          <RequiredFieldLabel className="text-purple-700 mt-4 block">
            பெறுநர் வங்கி விவரங்கள் (Recipient Bank Details)
          </RequiredFieldLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <RequiredFieldLabel htmlFor={`recipient-bank-name-${index}`} className="text-purple-700">
                வங்கி பெயர் (Bank Name)
              </RequiredFieldLabel>
              <Input
                id={`recipient-bank-name-${index}`}
                placeholder="வங்கி பெயரை உள்ளிடவும்"
                value={payment.recipientBankName}
                onChange={(e) => handlePaymentChange(index, "recipientBankName", e.target.value)}
                className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                  hasError(`பணப்பட்டுவாடா #${index + 1}: பெறுநர் வங்கி பெயர்`) ? "border-red-500" : ""
                }`}
              />
            </div>
            <div>
              <Label htmlFor={`recipient-bank-branch-${index}`} className="text-purple-700">
                வங்கி கிளை (Bank Branch)
              </Label>
              <Input
                id={`recipient-bank-branch-${index}`}
                placeholder="வங்கி கிளையை உள்ளிடவும்"
                value={payment.recipientBankBranch}
                onChange={(e) => handlePaymentChange(index, "recipientBankBranch", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor={`recipient-account-type-${index}`} className="text-purple-700">
                கணக்கு வகை (Account Type)
              </Label>
              <Input
                id={`recipient-account-type-${index}`}
                placeholder="கணக்கு வகையை உள்ளிடவும்"
                value={payment.recipientAccountType}
                onChange={(e) => handlePaymentChange(index, "recipientAccountType", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <Label htmlFor={`recipient-account-no-${index}`} className="text-purple-700">
                கணக்கு எண் (Account No)
              </Label>
              <Input
                id={`recipient-account-no-${index}`}
                placeholder="கணக்கு எண்ணை உள்ளிடவும்"
                value={payment.recipientAccountNo}
                onChange={(e) => handlePaymentChange(index, "recipientAccountNo", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
        </>
      )
    }

    return commonFields
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
          பணப்பட்டுவாடா விவரங்கள்
        </h3>
        <Separator className="my-4 bg-purple-200" />

        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-4 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <RequiredFieldLabel htmlFor="sale-amount" className="text-purple-700">
                விற்பனைத் தொகை (Sale Amount)
              </RequiredFieldLabel>
              <div className="flex items-center mt-1">
                <Input
                  id="sale-amount"
                  placeholder="0.00"
                  value={formValues.totalAmount}
                  onChange={(e) => handleTotalAmountChange(e.target.value)}
                  className={`border-purple-200 focus-visible:ring-purple-400 ${
                    hasError("மொத்த தொகை") ? "border-red-500" : ""
                  }`}
                  readOnly={!formValues.isManualEdit}
                />
                <div className="ml-2">
                  <div className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      id="manual-edit"
                      checked={formValues.isManualEdit}
                      onChange={(e) => handleManualEditChange(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor="manual-edit" className="text-xs">
                      கைமுறையாக திருத்த (Manual Edit)
                    </Label>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                சொத்து விவரங்கள் தாவலில் உள்ள மொத்த மதிப்பிலிருந்து பெறப்பட்டது (Auto-populated from Total Value of this Deed)
              </p>
            </div>

            <div className="md:col-span-2">
              <RequiredFieldLabel htmlFor="amount-in-words" className="text-purple-700">
                தொகை (எழுத்துகளில்) (Amount in Words)
              </RequiredFieldLabel>
              <Input
                id="amount-in-words"
                placeholder="Zero"
                value={formValues.amountInWords}
                onChange={(e) => handleAmountInWordsChange(e.target.value)}
                className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                  hasError("தொகையை எழுத்துகளில்") ? "border-red-500" : ""
                }`}
                readOnly={!formValues.isManualEdit}
              />
            </div>
          </div>
        </Card>

        {!totalPaymentsMatch() && (
          <Alert className="mt-4 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              பணப்பட்டுவாடா தொகைகளின் கூட்டுத்தொகை ({calculateTotalPayments()}) மொத்த தொகையுடன் ({formValues.totalAmount})
              பொருந்தவில்லை
            </AlertDescription>
          </Alert>
        )}

        {formValues.payments.map((payment, index) => {
          const paymentErrors = getPaymentErrors(index)

          return (
            <Card key={payment.id} className="p-4 border-purple-200 mt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-purple-700 mb-3 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-purple-600" />
                  பணப்பட்டுவாடா விவரங்கள் (Payment Details) #{index + 1}
                </h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removePayment(index)}
                  disabled={formValues.payments.length <= 1}
                  className="h-8"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> நீக்கு (Remove)
                </Button>
              </div>

              {paymentErrors.length > 0 && (
                <Alert variant="destructive" className="mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2">
                      {paymentErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Separator className="my-2 bg-purple-200" />

              <div className="mt-3">
                <h5 className="text-sm font-medium text-purple-700 mb-2">பணப்பட்டுவாடா வரைபடம் (Payment Mapping)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <RequiredFieldLabel htmlFor={`from-buyer-${index}`} className="text-purple-700">
                      இருந்து (From)
                    </RequiredFieldLabel>
                    <Select
                      value={payment.fromBuyer}
                      onValueChange={(value) => handlePaymentChange(index, "fromBuyer", value)}
                    >
                      <SelectTrigger
                        id={`from-buyer-${index}`}
                        className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                          hasError(`பணப்பட்டுவாடா #${index + 1}: வாங்குபவரைத் தேர்ந்தெடுக்கவும்`) ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="வாங்குபவரைத் தேர்ந்தெடுக்கவும் (Select Buyer)" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.buyers?.map((buyer: any) => (
                          <SelectItem key={buyer.id} value={buyer.id.toString()}>
                            {buyer.name}
                          </SelectItem>
                        )) || <SelectItem value="no-buyers">No buyers added</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <RequiredFieldLabel htmlFor={`to-seller-${index}`} className="text-purple-700">
                      க்கு (To)
                    </RequiredFieldLabel>
                    <Select
                      value={payment.toSeller}
                      onValueChange={(value) => handlePaymentChange(index, "toSeller", value)}
                    >
                      <SelectTrigger
                        id={`to-seller-${index}`}
                        className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                          hasError(`பணப்பட்டுவாடா #${index + 1}: விற்பவரைத் தேர்ந்தெடுக்கவும்`) ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="விற்பவரைத் தேர்ந்தெடுக்கவும் (Select Seller)" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.sellers?.map((seller: any) => (
                          <SelectItem key={seller.id} value={seller.id.toString()}>
                            {seller.name}
                          </SelectItem>
                        )) || <SelectItem value="no-sellers">No sellers added</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <RequiredFieldLabel htmlFor={`amount-${index}`} className="text-purple-700">
                    தொகை (Amount)
                  </RequiredFieldLabel>
                  <Input
                    id={`amount-${index}`}
                    placeholder="தொகையை உள்ளிடவும்"
                    value={payment.amount}
                    onChange={(e) => handlePaymentChange(index, "amount", e.target.value)}
                    className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                      hasError(`பணப்பட்டுவாடா #${index + 1}: தொகை`) ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <div>
                  <Label htmlFor={`amount-in-words-${index}`} className="text-purple-700">
                    தொகை (எழுத்துகளில்) (Amount in Words)
                  </Label>
                  <Input
                    id={`amount-in-words-${index}`}
                    placeholder=""
                    value={payment.amountInWords}
                    onChange={(e) => handlePaymentChange(index, "amountInWords", e.target.value)}
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    readOnly={true}
                  />
                </div>
              </div>

              <div className="mt-4">
                <RequiredFieldLabel htmlFor={`payment-method-${index}`} className="text-purple-700">
                  பணப்பட்டுவாடா முறை (Payment Method)
                </RequiredFieldLabel>
                <Select
                  value={payment.paymentMethod}
                  onValueChange={(value) => handlePaymentChange(index, "paymentMethod", value)}
                >
                  <SelectTrigger
                    id={`payment-method-${index}`}
                    className={`mt-1 border-purple-200 focus-visible:ring-purple-400 ${
                      hasError(`பணப்பட்டுவாடா #${index + 1}: பணப்பட்டுவாடா முறை`) ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="பணப்பட்டுவாடா முறையைத் தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {payment.paymentMethod && renderPaymentMethodFields(payment, index)}
            </Card>
          )
        })}

        <Button
          variant="outline"
          className="w-full mt-4 border-dashed border-purple-300 text-purple-700 hover:bg-purple-50"
          onClick={addPayment}
        >
          <Plus className="h-4 w-4 mr-2" /> பணப்பட்டுவாடா சேர்க்க (Add Payment)
        </Button>
      </div>
    </div>
  )
}
