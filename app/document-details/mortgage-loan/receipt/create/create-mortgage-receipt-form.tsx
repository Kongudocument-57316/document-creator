"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { convertToTamilWords } from "@/lib/tamil-number-to-words"

interface MortgageReceiptFormProps {
  onFormChange: (formData: any) => void
  onSave: () => void
}

export function CreateMortgageReceiptForm({ onFormChange, onSave }: MortgageReceiptFormProps) {
  const [formData, setFormData] = useState({
    // Receipt details
    receiptDate: "",

    // Buyer details
    buyerName: "",
    buyerAge: "",
    buyerRelationshipType: "",
    buyerRelationsName: "",
    buyerDoorNo: "",
    buyerAddressLine1: "",
    buyerAddressLine2: "",
    buyerAddressLine3: "",
    buyerTaluk: "",
    buyerDistrict: "",
    buyerPincode: "",
    buyerAadharNo: "",
    buyerPhoneNo: "",

    // Seller details
    sellerName: "",
    sellerAge: "",
    sellerRelationshipType: "",
    sellerRelationsName: "",
    sellerDoorNo: "",
    sellerAddressLine1: "",
    sellerAddressLine2: "",
    sellerAddressLine3: "",
    sellerTaluk: "",
    sellerDistrict: "",
    sellerPincode: "",
    sellerAadharNo: "",
    sellerPhoneNo: "",

    // Document details
    documentDate: "",
    loanAmount: "",
    loanAmountInWords: "",

    // Registration details
    subRegistrarOffice: "",
    prBookNo: "",
    prDocumentYear: "",
    prDocumentNo: "",

    // Property details
    propertyDetails: "",

    // Witness details
    witness1Name: "",
    witness1Age: "",
    witness1RelationshipType: "",
    witness1RelationsName: "",
    witness1DoorNo: "",
    witness1AddressLine1: "",
    witness1AddressLine2: "",
    witness1AddressLine3: "",
    witness1Taluk: "",
    witness1District: "",
    witness1Pincode: "",
    witness1AadharNo: "",

    witness2Name: "",
    witness2Age: "",
    witness2RelationshipType: "",
    witness2RelationsName: "",
    witness2DoorNo: "",
    witness2AddressLine1: "",
    witness2AddressLine2: "",
    witness2AddressLine3: "",
    witness2Taluk: "",
    witness2District: "",
    witness2Pincode: "",
    witness2AadharNo: "",

    // Typist details
    typistName: "",
    typistOfficeName: "",
    typistPhoneNo: "",
  })

  const [currentTab, setCurrentTab] = useState("receipt")

  // Update parent component when form data changes
  useEffect(() => {
    onFormChange(formData)
  }, [formData, onFormChange])

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // If the field is loanAmount, also update loanAmountInWords
    if (name === "loanAmount") {
      const numericValue = Number.parseFloat(value.replace(/[^0-9.]/g, ""))
      if (!isNaN(numericValue)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          loanAmountInWords: convertToTamilWords(numericValue),
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          loanAmountInWords: "",
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
  }

  const navigateToNextTab = () => {
    switch (currentTab) {
      case "receipt":
        setCurrentTab("buyer")
        break
      case "buyer":
        setCurrentTab("seller")
        break
      case "seller":
        setCurrentTab("document")
        break
      case "document":
        setCurrentTab("property")
        break
      case "property":
        setCurrentTab("witness")
        break
      default:
        break
    }
  }

  const navigateToPreviousTab = () => {
    switch (currentTab) {
      case "buyer":
        setCurrentTab("receipt")
        break
      case "seller":
        setCurrentTab("buyer")
        break
      case "document":
        setCurrentTab("seller")
        break
      case "property":
        setCurrentTab("document")
        break
      case "witness":
        setCurrentTab("property")
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6 pb-6">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-6 mb-4 h-auto">
          <TabsTrigger
            value="receipt"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
          >
            ரசீது
          </TabsTrigger>
          <TabsTrigger
            value="buyer"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
          >
            வாங்குபவர்
          </TabsTrigger>
          <TabsTrigger
            value="seller"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
          >
            விற்பவர்
          </TabsTrigger>
          <TabsTrigger
            value="document"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
          >
            ஆவணம்
          </TabsTrigger>
          <TabsTrigger
            value="property"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
          >
            சொத்து
          </TabsTrigger>
          <TabsTrigger
            value="witness"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
          >
            சாட்சிகள்
          </TabsTrigger>
        </TabsList>

        {/* Receipt Details Tab */}
        <TabsContent value="receipt" className="space-y-4">
          <Card className="shadow-sm border-blue-200">
            <CardHeader className="bg-blue-50 pb-2">
              <CardTitle className="text-blue-800 text-lg">ரசீது விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiptDate">ரசீது தேதி</Label>
                  <Input
                    id="receiptDate"
                    name="receiptDate"
                    value={formData.receiptDate}
                    onChange={handleChange}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typistName">தட்டச்சு செய்தவர் பெயர்</Label>
                  <Input id="typistName" name="typistName" value={formData.typistName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typistOfficeName">தட்டச்சு அலுவலகம் பெயர்</Label>
                  <Input
                    id="typistOfficeName"
                    name="typistOfficeName"
                    value={formData.typistOfficeName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typistPhoneNo">தட்டச்சு அலுவலகம் தொலைபேசி எண்</Label>
                  <Input
                    id="typistPhoneNo"
                    name="typistPhoneNo"
                    value={formData.typistPhoneNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={navigateToPreviousTab}
              disabled={currentTab === "receipt"}
              className="border-blue-200 text-blue-700"
            >
              முந்தைய
            </Button>
            <Button onClick={navigateToNextTab} className="bg-blue-600 hover:bg-blue-700 text-white">
              அடுத்து
            </Button>
          </div>
        </TabsContent>

        {/* Buyer Details Tab */}
        <TabsContent value="buyer" className="space-y-4">
          <Card className="shadow-sm border-blue-200">
            <CardHeader className="bg-blue-50 pb-2">
              <CardTitle className="text-blue-800 text-lg">வாங்குபவர் விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyerName">பெயர்</Label>
                  <Input id="buyerName" name="buyerName" value={formData.buyerName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerAge">வய���ு</Label>
                  <Input id="buyerAge" name="buyerAge" value={formData.buyerAge} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerRelationshipType">உறவு வகை</Label>
                  <Select
                    value={formData.buyerRelationshipType}
                    onValueChange={(value) => handleSelectChange(value, "buyerRelationshipType")}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="உறவு வகையைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="மகன்">மகன்</SelectItem>
                      <SelectItem value="மகள்">மகள்</SelectItem>
                      <SelectItem value="மனைவி">மனைவி</SelectItem>
                      <SelectItem value="கணவர்">கணவர்</SelectItem>
                      <SelectItem value="தந்தை">தந்தை</SelectItem>
                      <SelectItem value="தாய்">தாய்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerRelationsName">உறவினர் பெயர்</Label>
                  <Input
                    id="buyerRelationsName"
                    name="buyerRelationsName"
                    value={formData.buyerRelationsName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerDoorNo">கதவு எண்</Label>
                  <Input id="buyerDoorNo" name="buyerDoorNo" value={formData.buyerDoorNo} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerAddressLine1">முகவரி வரி 1</Label>
                  <Input
                    id="buyerAddressLine1"
                    name="buyerAddressLine1"
                    value={formData.buyerAddressLine1}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerAddressLine2">முகவரி வரி 2</Label>
                  <Input
                    id="buyerAddressLine2"
                    name="buyerAddressLine2"
                    value={formData.buyerAddressLine2}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerAddressLine3">முகவரி வரி 3</Label>
                  <Input
                    id="buyerAddressLine3"
                    name="buyerAddressLine3"
                    value={formData.buyerAddressLine3}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerTaluk">வட்டம்</Label>
                  <Input id="buyerTaluk" name="buyerTaluk" value={formData.buyerTaluk} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerDistrict">மாவட்டம்</Label>
                  <Input
                    id="buyerDistrict"
                    name="buyerDistrict"
                    value={formData.buyerDistrict}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerPincode">அஞ்சல் குறியீடு</Label>
                  <Input id="buyerPincode" name="buyerPincode" value={formData.buyerPincode} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerAadharNo">ஆதார் எண்</Label>
                  <Input
                    id="buyerAadharNo"
                    name="buyerAadharNo"
                    value={formData.buyerAadharNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerPhoneNo">தொலைபேசி எண்</Label>
                  <Input id="buyerPhoneNo" name="buyerPhoneNo" value={formData.buyerPhoneNo} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={navigateToPreviousTab} className="border-blue-200 text-blue-700">
              முந்தைய
            </Button>
            <Button onClick={navigateToNextTab} className="bg-blue-600 hover:bg-blue-700 text-white">
              அடுத்து
            </Button>
          </div>
        </TabsContent>

        {/* Seller Details Tab */}
        <TabsContent value="seller" className="space-y-4">
          <Card className="shadow-sm border-blue-200">
            <CardHeader className="bg-blue-50 pb-2">
              <CardTitle className="text-blue-800 text-lg">விற்பவர் விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sellerName">பெயர்</Label>
                  <Input id="sellerName" name="sellerName" value={formData.sellerName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerAge">வயது</Label>
                  <Input id="sellerAge" name="sellerAge" value={formData.sellerAge} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerRelationshipType">உறவு வகை</Label>
                  <Select
                    value={formData.sellerRelationshipType}
                    onValueChange={(value) => handleSelectChange(value, "sellerRelationshipType")}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="உறவு வகையைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="மகன்">மகன்</SelectItem>
                      <SelectItem value="மகள்">மகள்</SelectItem>
                      <SelectItem value="மனைவி">மனைவி</SelectItem>
                      <SelectItem value="கணவர்">கணவர்</SelectItem>
                      <SelectItem value="தந்தை">தந்தை</SelectItem>
                      <SelectItem value="தாய்">தாய்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerRelationsName">உறவினர் பெயர்</Label>
                  <Input
                    id="sellerRelationsName"
                    name="sellerRelationsName"
                    value={formData.sellerRelationsName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerDoorNo">கதவு எண்</Label>
                  <Input id="sellerDoorNo" name="sellerDoorNo" value={formData.sellerDoorNo} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerAddressLine1">முகவரி வரி 1</Label>
                  <Input
                    id="sellerAddressLine1"
                    name="sellerAddressLine1"
                    value={formData.sellerAddressLine1}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerAddressLine2">முகவரி வரி 2</Label>
                  <Input
                    id="sellerAddressLine2"
                    name="sellerAddressLine2"
                    value={formData.sellerAddressLine2}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerAddressLine3">முகவரி வரி 3</Label>
                  <Input
                    id="sellerAddressLine3"
                    name="sellerAddressLine3"
                    value={formData.sellerAddressLine3}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerTaluk">வட்டம்</Label>
                  <Input id="sellerTaluk" name="sellerTaluk" value={formData.sellerTaluk} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerDistrict">மாவட்டம்</Label>
                  <Input
                    id="sellerDistrict"
                    name="sellerDistrict"
                    value={formData.sellerDistrict}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerPincode">அஞ்சல் குறியீடு</Label>
                  <Input
                    id="sellerPincode"
                    name="sellerPincode"
                    value={formData.sellerPincode}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerAadharNo">ஆதார�� எண்</Label>
                  <Input
                    id="sellerAadharNo"
                    name="sellerAadharNo"
                    value={formData.sellerAadharNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerPhoneNo">தொலைபேசி எண்</Label>
                  <Input
                    id="sellerPhoneNo"
                    name="sellerPhoneNo"
                    value={formData.sellerPhoneNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={navigateToPreviousTab} className="border-blue-200 text-blue-700">
              முந்தைய
            </Button>
            <Button onClick={navigateToNextTab} className="bg-blue-600 hover:bg-blue-700 text-white">
              அடுத்து
            </Button>
          </div>
        </TabsContent>

        {/* Document Details Tab */}
        <TabsContent value="document" className="space-y-4">
          <Card className="shadow-sm border-blue-200">
            <CardHeader className="bg-blue-50 pb-2">
              <CardTitle className="text-blue-800 text-lg">முந்தைய ஆவண விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentDate">முந்தைய அடமான பத்திரத்தின் தேதி</Label>
                  <Input
                    id="documentDate"
                    name="documentDate"
                    value={formData.documentDate}
                    onChange={handleChange}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">கடன் தொகை</Label>
                  <Input
                    id="loanAmount"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanAmountInWords">கடன் தொகை (எழுத்தில்)</Label>
                  <Input
                    id="loanAmountInWords"
                    name="loanAmountInWords"
                    value={formData.loanAmountInWords}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subRegistrarOffice">சார்பதிவாளர் அலுவலகம்</Label>
                  <Input
                    id="subRegistrarOffice"
                    name="subRegistrarOffice"
                    value={formData.subRegistrarOffice}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prBookNo">புத்தக எண்</Label>
                  <Input id="prBookNo" name="prBookNo" value={formData.prBookNo} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prDocumentYear">ஆவண ஆண்டு</Label>
                  <Input
                    id="prDocumentYear"
                    name="prDocumentYear"
                    value={formData.prDocumentYear}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prDocumentNo">ஆவண எண்</Label>
                  <Input id="prDocumentNo" name="prDocumentNo" value={formData.prDocumentNo} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={navigateToPreviousTab} className="border-blue-200 text-blue-700">
              முந்தைய
            </Button>
            <Button onClick={navigateToNextTab} className="bg-blue-600 hover:bg-blue-700 text-white">
              அடுத்து
            </Button>
          </div>
        </TabsContent>

        {/* Property Details Tab */}
        <TabsContent value="property" className="space-y-4">
          <Card className="shadow-sm border-blue-200">
            <CardHeader className="bg-blue-50 pb-2">
              <CardTitle className="text-blue-800 text-lg">சொத்து விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyDetails">சொத்து விவரங்கள்</Label>
                  <Textarea
                    id="propertyDetails"
                    name="propertyDetails"
                    value={formData.propertyDetails}
                    onChange={handleChange}
                    rows={10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={navigateToPreviousTab} className="border-blue-200 text-blue-700">
              முந்தைய
            </Button>
            <Button onClick={navigateToNextTab} className="bg-blue-600 hover:bg-blue-700 text-white">
              அடுத்து
            </Button>
          </div>
        </TabsContent>

        {/* Witness Details Tab */}
        <TabsContent value="witness" className="space-y-4">
          <Card className="shadow-sm border-blue-200">
            <CardHeader className="bg-blue-50 pb-2">
              <CardTitle className="text-blue-800 text-lg">சாட்சி 1 விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="witness1Name">பெயர்</Label>
                  <Input id="witness1Name" name="witness1Name" value={formData.witness1Name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1Age">வயது</Label>
                  <Input id="witness1Age" name="witness1Age" value={formData.witness1Age} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1RelationshipType">உறவு வகை</Label>
                  <Select
                    value={formData.witness1RelationshipType}
                    onValueChange={(value) => handleSelectChange(value, "witness1RelationshipType")}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="உறவு வகையைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="மகன்">மகன்</SelectItem>
                      <SelectItem value="மகள்">மகள்</SelectItem>
                      <SelectItem value="மனைவி">மனைவி</SelectItem>
                      <SelectItem value="கணவர்">கணவர்</SelectItem>
                      <SelectItem value="தந்தை">தந்தை</SelectItem>
                      <SelectItem value="தாய்">தாய்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1RelationsName">உறவினர் பெயர்</Label>
                  <Input
                    id="witness1RelationsName"
                    name="witness1RelationsName"
                    value={formData.witness1RelationsName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1DoorNo">கதவு எண்</Label>
                  <Input
                    id="witness1DoorNo"
                    name="witness1DoorNo"
                    value={formData.witness1DoorNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1AddressLine1">முகவரி வரி 1</Label>
                  <Input
                    id="witness1AddressLine1"
                    name="witness1AddressLine1"
                    value={formData.witness1AddressLine1}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1AddressLine2">முகவரி வரி 2</Label>
                  <Input
                    id="witness1AddressLine2"
                    name="witness1AddressLine2"
                    value={formData.witness1AddressLine2}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1AddressLine3">முகவரி வரி 3</Label>
                  <Input
                    id="witness1AddressLine3"
                    name="witness1AddressLine3"
                    value={formData.witness1AddressLine3}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1Taluk">வட்டம்</Label>
                  <Input
                    id="witness1Taluk"
                    name="witness1Taluk"
                    value={formData.witness1Taluk}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1District">மாவட்டம்</Label>
                  <Input
                    id="witness1District"
                    name="witness1District"
                    value={formData.witness1District}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1Pincode">அஞ்சல் குறியீடு</Label>
                  <Input
                    id="witness1Pincode"
                    name="witness1Pincode"
                    value={formData.witness1Pincode}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1AadharNo">ஆதார் எண்</Label>
                  <Input
                    id="witness1AadharNo"
                    name="witness1AadharNo"
                    value={formData.witness1AadharNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-blue-200">
            <CardHeader className="bg-blue-50 pb-2">
              <CardTitle className="text-blue-800 text-lg">சாட்சி 2 விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="witness2Name">பெயர்</Label>
                  <Input id="witness2Name" name="witness2Name" value={formData.witness2Name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2Age">வயது</Label>
                  <Input id="witness2Age" name="witness2Age" value={formData.witness2Age} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2RelationshipType">உறவு வகை</Label>
                  <Select
                    value={formData.witness2RelationshipType}
                    onValueChange={(value) => handleSelectChange(value, "witness2RelationshipType")}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="உறவு வகையைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="மகன்">மகன்</SelectItem>
                      <SelectItem value="மகள்">மகள்</SelectItem>
                      <SelectItem value="மனைவி">மனைவி</SelectItem>
                      <SelectItem value="கணவர்">கணவர்</SelectItem>
                      <SelectItem value="தந்தை">தந்தை</SelectItem>
                      <SelectItem value="தாய்">தாய்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2RelationsName">உறவினர் பெயர்</Label>
                  <Input
                    id="witness2RelationsName"
                    name="witness2RelationsName"
                    value={formData.witness2RelationsName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2DoorNo">கதவு எண்</Label>
                  <Input
                    id="witness2DoorNo"
                    name="witness2DoorNo"
                    value={formData.witness2DoorNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2AddressLine1">முகவரி வரி 1</Label>
                  <Input
                    id="witness2AddressLine1"
                    name="witness2AddressLine1"
                    value={formData.witness2AddressLine1}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2AddressLine2">முகவரி வரி 2</Label>
                  <Input
                    id="witness2AddressLine2"
                    name="witness2AddressLine2"
                    value={formData.witness2AddressLine2}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2AddressLine3">முகவரி வரி 3</Label>
                  <Input
                    id="witness2AddressLine3"
                    name="witness2AddressLine3"
                    value={formData.witness2AddressLine3}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2Taluk">வட்டம்</Label>
                  <Input
                    id="witness2Taluk"
                    name="witness2Taluk"
                    value={formData.witness2Taluk}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2District">மாவட்டம்</Label>
                  <Input
                    id="witness2District"
                    name="witness2District"
                    value={formData.witness2District}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2Pincode">அஞ்சல் குறியீடு</Label>
                  <Input
                    id="witness2Pincode"
                    name="witness2Pincode"
                    value={formData.witness2Pincode}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2AadharNo">ஆதார் எண்</Label>
                  <Input
                    id="witness2AadharNo"
                    name="witness2AadharNo"
                    value={formData.witness2AadharNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={navigateToPreviousTab} className="border-blue-200 text-blue-700">
              முந்தைய
            </Button>
            <Button variant="outline" onClick={onSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              ரசீதை சேமிக்கவும்
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
