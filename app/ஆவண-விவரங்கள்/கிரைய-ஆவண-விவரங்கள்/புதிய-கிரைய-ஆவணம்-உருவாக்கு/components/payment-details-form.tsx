"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

export default function PaymentDetailsForm({ data, updateData }) {
  const [formState, setFormState] = useState(data)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleChange = (field, value) => {
    const updatedState = { ...formState, [field]: value }
    setFormState(updatedState)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateData(formState)
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
            value={formState.totalValue}
            onChange={(e) => handleChange("totalValue", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethodId">பணம் செலுத்தும் முறை</Label>
          <Select value={formState.paymentMethodId} onValueChange={(value) => handleChange("paymentMethodId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="பணம் செலுத்தும் முறையைத் தேர்ந்தெடுக்கவும்" />
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

        <div className="space-y-2">
          <Label htmlFor="paymentReference">பணம் செலுத்திய குறிப்பு</Label>
          <Input
            id="paymentReference"
            value={formState.paymentReference}
            onChange={(e) => handleChange("paymentReference", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentAmount">செலுத்திய தொகை (ரூ.)</Label>
          <Input
            id="paymentAmount"
            type="number"
            value={formState.paymentAmount}
            onChange={(e) => handleChange("paymentAmount", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDate">பணம் செலுத்திய தேதி</Label>
          <Input
            id="paymentDate"
            type="date"
            value={formState.paymentDate}
            onChange={(e) => handleChange("paymentDate", e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">
        அடுத்த பக்கம்
      </Button>
    </form>
  )
}
