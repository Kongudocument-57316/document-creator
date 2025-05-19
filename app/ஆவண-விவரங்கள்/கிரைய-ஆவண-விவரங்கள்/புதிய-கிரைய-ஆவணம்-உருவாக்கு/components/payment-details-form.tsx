"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

export default function PaymentDetailsForm({ data, updateData, onSubmit, onComplete }) {
  const [formState, setFormState] = useState(data)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)

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
        const supabase = createClient()
        const { data: methodsData } = await supabase.from("payment_methods").select("id, name")

        setPaymentMethods(methodsData || [])
      } catch (error) {
        console.error("Error fetching payment methods:", error)
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

  const handleChange = (field, value) => {
    const updatedState = { ...formState, [field]: value }
    setFormState(updatedState)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

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

    onSubmit(paymentData)
    onComplete()
  }

  if (loading) {
    return <div>தரவுகளை ஏற்றுகிறது...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalValue">மொத்த மதிப்பு (ரூ.)</Label>
          <Input
            id="totalValue"
            type="number"
            value={totalValue}
            onChange={(e) => setTotalValue(e.target.value)}
            required
          />
        </div>

        {/* Payment method selection */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">பணம் செலுத்தும் முறை</Label>
          <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value)}>
            <SelectTrigger id="paymentMethod">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentAmount">செலுத்திய தொகை (ரூ.)</Label>
          <Input
            id="paymentAmount"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDate">பணம் செலுத்திய தேதி</Label>
          <Input id="paymentDate" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
        </div>
      </div>

      {/* Bank details fields - show based on payment method */}
      {paymentMethod !== "cash" && (
        <>
          {/* Buyer's bank details */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">வாங்குபவரின் வங்கி விவரங்கள்</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyerBankName">வங்கியின் பெயர்</Label>
                <Input
                  id="buyerBankName"
                  value={buyerBankName}
                  onChange={(e) => setBuyerBankName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="buyerBankBranch">வங்கிக் கிளை</Label>
                <Input
                  id="buyerBankBranch"
                  value={buyerBankBranch}
                  onChange={(e) => setBuyerBankBranch(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="buyerAccountType">கணக்கு வகை</Label>
                <Input
                  id="buyerAccountType"
                  value={buyerAccountType}
                  onChange={(e) => setBuyerAccountType(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="buyerAccountNumber">கணக்கு எண்</Label>
                <Input
                  id="buyerAccountNumber"
                  value={buyerAccountNumber}
                  onChange={(e) => setBuyerAccountNumber(e.target.value)}
                  className="mt-1"
                />
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
                  <Label htmlFor="sellerBankName">வங்கியின் பெயர்</Label>
                  <Input
                    id="sellerBankName"
                    value={sellerBankName}
                    onChange={(e) => setSellerBankName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sellerBankBranch">வங்கிக் கிளை</Label>
                  <Input
                    id="sellerBankBranch"
                    value={sellerBankBranch}
                    onChange={(e) => setSellerBankBranch(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sellerAccountType">கணக்கு வகை</Label>
                  <Input
                    id="sellerAccountType"
                    value={sellerAccountType}
                    onChange={(e) => setSellerAccountType(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sellerAccountNumber">கணக்கு எண்</Label>
                  <Input
                    id="sellerAccountNumber"
                    value={sellerAccountNumber}
                    onChange={(e) => setSellerAccountNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment reference number field - show for all methods except cash */}
      {paymentMethod !== "cash" && (
        <div className="mb-4">
          <Label htmlFor="paymentReference">
            {paymentMethod === "cheque" ? "காசோலை எண்" : paymentMethod === "dd" ? "வரைவோலை எண்" : "பரிவர்த்தனை எண்"}
          </Label>
          <Input
            id="paymentReference"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            className="mt-1"
          />
        </div>
      )}

      <Button type="submit" className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">
        அடுத்த பக்கம்
      </Button>
    </form>
  )
}
