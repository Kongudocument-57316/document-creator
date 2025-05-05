"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PaymentTabProps {
  data: any[]
  updateData: (data: any[]) => void
}

export function PaymentTab({ data, updateData }: PaymentTabProps) {
  const [saleAmount, setSaleAmount] = useState(data.saleAmount || "0.00")
  const [amountInWords, setAmountInWords] = useState(data.amountInWords || "")
  const [manualEdit, setManualEdit] = useState(data.manualEdit || false)
  const [payments, setPayments] = useState<any[]>(
    data.length > 0 && Array.isArray(data) ? data : [createEmptyPayment()],
  )
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseBrowserClient()

  function createEmptyPayment() {
    return {
      id: Date.now(), // Temporary ID for UI purposes
      fromId: "",
      toId: "",
      amount: "0.00",
      amountInWords: "",
      paymentMethodId: "",
    }
  }

  useEffect(() => {
    async function fetchReferenceData() {
      try {
        setLoading(true)

        // Fetch payment methods
        const { data: methodsData } = await supabase.from("payment_methods").select("id, name").order("name")

        if (methodsData) setPaymentMethods(methodsData)
      } catch (error) {
        console.error("Error fetching reference data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [supabase])

  const handleSaleAmountChange = (value: string) => {
    setSaleAmount(value)

    // Update the form data
    const updatedData = [...payments]
    updatedData.saleAmount = value
    updateData(updatedData)
  }

  const handleAmountInWordsChange = (value: string) => {
    setAmountInWords(value)

    // Update the form data
    const updatedData = [...payments]
    updatedData.amountInWords = value
    updateData(updatedData)
  }

  const handleManualEditChange = (value: boolean) => {
    setManualEdit(value)

    // Update the form data
    const updatedData = [...payments]
    updatedData.manualEdit = value
    updateData(updatedData)
  }

  const handleChange = (index: number, field: string, value: string) => {
    const updatedPayments = [...payments]
    updatedPayments[index] = { ...updatedPayments[index], [field]: value }
    setPayments(updatedPayments)
    updateData(updatedPayments)
  }

  const addPayment = () => {
    const updatedPayments = [...payments, createEmptyPayment()]
    setPayments(updatedPayments)
    updateData(updatedPayments)
  }

  const removePayment = (index: number) => {
    if (payments.length === 1) return // Keep at least one payment

    const updatedPayments = payments.filter((_, i) => i !== index)
    setPayments(updatedPayments)
    updateData(updatedPayments)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-purple-800">பணப்பட்டுவாடா விவரங்கள்</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>கிரையத் தொகை (Sale Amount)</Label>
          <div className="flex items-center gap-2">
            <Input
              value={saleAmount}
              onChange={(e) => handleSaleAmountChange(e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              type="number"
              step="0.01"
            />

            <RadioGroup
              value={manualEdit ? "manual" : "auto"}
              onValueChange={(value) => handleManualEditChange(value === "manual")}
              className="flex items-center gap-2 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="auto" id="auto-calculate" />
                <Label htmlFor="auto-calculate" className="text-sm">
                  தானியங்கி (Auto)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="manual" id="manual-edit" />
                <Label htmlFor="manual-edit" className="text-sm">
                  கைமுறையாக திருத்த (Manual Edit)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label>தொகை (எழுத்துகளில்) (Amount in Words)</Label>
          <Input
            value={amountInWords}
            onChange={(e) => handleAmountInWordsChange(e.target.value)}
            className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            placeholder="Zero"
          />
          <p className="text-xs text-gray-500 mt-1">
            சொத்து விவரங்கள் தாவலில் உள்ள மொத்த மதிப்பிலிருந்து தானாகவே நிரப்பப்பட்டது (Auto-populated from Total Value of this Deed)
          </p>
        </div>
      </div>

      {payments.map((payment, index) => (
        <Card key={payment.id} className="border-purple-200">
          <CardHeader className="bg-purple-50 rounded-t-lg flex flex-row items-center justify-between">
            <CardTitle className="text-purple-700">பணப்பட்டுவாடா விவரங்கள் #{index + 1}</CardTitle>
            {payments.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePayment(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                நீக்கு (Remove)
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label>பணப்பட்டுவாடா வரைபடம் (Payment Mapping)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label>இருந்து (From)</Label>
                    <Select value={payment.fromId} onValueChange={(value) => handleChange(index, "fromId", value)}>
                      <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                        <SelectValue placeholder="வாங்குபவரைத் தேர்ந்தெடுக்கவும் (Select Buyer)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer1">வாங்குபவர் 1</SelectItem>
                        <SelectItem value="buyer2">வாங்குபவர் 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>க்கு (To)</Label>
                    <Select value={payment.toId} onValueChange={(value) => handleChange(index, "toId", value)}>
                      <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                        <SelectValue placeholder="விற்பனையாளரைத் தேர்ந்தெடுக்கவும் (Select Seller)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seller1">விற்பனையாளர் 1</SelectItem>
                        <SelectItem value="seller2">விற்பனையாளர் 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>தொகை (Amount)</Label>
                  <Input
                    value={payment.amount}
                    onChange={(e) => handleChange(index, "amount", e.target.value)}
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    type="number"
                    step="0.01"
                    placeholder="தொகையை உள்ளிடவும்"
                  />
                </div>

                <div>
                  <Label>தொகை (எழுத்துகளில்) (Amount in Words)</Label>
                  <Input
                    value={payment.amountInWords}
                    onChange={(e) => handleChange(index, "amountInWords", e.target.value)}
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    placeholder="தொகையை எழுத்துகளில் உள்ளிடவும்"
                  />
                </div>
              </div>

              <div>
                <Label>பணப்பட்டுவாடா முறை (Payment Method)</Label>
                <Select
                  value={payment.paymentMethodId}
                  onValueChange={(value) => handleChange(index, "paymentMethodId", value)}
                >
                  <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
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
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addPayment}
        className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
      >
        <Plus className="h-4 w-4 mr-2" />
        மற்றொரு பணப்பட்டுவாடா சேர்க்க
      </Button>
    </div>
  )
}
