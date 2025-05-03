"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { DocumentLivePreview } from "./document-live-preview"
import { saveMortgageLoanDocument } from "./save-document-action"
import { fetchTypists, fetchTypistOffices } from "./fetch-typist-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Borrower, MultipleBorrowers } from "./multiple-borrowers"
import { type Lender, MultipleLenders } from "./multiple-lenders"

export function CreateMortgageLoanForm() {
  const router = useRouter()
  const [typists, setTypists] = useState<any[]>([])
  const [typistOffices, setTypistOffices] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("form")

  const [formData, setFormData] = useState({
    documentDate: new Date(),
    documentNumber: "",
    registrationNumber: "",
    registrationDate: new Date(),
    propertyDescription: "",
    propertyValue: "",
    loanAmount: "",
    loanAmountInWords: "",
    loanPeriod: "",
    interestRate: "",
    typistId: "",
    typistOfficeId: "",
    witnessName1: "",
    witnessAddress1: "",
    witnessName2: "",
    witnessAddress2: "",
    notes: "",
  })

  const [borrowers, setBorrowers] = useState<Borrower[]>([
    {
      id: "borrower-1",
      name: "",
      age: "",
      occupation: "",
      address: "",
    },
  ])

  const [lenders, setLenders] = useState<Lender[]>([
    {
      id: "lender-1",
      name: "",
      age: "",
      occupation: "",
      address: "",
    },
  ])

  useEffect(() => {
    const loadData = async () => {
      const typistData = await fetchTypists()
      const officeData = await fetchTypistOffices()
      setTypists(typistData)
      setTypistOffices(officeData)
    }
    loadData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await saveMortgageLoanDocument({
        ...formData,
        borrowers,
        lenders,
      })

      if (result.success) {
        router.push(`/document-details/mortgage-loan/view/${result.documentId}`)
      } else {
        console.error("Failed to save document:", result.error)
        alert("ஆவணத்தை சேமிக்க முடியவில்லை: " + result.error)
      }
    } catch (error) {
      console.error("Error saving document:", error)
      alert("ஆவணத்தை சேமிக்கும் போது பிழை ஏற்பட்டது")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">படிவம்</TabsTrigger>
          <TabsTrigger value="preview">முன்னோட்டம்</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>அடமான கடன் ஆவண விவரங்கள்</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">ஆவண எண்</Label>
                    <Input
                      id="documentNumber"
                      name="documentNumber"
                      value={formData.documentNumber}
                      onChange={handleInputChange}
                      placeholder="ஆவண எண் உள்ளிடவும்"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentDate">ஆவண தேதி</Label>
                    <DatePicker
                      id="documentDate"
                      date={formData.documentDate}
                      onSelect={(date) => handleDateChange("documentDate", date)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">பதிவு எண்</Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      placeholder="பதிவு எண் உள்ளிடவும்"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationDate">பதிவு தேதி</Label>
                    <DatePicker
                      id="registrationDate"
                      date={formData.registrationDate}
                      onSelect={(date) => handleDateChange("registrationDate", date)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <MultipleBorrowers borrowers={borrowers} onChange={setBorrowers} />

            <MultipleLenders lenders={lenders} onChange={setLenders} />

            <Card>
              <CardHeader>
                <CardTitle>சொத்து விவரங்கள்</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyDescription">சொத்து விவரம்</Label>
                  <Textarea
                    id="propertyDescription"
                    name="propertyDescription"
                    value={formData.propertyDescription}
                    onChange={handleInputChange}
                    placeholder="சொத்து விவரம் உள்ளிடவும்"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyValue">சொத்து மதிப்பு</Label>
                  <Input
                    id="propertyValue"
                    name="propertyValue"
                    value={formData.propertyValue}
                    onChange={handleInputChange}
                    placeholder="சொத்து மதிப்பு உள்ளிடவும்"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>கடன் விவரங்கள்</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">கடன் தொகை</Label>
                    <Input
                      id="loanAmount"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      placeholder="கடன் தொகை உள்ளிடவும்"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanAmountInWords">கடன் தொகை (எழுத்��ில்)</Label>
                    <Input
                      id="loanAmountInWords"
                      name="loanAmountInWords"
                      value={formData.loanAmountInWords}
                      onChange={handleInputChange}
                      placeholder="கடன் தொகை எழுத்தில் உள்ளிடவும்"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="loanPeriod">கடன் காலம்</Label>
                    <Input
                      id="loanPeriod"
                      name="loanPeriod"
                      value={formData.loanPeriod}
                      onChange={handleInputChange}
                      placeholder="கடன் காலம் உள்ளிடவும்"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">வட்டி விகிதம்</Label>
                    <Input
                      id="interestRate"
                      name="interestRate"
                      value={formData.interestRate}
                      onChange={handleInputChange}
                      placeholder="வட்டி விகிதம் உள்ளிடவும்"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>சாட்சிகள் விவரங்கள்</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="witnessName1">சாட்சி 1 பெயர்</Label>
                    <Input
                      id="witnessName1"
                      name="witnessName1"
                      value={formData.witnessName1}
                      onChange={handleInputChange}
                      placeholder="சாட்சி 1 பெயர் உள்ளிடவும்"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witnessAddress1">சாட்சி 1 முகவரி</Label>
                    <Textarea
                      id="witnessAddress1"
                      name="witnessAddress1"
                      value={formData.witnessAddress1}
                      onChange={handleInputChange}
                      placeholder="சாட்சி 1 முகவரி உள்ளிடவும்"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="witnessName2">சாட்சி 2 பெயர்</Label>
                    <Input
                      id="witnessName2"
                      name="witnessName2"
                      value={formData.witnessName2}
                      onChange={handleInputChange}
                      placeholder="சாட்சி 2 பெயர் உள்ளிடவும்"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witnessAddress2">சாட்சி 2 முகவரி</Label>
                    <Textarea
                      id="witnessAddress2"
                      name="witnessAddress2"
                      value={formData.witnessAddress2}
                      onChange={handleInputChange}
                      placeholder="சாட்சி 2 முகவரி உள்ளிடவும்"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>தட்டச்சு விவரங்கள்</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="typistId">தட்டச்சாளர்</Label>
                    <Select value={formData.typistId} onValueChange={(value) => handleSelectChange("typistId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="தட்டச்சாளர் தேர்வு செய்யவும்" />
                      </SelectTrigger>
                      <SelectContent>
                        {typists.map((typist) => (
                          <SelectItem key={typist.id} value={typist.id.toString()}>
                            {typist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="typistOfficeId">தட்டச்சு அலுவலகம்</Label>
                    <Select
                      value={formData.typistOfficeId}
                      onValueChange={(value) => handleSelectChange("typistOfficeId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="தட்டச்சு அலுவலகம் தேர்வு செய்யவும்" />
                      </SelectTrigger>
                      <SelectContent>
                        {typistOffices.map((office) => (
                          <SelectItem key={office.id} value={office.id.toString()}>
                            {office.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>கூடுதல் குறிப்புகள்</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">குறிப்புகள்</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="கூடுதல் குறிப்புகள் உள்ளிடவும்"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/document-details/mortgage-loan")}>
                ரத்து செய்
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "சேமிக்கிறது..." : "சேமி"}
              </Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <DocumentLivePreview
            formData={{
              ...formData,
              borrowers,
              lenders,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
