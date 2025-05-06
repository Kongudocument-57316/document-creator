"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { CreditCard, Calendar, DollarSign } from "lucide-react"

interface PaymentTabProps {
  data: any
  updateData: (data: any) => void
}

export function PaymentTab({ data, updateData }: PaymentTabProps) {
  const [formValues, setFormValues] = useState({
    totalAmount: data.totalAmount || "",
    advanceAmount: data.advanceAmount || "",
    remainingAmount: data.remainingAmount || "",
    paymentMethod: data.paymentMethod || "",
    paymentDate: data.paymentDate || "",
    paymentDetails: data.paymentDetails || "",
  })

  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseBrowserClient()

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

  // Calculate remaining amount when total or advance changes
  const calculateRemainingAmount = () => {
    if (formValues.totalAmount && formValues.advanceAmount) {
      const total = Number.parseFloat(formValues.totalAmount)
      const advance = Number.parseFloat(formValues.advanceAmount)
      if (!isNaN(total) && !isNaN(advance)) {
        return (total - advance).toString()
      }
    }
    return ""
  }

  const handleChange = (field: string, value: string) => {
    const newValues = { ...formValues, [field]: value }

    // If total or advance amount changed, recalculate remaining
    if (field === "totalAmount" || field === "advanceAmount") {
      const total = field === "totalAmount" ? value : formValues.totalAmount
      const advance = field === "advanceAmount" ? value : formValues.advanceAmount

      if (total && advance) {
        const totalNum = Number.parseFloat(total)
        const advanceNum = Number.parseFloat(advance)
        if (!isNaN(totalNum) && !isNaN(advanceNum)) {
          newValues.remainingAmount = (totalNum - advanceNum).toString()
        }
      }
    }

    setFormValues(newValues)
    updateData(newValues)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
          பணப்பட்டுவாடா விவரங்கள்
        </h3>
        <Separator className="my-4 bg-purple-200" />

        <Card className="p-4 border-purple-200">
          <h4 className="text-md font-medium text-purple-700 mb-3 flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
            தொகை விவரங்கள்
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total-amount" className="text-purple-700">
                மொத்த தொகை (Total Amount)
              </Label>
              <Input
                id="total-amount"
                placeholder="மொத்த தொகையை உள்ளிடவும்"
                value={formValues.totalAmount}
                onChange={(e) => handleChange("totalAmount", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="advance-amount" className="text-purple-700">
                முன்பணம் (Advance Amount)
              </Label>
              <Input
                id="advance-amount"
                placeholder="முன்பணத்தை உள்ளிடவும்"
                value={formValues.advanceAmount}
                onChange={(e) => handleChange("advanceAmount", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="remaining-amount" className="text-purple-700">
                மீதமுள்ள தொகை (Remaining Amount)
              </Label>
              <Input
                id="remaining-amount"
                placeholder="மீதமுள்ள தொகை"
                value={formValues.remainingAmount}
                readOnly
                className="mt-1 border-purple-200 focus-visible:ring-purple-400 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">தானாக கணக்கிடப்படுகிறது</p>
            </div>
          </div>
        </Card>

        <Separator className="my-4 bg-purple-200" />

        <Card className="p-4 border-purple-200 mt-4">
          <h4 className="text-md font-medium text-purple-700 mb-3 flex items-center">
            <CreditCard className="h-4 w-4 mr-2 text-purple-600" />
            பணம் செலுத்தும் முறை விவரங்கள்
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment-method" className="text-purple-700">
                பணம் செலுத்தும் முறை (Payment Method)
              </Label>
              <Select value={formValues.paymentMethod} onValueChange={(value) => handleChange("paymentMethod", value)}>
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
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

            <div>
              <Label htmlFor="payment-date" className="text-purple-700">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  பணம் செலுத்திய தேதி (Payment Date)
                </span>
              </Label>
              <Input
                id="payment-date"
                type="date"
                value={formValues.paymentDate}
                onChange={(e) => handleChange("paymentDate", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
        </Card>

        <Separator className="my-4 bg-purple-200" />

        <Card className="p-4 border-purple-200 mt-4">
          <div>
            <Label htmlFor="payment-details" className="text-purple-700">
              கூடுதல் பணப்பட்டுவாடா விவரங்கள் (Additional Payment Details)
            </Label>
            <Textarea
              id="payment-details"
              placeholder="கூடுதல் பணப்பட்டுவாடா விவரங்களை உள்ளிடவும்"
              value={formValues.paymentDetails}
              onChange={(e) => handleChange("paymentDetails", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
