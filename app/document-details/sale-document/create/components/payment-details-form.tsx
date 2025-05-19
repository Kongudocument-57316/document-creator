"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { FormError } from "@/components/ui/form-error"
import { isRequired, isPositiveNumber, isValidDate, isNotFutureDate, errorMessages } from "@/lib/validation"

export default function PaymentDetailsForm({ data, updateData }) {
  const [formState, setFormState] = useState(data)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const [totalValue, setTotalValue] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState("")
  const [paymentReference, setPaymentReference] = useState("")
  const [buyerBankName, setBuyerBankName] = useState("")
  const [buyerBankBranch, setBuyerBankBranch] = useState("")
  const [buyerAccountType, setBuyerAccountType] = useState("")
  const [buyerAccountNumber, setBuyerAccountNumber] = useState("")
  const [sellerBankName, setSellerBankName] = useState("")
  const [sellerBankBranch, setSellerBankBranch] = useState("")
  const [sellerAccountType, setSellerAccountType] = useState("")
  const [sellerAccountNumber, setSellerAccountNumber] = useState("")

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: methodsData } = await supabase.from("payment_methods").select("id, name")

        setPaymentMethods(methodsData || [])
      } catch (error) {
        console.error("Error fetching payment methods:", error)
        toast.error("பணம் செலுத்தும் முறைகளை பெறுவதில் பிழை ஏற்பட்டது")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentMethods()
  }, [])

  useEffect(() => {
    if (formState.paymentDetails) {
      setTotalValue(formState.paymentDetails.totalValue || "")
      setPaymentMethod(formState.paymentDetails.paymentMethod || "cash")
      setPaymentAmount(formState.paymentDetails.paymentAmount || "")
      setPaymentDate(formState.paymentDetails.paymentDate || "")
      setPaymentReference(formState.paymentDetails.paymentReference || "")
      setBuyerBankName(formState.paymentDetails.buyerBankName || "")
      setBuyerBankBranch(formState.paymentDetails.buyerBankBranch || "")
      setBuyerAccountType(formState.paymentDetails.buyerAccountType || "")
      setBuyerAccountNumber(formState.paymentDetails.buyerAccountNumber || "")
      setSellerBankName(formState.paymentDetails.sellerBankName || "")
      setSellerBankBranch(formState.paymentDetails.sellerBankBranch || "")
      setSellerAccountType(formState.paymentDetails.sellerAccountType || "")
      setSellerAccountNumber(formState.paymentDetails.sellerAccountNumber || "")
    }
  }, [formState.paymentDetails])

  const validateField = (field, value) => {
    switch (field) {
      case "totalValue":
        if (!isRequired(value)) return errorMessages.required
        if (!isPositiveNumber(value)) return errorMessages.positiveNumber
        return ""
      case "paymentMethod":
        return isRequired(value) ? "" : errorMessages.required
      case "paymentAmount":
        if (!isPositiveNumber(value) && value) return errorMessages.positiveNumber
        return ""
      case "paymentDate":
        if (!isValidDate(value) && value) return errorMessages.date
        if (!isNotFutureDate(value) && value) return errorMessages.futureDate
        return ""
      case "paymentReference":
        // Only required for non-cash payments
        if (paymentMethod !== "cash" && !isRequired(value)) return errorMessages.required
        return ""
      case "buyerBankName":
        // Only required for non-cash payments
        if (paymentMethod !== "cash" && !isRequired(value)) return errorMessages.required
        return ""
      case "buyerAccountNumber":
        // Only required for non-cash payments
        if (paymentMethod !== "cash" && !isRequired(value)) return errorMessages.required
        return ""
      case "sellerBankName":
        // Only required for electronic transfers
        if (["upi", "neft", "rtgs", "imps"].includes(paymentMethod) && !isRequired(value)) return errorMessages.required
        return ""
      case "sellerAccountNumber":
        // Only required for electronic transfers
        if (["upi", "neft", "rtgs", "imps"].includes(paymentMethod) && !isRequired(value)) return errorMessages.required
        return ""
      default:
        return ""
    }
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    // Validate required fields
    newErrors.totalValue = validateField("totalValue", totalValue)
    if (newErrors.totalValue) isValid = false

    newErrors.paymentMethod = validateField("paymentMethod", paymentMethod)
    if (newErrors.paymentMethod) isValid = false

    // Validate payment date if provided
    if (paymentDate) {
      newErrors.paymentDate = validateField("paymentDate", paymentDate)
      if (newErrors.paymentDate) isValid = false
    }

    // Validate payment amount if provided
    if (paymentAmount) {
      newErrors.paymentAmount = validateField("paymentAmount", paymentAmount)
      if (newErrors.paymentAmount) isValid = false
    }

    // Validate fields based on payment method
    if (paymentMethod !== "cash") {
      newErrors.paymentReference = validateField("paymentReference", paymentReference)
      if (newErrors.paymentReference) isValid = false

      newErrors.buyerBankName = validateField("buyerBankName", buyerBankName)
      if (newErrors.buyerBankName) isValid = false

      newErrors.buyerAccountNumber = validateField("buyerAccountNumber", buyerAccountNumber)
      if (newErrors.buyerAccountNumber) isValid = false

      // For electronic transfers, validate seller bank details
      if (["upi", "neft", "rtgs", "imps"].includes(paymentMethod)) {
        newErrors.sellerBankName = validateField("sellerBankName", sellerBankName)
        if (newErrors.sellerBankName) isValid = false

        newErrors.sellerAccountNumber = validateField("sellerAccountNumber", sellerAccountNumber)
        if (newErrors.sellerAccountNumber) isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleFieldChange = (field, value) => {
    // Update the appropriate state based on field
    switch (field) {
      case "totalValue":
        setTotalValue(value)
        break
      case "paymentMethod":
        setPaymentMethod(value)
        break
      case "paymentAmount":
        setPaymentAmount(value)
        break
      case "paymentDate":
        setPaymentDate(value)
        break
      case "paymentReference":
        setPaymentReference(value)
        break
      case "buyerBankName":
        setBuyerBankName(value)
        break
      case "buyerBankBranch":
        setBuyerBankBranch(value)
        break
      case "buyerAccountType":
        setBuyerAccountType(value)
        break
      case "buyerAccountNumber":
        setBuyerAccountNumber(value)
        break
      case "sellerBankName":
        setSellerBankName(value)
        break
      case "sellerBankBranch":
        setSellerBankBranch(value)
        break
      case "sellerAccountType":
        setSellerAccountType(value)
        break
      case "sellerAccountNumber":
        setSellerAccountNumber(value)
        break
      default:
        break
    }

    // Mark field as touched
    setTouched({ ...touched, [field]: true })

    // Validate the field
    const error = validateField(field, value)
    setErrors({ ...errors, [field]: error })
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })

    let value
    switch (field) {
      case "totalValue":
        value = totalValue
        break
      case "paymentMethod":
        value = paymentMethod
        break
      case "paymentAmount":
        value = paymentAmount
        break
      case "paymentDate":
        value = paymentDate
        break
      case "paymentReference":
        value = paymentReference
        break
      case "buyerBankName":
        value = buyerBankName
        break
      case "buyerBankBranch":
        value = buyerBankBranch
        break
      case "buyerAccountType":
        value = buyerAccountType
        break
      case "buyerAccountNumber":
        value = buyerAccountNumber
        break
      case "sellerBankName":
        value = sellerBankName
        break
      case "sellerBankBranch":
        value = sellerBankBranch
        break
      case "sellerAccountType":
        value = sellerAccountType
        break
      case "sellerAccountNumber":
        value = sellerAccountNumber
        break
      default:
        value = ""
        break
    }

    const error = validateField(field, value)
    setErrors({ ...errors, [field]: error })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Mark all relevant fields as touched
    const allTouched = {
      totalValue: true,
      paymentMethod: true,
      paymentAmount: true,
      paymentDate: true,
    }

    // Add fields based on payment method
    if (paymentMethod !== "cash") {
      allTouched.paymentReference = true
      allTouched.buyerBankName = true
      allTouched.buyerAccountNumber = true

      if (["upi", "neft", "rtgs", "imps"].includes(paymentMethod)) {
        allTouched.sellerBankName = true
        allTouched.sellerAccountNumber = true
      }
    }

    setTouched(allTouched)

    if (validateForm()) {
      const paymentData = {
        totalValue,
        paymentMethod,
        paymentAmount,
        paymentDate,
        paymentReference,
        buyerBankName,
        buyerBankBranch,
        buyerAccountType,
        buyerAccountNumber,
        sellerBankName,
        sellerBankBranch,
        sellerAccountType,
        sellerAccountNumber,
      }

      updateData({
        ...formState,
        paymentDetails: paymentData,
      })
    } else {
      toast.error("படிவத்தில் பிழைகள் உள்ளன. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.")
    }
  }

  if (loading) {
    return <div>தரவுகளை ஏற்றுகிறது...</div>
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalValue" className={errors.totalValue && touched.totalValue ? "text-red-500" : ""}>
            மொத்த மதிப்பு (ரூ.) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="totalValue"
            type="number"
            value={totalValue}
            onChange={(e) => handleFieldChange("totalValue", e.target.value)}
            onBlur={() => handleBlur("totalValue")}
            className={errors.totalValue && touched.totalValue ? "border-red-500" : ""}
            required
          />
          {touched.totalValue && <FormError message={errors.totalValue} />}
        </div>

        {/* Payment method selection */}
        <div className="space-y-2">
          <Label
            htmlFor="paymentMethod"
            className={errors.paymentMethod && touched.paymentMethod ? "text-red-500" : ""}
          >
            பணம் செலுத்தும் முறை <span className="text-red-500">*</span>
          </Label>
          <Select
            value={paymentMethod}
            onValueChange={(value) => handleFieldChange("paymentMethod", value)}
            onOpenChange={() => handleBlur("paymentMethod")}
          >
            <SelectTrigger
              id="paymentMethod"
              className={errors.paymentMethod && touched.paymentMethod ? "border-red-500" : ""}
            >
              <SelectValue placeholder="பணம் செலுத்தும் முறையைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">ரொக்கம்</SelectItem>
              <SelectItem value="cheque">காசோலை</SelectItem>
              <SelectItem value="dd">வங்கி வரைவோலை</SelectItem>
              <SelectItem value="upi">UPI / G-Pay</SelectItem>
              <SelectItem value="neft">NEFT</SelectItem>
              <SelectItem value="rtgs">RTGS</SelectItem>
              <SelectItem value="imps">IMPS</SelectItem>
            </SelectContent>
          </Select>
          {touched.paymentMethod && <FormError message={errors.paymentMethod} />}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="paymentAmount"
            className={errors.paymentAmount && touched.paymentAmount ? "text-red-500" : ""}
          >
            செலுத்திய தொகை (ரூ.)
          </Label>
          <Input
            id="paymentAmount"
            type="number"
            value={paymentAmount}
            onChange={(e) => handleFieldChange("paymentAmount", e.target.value)}
            onBlur={() => handleBlur("paymentAmount")}
            className={errors.paymentAmount && touched.paymentAmount ? "border-red-500" : ""}
          />
          {touched.paymentAmount && <FormError message={errors.paymentAmount} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDate" className={errors.paymentDate && touched.paymentDate ? "text-red-500" : ""}>
            பணம் செலுத்திய தேதி
          </Label>
          <Input
            id="paymentDate"
            type="date"
            value={paymentDate}
            onChange={(e) => handleFieldChange("paymentDate", e.target.value)}
            onBlur={() => handleBlur("paymentDate")}
            className={errors.paymentDate && touched.paymentDate ? "border-red-500" : ""}
            max={new Date().toISOString().split("T")[0]} // இன்றைய தேதி வரை மட்டும்
          />
          {touched.paymentDate && <FormError message={errors.paymentDate} />}
        </div>
      </div>

      {/* Bank details fields - show based on payment method */}
      {paymentMethod !== "cash" && (
        <>
          {/* Buyer's bank details */}
          <div className="mb-4 mt-4">
            <h3 className="text-lg font-medium mb-2">வாங்குபவரின் வங்கி விவரங்கள்</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="buyerBankName"
                  className={errors.buyerBankName && touched.buyerBankName ? "text-red-500" : ""}
                >
                  வங்கியின் பெயர் <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="buyerBankName"
                  value={buyerBankName}
                  onChange={(e) => handleFieldChange("buyerBankName", e.target.value)}
                  onBlur={() => handleBlur("buyerBankName")}
                  className={`mt-1 ${errors.buyerBankName && touched.buyerBankName ? "border-red-500" : ""}`}
                />
                {touched.buyerBankName && <FormError message={errors.buyerBankName} />}
              </div>
              <div>
                <Label htmlFor="buyerBankBranch">வங்கிக் கிளை</Label>
                <Input
                  id="buyerBankBranch"
                  value={buyerBankBranch}
                  onChange={(e) => handleFieldChange("buyerBankBranch", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="buyerAccountType">கணக்கு வகை</Label>
                <Input
                  id="buyerAccountType"
                  value={buyerAccountType}
                  onChange={(e) => handleFieldChange("buyerAccountType", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="buyerAccountNumber"
                  className={errors.buyerAccountNumber && touched.buyerAccountNumber ? "text-red-500" : ""}
                >
                  கணக்கு எண் <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="buyerAccountNumber"
                  value={buyerAccountNumber}
                  onChange={(e) => handleFieldChange("buyerAccountNumber", e.target.value)}
                  onBlur={() => handleBlur("buyerAccountNumber")}
                  className={`mt-1 ${errors.buyerAccountNumber && touched.buyerAccountNumber ? "border-red-500" : ""}`}
                />
                {touched.buyerAccountNumber && <FormError message={errors.buyerAccountNumber} />}
              </div>
            </div>
          </div>

          {/* Show seller's bank details only for electronic transfers */}
          {(paymentMethod === "upi" ||
            paymentMethod === "neft" ||
            paymentMethod === "rtgs" ||
            paymentMethod === "imps") && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">விற்பவரின் வங்கி விவரங்கள்</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="sellerBankName"
                    className={errors.sellerBankName && touched.sellerBankName ? "text-red-500" : ""}
                  >
                    வங்கியின் பெயர் <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="sellerBankName"
                    value={sellerBankName}
                    onChange={(e) => handleFieldChange("sellerBankName", e.target.value)}
                    onBlur={() => handleBlur("sellerBankName")}
                    className={`mt-1 ${errors.sellerBankName && touched.sellerBankName ? "border-red-500" : ""}`}
                  />
                  {touched.sellerBankName && <FormError message={errors.sellerBankName} />}
                </div>
                <div>
                  <Label htmlFor="sellerBankBranch">வங்கிக் கிளை</Label>
                  <Input
                    id="sellerBankBranch"
                    value={sellerBankBranch}
                    onChange={(e) => handleFieldChange("sellerBankBranch", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sellerAccountType">கணக்கு வகை</Label>
                  <Input
                    id="sellerAccountType"
                    value={sellerAccountType}
                    onChange={(e) => handleFieldChange("sellerAccountType", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="sellerAccountNumber"
                    className={errors.sellerAccountNumber && touched.sellerAccountNumber ? "text-red-500" : ""}
                  >
                    கணக்கு எண் <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="sellerAccountNumber"
                    value={sellerAccountNumber}
                    onChange={(e) => handleFieldChange("sellerAccountNumber", e.target.value)}
                    onBlur={() => handleBlur("sellerAccountNumber")}
                    className={`mt-1 ${errors.sellerAccountNumber && touched.sellerAccountNumber ? "border-red-500" : ""}`}
                  />
                  {touched.sellerAccountNumber && <FormError message={errors.sellerAccountNumber} />}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment reference number field - show for all methods except cash */}
      {paymentMethod !== "cash" && (
        <div className="mb-4">
          <Label
            htmlFor="paymentReference"
            className={errors.paymentReference && touched.paymentReference ? "text-red-500" : ""}
          >
            {paymentMethod === "cheque" ? "காசோலை எண்" : paymentMethod === "dd" ? "வரைவோலை எண்" : "பரிவர்த்தனை எண்"}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="paymentReference"
            value={paymentReference}
            onChange={(e) => handleFieldChange("paymentReference", e.target.value)}
            onBlur={() => handleBlur("paymentReference")}
            className={`mt-1 ${errors.paymentReference && touched.paymentReference ? "border-red-500" : ""}`}
          />
          {touched.paymentReference && <FormError message={errors.paymentReference} />}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <span className="text-red-500">*</span> குறிக்கப்பட்ட புலங்கள் கட்டாயமாக நிரப்பப்பட வேண்டும்
      </div>

      <Button type="submit" className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">
        அடுத்த பக்கம்
      </Button>
    </form>
  )
}
