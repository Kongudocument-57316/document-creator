"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { savePartitionReleaseDocument } from "./save-document-action"
import { toast } from "@/components/ui/use-toast"
import { fetchSubRegistrarOffices, fetchTypists } from "./fetch-data-utils"
import { Textarea } from "@/components/ui/textarea"

// Export both as default and named export to ensure compatibility
export function CreatePartitionReleaseForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<any[]>([])
  const [typists, setTypists] = useState<any[]>([])

  // Form state
  const [formData, setFormData] = useState({
    // Date details
    documentDate: new Date(),

    // Receiver (பெறுபவர்) details
    receiverName: "",
    receiverAge: "",
    receiverRelationName: "",
    receiverRelationType: "",
    receiverDoorNo: "",
    receiverAddressLine1: "",
    receiverAddressLine2: "",
    receiverAddressLine3: "",
    receiverTaluk: "",
    receiverDistrict: "",
    receiverPincode: "",
    receiverAadharNo: "",
    receiverPhoneNo: "",

    // Giver (கொடுப்பவர்) details
    giverName: "",
    giverAge: "",
    giverRelationName: "",
    giverRelationType: "",
    giverDoorNo: "",
    giverAddressLine1: "",
    giverAddressLine2: "",
    giverAddressLine3: "",
    giverTaluk: "",
    giverDistrict: "",
    giverPincode: "",
    giverAadharNo: "",
    giverPhoneNo: "",

    // Deceased person details
    deathPersonName: "",
    deathPersonRelations: "",
    deathDate: new Date(),

    // Document details
    prDocumentDate: new Date(),
    subRegistrarOffice: "",
    prBookNo: "",
    prDocumentYear: "",
    prDocumentNo: "",
    prDocumentType: "",

    // Certificate details
    deathCertificateNo: "",
    deathCertificateDate: new Date(),
    heirCertificateNo: "",
    heirCertificateDate: new Date(),
    tahsildarOfficeName: "",

    // Share details
    totalShare: "",
    releaseShare: "",

    // Property details
    propertyDetails: "",

    // Witness details
    witness1Name: "",
    witness1Relation: "",
    witness1RelationName: "",
    witness1DoorNo: "",
    witness1AddressLine1: "",
    witness1AddressLine2: "",
    witness1AddressLine3: "",
    witness1Taluk: "",
    witness1District: "",
    witness1Pincode: "",
    witness1Age: "",
    witness1AadharNo: "",

    witness2Name: "",
    witness2Relation: "",
    witness2RelationName: "",
    witness2DoorNo: "",
    witness2AddressLine1: "",
    witness2AddressLine2: "",
    witness2AddressLine3: "",
    witness2Taluk: "",
    witness2District: "",
    witness2Pincode: "",
    witness2Age: "",
    witness2AadharNo: "",

    // Typist details
    typistName: "",
    typistOffice: "கொங்கு பத்திர ஆபிஸ், குன்னத்தூர்",
    typistPhone: "",
  })

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const offices = await fetchSubRegistrarOffices()
        setSubRegistrarOffices(offices)

        const typistData = await fetchTypists()
        setTypists(typistData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "தரவு ஏற்றுவதில் பிழை",
          description: "தரவை ஏற்றுவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await savePartitionReleaseDocument(formData)

      if (result.success) {
        toast({
          title: "வெற்றி",
          description: "பாகபாத்திய விடுதலை ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது",
        })
        router.push("/document-details/partition-release")
      } else {
        throw new Error(result.error || "Unknown error")
      }
    } catch (error) {
      console.error("Error saving document:", error)
      toast({
        title: "பிழை",
        description: "ஆவணத்தை சேமிப்பதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "dd-MM-yyyy")
  }

  // Generate document preview
  const generateDocumentPreview = () => {
    return (
      <div className="space-y-6 text-amber-900">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">பாகபாத்திய விடுதலைப் பத்திரம்</h2>
          <p className="mt-2">
            {formData.documentDate && format(formData.documentDate, "yyyy")}-ம் வருடம்{" "}
            {formData.documentDate && format(formData.documentDate, "MMMM")} மாதம்{" "}
            {formData.documentDate && format(formData.documentDate, "dd")}-ம் தேதியில்
          </p>
        </div>

        {formData.receiverName && formData.giverName && (
          <div>
            <p>
              {formData.receiverDistrict} மாவட்டம்-{formData.receiverPincode}, {formData.receiverTaluk} வட்டம்,{" "}
              {formData.receiverAddressLine3}, {formData.receiverAddressLine2}, {formData.receiverAddressLine1}, கதவு
              எண்:-{formData.receiverDoorNo} என்ற முகவரியில் வசித்து வருபவரும், {formData.receiverRelationName} அவர்களின்{" "}
              {formData.receiverRelationType} {formData.receiverAge} வயதுடைய பெறுபவர் {formData.receiverName} (ஆதார் அடையாள
              அட்டை எண்:-{formData.receiverAadharNo}, கைப்பேசி எண்:-{formData.receiverPhoneNo}) ஆகிய தங்களுக்கு,
            </p>
            <p className="mt-2">
              {formData.giverDistrict} மாவட்டம்-{formData.giverPincode}, {formData.giverTaluk} வட்டம்,{" "}
              {formData.giverAddressLine3}, {formData.giverAddressLine2}, {formData.giverAddressLine1}, கதவு எண்:-
              {formData.giverDoorNo} என்ற முகவரியில் வசித்து வருபவரும், {formData.giverRelationName} அவர்களின்{" "}
              {formData.giverRelationType} {formData.giverAge} வயதுடைய கொடுப்பவர் {formData.giverName} (ஆதார் அடையாள அட்டை
              எண்:-{formData.giverAadharNo}, கைப்பேசி எண்:-{formData.giverPhoneNo}) ஆகிய நான் சம்மதித்து எழுதிக் கொடுத்த பாக பாத்திய
              விடுதலைப்பத்திரத்திற்கு விவரம் என்னவென்றால்,
            </p>
          </div>
        )}

        {formData.receiverName && formData.giverName && (
          <p>
            இந்த பாக பாத்திய விடுதலைப் பத்திரம் பெறும் பெறுபவர் {formData.receiverName} ஆகிய நீங்கள், எனக்கு கொடுப்பவருக்கு{" "}
            {formData.receiverRelationType} ஆவீர்கள். நான் உமக்கு பெறுபவருக்கு {formData.giverRelationType} ஆவேன்.
          </p>
        )}

        {formData.deathPersonName && formData.prDocumentDate && (
          <p>
            கீழ்க்கண்ட சொத்து விவரத்தில் விவரிக்கப்பட்டுள்ள சொத்தானது பின்னும், அடியில் சொத்து விவரத்தில் விவரிக்கப்பட்டுள்ள சொத்தானது நம்
            இருவருக்கும் பெறுபவர், கொடுப்பவர் {formData.receiverRelationType} ஆகிய காலஞ்சென்ற {formData.deathPersonName}{" "}
            என்பவருக்கு கடந்த {formData.prDocumentDate && format(formData.prDocumentDate, "dd/MM/yyyy")}-ம் தேதியில்,{" "}
            {formData.subRegistrarOffice} சார்பதிவாளர் அலுவலகம் {formData.prBookNo} புத்தகம் {formData.prDocumentYear}-ம் ஆண்டின்{" "}
            {formData.prDocumentNo}-ம் எண்ணாக பதிவு செய்யப்பட்ட {formData.prDocumentType} ஆவணத்தின் படி பாத்தியப்பட்டதாகும்.
          </p>
        )}

        {formData.deathPersonName && formData.deathDate && (
          <p>
            இதில் மேற்படி வகையில் தனக்கு பாத்தியப்பட்ட சொத்துக்களை குறித்து, தனது ஆயுள் வரை எந்த விதமான ஏற்பாடும் செய்து வைக்காமல், மேற்படி{" "}
            {formData.deathPersonName} அவர்கள் கடந்த {formData.deathDate && format(formData.deathDate, "dd/MM/yyyy")}-ம்
            தேதியில் க���லமாகிவிட்டார். அவரது இறப்பு சான்று பதிவு எண்:- {formData.deathCertificateNo}. பதிவு செய்த தேதி:-{" "}
            {formData.deathCertificateDate && format(formData.deathCertificateDate, "dd/MM/yyyy")}. பின்னும்,{" "}
            {formData.tahsildarOfficeName} வட்டாச்சியர் அவர்களால் வழங்கப்பட்ட வாரிசு சான்று எண்:-{formData.heirCertificateNo}, தேதி:-{" "}
            {formData.heirCertificateDate && format(formData.heirCertificateDate, "dd/MM/yyyy")}-ன் படி மேற்படி காலஞ்சென்ற{" "}
            {formData.deathPersonName} அவர்களின் {formData.deathPersonRelations} ஆகிய நாங்கள் வாரிசுதாரர்கள் ஆவோம்.
          </p>
        )}

        <p>
          பின்னும் மேற்படி வகையில் பாத்தியப்பட்ட மேற்படி சொத்துக்களானது நமக்கு சர்வ சுதந்திரமாக பாத்தியப்பட்டு நாளது தேதி வரை உரிய வரி
          வகையறாக்களைச் செலுத்தி வந்து, நமது கூட்டு சுவாதீன அனுபவத்தில் வைத்து அனுபவித்து வந்தோம். மேற்படி சொத்தில் பெறுபவர்{" "}
          {formData.receiverName}, கொடுப்பவர் {formData.giverName} ஆகிய நம்மைத் தவிர்த்து வேறு நபர்களுக்கு உரிமையோ, பாத்தியமோ
          கிடையாது.
        </p>

        {formData.totalShare && formData.releaseShare && (
          <p>
            இப்பவும், மேற்படி வகையில் மேற்படி சொத்துக்களில் நம்மில் பெறுபவர் {formData.receiverName}, கொடுப்பவர் {formData.giverName}{" "}
            ஆகியவர்களுக்கு பாத்தியப்பட்ட சொத்துக்களில், கொடுப்பவர் {formData.giverName} ஆகிய எங்களுக்கு பாத்தியப்பட்ட{" "}
            {formData.totalShare}ல் {formData.releaseShare} ({formData.releaseShare}/{formData.totalShare}) பங்கு
            சொத்துக்களில் {formData.totalShare}ல் {formData.releaseShare} ({formData.releaseShare}/{formData.totalShare})
            பங்கு சொத்துக்களை மட்டும், பெறுபவர் {formData.receiverName} ஆகிய நீங்கள் உங்களுக்கு விடுதலை செய்து கொடுக்கும்படி நீங்கள்
            எங்களைக் கேட்டுக்கொண்டதன் பேரில், உமக்கு வசதியாகவும், வாய்ப்பாகவும், ஏதுவாகவும் இருக்கும் என்ற எண்ணத்தில் நாங்களும் இணங்கி சம்ம��ித்து,
            நமக்கு பாத்தியப்பட்ட சொத்துக்களில், எங்களுக்கு பாத்தியப்பட்ட {formData.releaseShare} பங்கு பாக சொத்தினை உமக்கு விடுதலை செய்து
            கொடுக்க ஒப்புக்கொண்டு எங்களுக்குரிய ({formData.releaseShare}/{formData.totalShare}) பங்கு பாகத்தினை இந்த பாகபாத்திய
            விடுதலை பத்திரத்தின் மூலம் விடுதலை செய்து கொடுத்துள்ளோம்.
          </p>
        )}

        <p>
          நாளது தேதி முதல் அடியிற்கண்ட சொத்துகளுக்கு நீங்களே பூரண பாத்தியஸ்தராகி கொண்டு சர்வசுதந்திர பாத்தியமாக அடைந்து புத்திர பௌத்திர
          பாரம்பரியமாகத் தானாதி விநியோக விற்கிரயங்களுக்கு யோக்கியமாக அடைந்து ஆண்டனுபவித்துக் கொண்டு அரசு வரி மற்றும் இதர சொத்து வரி
          வகையறாக்களையும் நீங்களே செலுத்திக் கொண்டு வர வேண்டியது.
        </p>

        <p>
          இனிமேல் அடியிற்கண்ட சொத்தின் மீது எனக்குகோ, எனது இதர ஆண் பெண் வாரிசுகளுக்கோ, எவ்வித பாத்தியமோ சம்மந்தமோ பின்தொடர்ச்சியோ, உரிமையோ
          எதுவும் கிடையாது என்று உறுதியாகச் சொல்லுகிறேன்.
        </p>

        <p>மேலும் பின்னிட்டு எனது இதர ஆண், பெண் வாரிசுகளோ அடியிற்கண்ட சொத்தில் உரிமை கொண்டாடினால், அதுவும் செல்லத்தக்கதல்ல.</p>

        <p>அடியிற்கண்ட சொத்தை நான் எவ்வித வில்லங்கம் விவகாரம் எதற்கும் உட்படுத்தவில்லையென்று உறுதியாகச்சொல்லுகிறேன்.</p>

        <p>இதற்காக நான் உங்களிடமிருந்து தற்போது யாதொரு பிரதி பிரயோஜனமும் பெற்று கொள்ளவில்லை.</p>

        <p>இந்தப்படிக்கு நான் சம்மதித்து எழுதிக்கொடுத்த பாகபாத்திய விடுதலைப் பத்திரம். இந்த பாகபாத்திய விடுதலைப் பத்திரமே இறுதி முடிவானது.</p>

        <p>
          மேலும் தணிக்கையின் போது இந்த ஆவணம் தொடர்பாக அரசுக்கு இழப்பு ஏற்படின் அத்தகையை இந்த பாகபாத்திய விடுதலைப்பத்திரம் எழுதிப்பெறுபவர்
          செலுத்தவும் உறுதி அளிக்கிறார்.
        </p>

        {formData.propertyDetails && (
          <div>
            <h3 className="font-bold mt-4 mb-2">சொத்து விவரம்</h3>
            <p>{formData.propertyDetails}</p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-bold mb-2">சாட்சிகள்</h3>
          <p>
            1.{" "}
            {formData.witness1Name &&
              `${formData.witness1Name} ${formData.witness1Relation}.${formData.witness1RelationName}, கதவு எண்:-${formData.witness1DoorNo}, ${formData.witness1AddressLine1}, ${formData.witness1AddressLine2}, ${formData.witness1AddressLine3}, ${formData.witness1Taluk} வட்டம், ${formData.witness1District} மாவட்டம்-${formData.witness1Pincode}, (வயது-${formData.witness1Age}) (ஆதார் அடையாள அட்டை எண்:-${formData.witness1AadharNo}).`}
          </p>
          <p>
            2.{" "}
            {formData.witness2Name &&
              `${formData.witness2Name} ${formData.witness2Relation}.${formData.witness2RelationName}, கதவு எண்:-${formData.witness2DoorNo}, ${formData.witness2AddressLine1}, ${formData.witness2AddressLine2}, ${formData.witness2AddressLine3}, ${formData.witness2Taluk} வட்டம், ${formData.witness2District} மாவட்டம்-${formData.witness2Pincode}, (வயது-${formData.witness2Age}) (ஆதார் அடையாள அட்டை எண்:-${formData.witness2AadharNo}).`}
          </p>
        </div>

        <div className="mt-4">
          <p>கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-{formData.typistName}</p>
          <p>
            ({formData.typistOffice}, போன்:-{formData.typistPhone})
          </p>
        </div>

        {!formData.receiverName && !formData.giverName && !formData.propertyDetails && (
          <div className="text-center text-amber-500 italic">
            <p>விவரங்களை நிரப்பினால் ஆவணத்தின் முன்னோட்டம் இங்கே காண்பிக்கப்படும்</p>
            <p>(Document preview will appear here as you fill in the details)</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">புதிய பாகபாத்திய விடுதலை ஆவணம் உருவாக்கு</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push("/document-details/partition-release")}>
            பின் செல்
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            முகப்பு பக்கம்
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full grid grid-cols-5 mb-4">
                <TabsTrigger value="basic" className="px-2 py-1 text-xs sm:text-sm whitespace-normal h-auto">
                  அடிப்படை தகவல்
                </TabsTrigger>
                <TabsTrigger value="receiver" className="px-2 py-1 text-xs sm:text-sm whitespace-normal h-auto">
                  பெறுபவர் விவரம்
                </TabsTrigger>
                <TabsTrigger value="giver" className="px-2 py-1 text-xs sm:text-sm whitespace-normal h-auto">
                  கொடுப்பவர் விவரம்
                </TabsTrigger>
                <TabsTrigger value="property" className="px-2 py-1 text-xs sm:text-sm whitespace-normal h-auto">
                  சொத்து விவரம்
                </TabsTrigger>
                <TabsTrigger value="witness" className="px-2 py-1 text-xs sm:text-sm whitespace-normal h-auto">
                  சாட்சிகள்
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="documentDate">ஆவண தேதி</Label>
                        <DatePicker
                          id="documentDate"
                          date={formData.documentDate}
                          onSelect={(date) => handleInputChange("documentDate", date)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subRegistrarOffice">சார்பதிவாளர் அலுவலகம்</Label>
                        <Select
                          value={formData.subRegistrarOffice}
                          onValueChange={(value) => handleInputChange("subRegistrarOffice", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தை தேர்ந்தெடுக்கவும்" />
                          </SelectTrigger>
                          <SelectContent>
                            {subRegistrarOffices.map((office) => (
                              <SelectItem key={office.id} value={office.name}>
                                {office.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="deathPersonName">இறந்தவரின் பெயர்</Label>
                        <Input
                          id="deathPersonName"
                          value={formData.deathPersonName}
                          onChange={(e) => handleInputChange("deathPersonName", e.target.value)}
                          placeholder="இறந்தவரின் பெயர்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deathPersonRelations">இறந்தவரின் உறவினர்கள்</Label>
                        <Input
                          id="deathPersonRelations"
                          value={formData.deathPersonRelations}
                          onChange={(e) => handleInputChange("deathPersonRelations", e.target.value)}
                          placeholder="மகள், மகன், மனைவி பெயர்கள்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deathDate">இறந்த தேதி</Label>
                        <DatePicker
                          id="deathDate"
                          date={formData.deathDate}
                          onSelect={(date) => handleInputChange("deathDate", date)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="prDocumentDate">பழைய ஆவண தேதி</Label>
                        <DatePicker
                          id="prDocumentDate"
                          date={formData.prDocumentDate}
                          onSelect={(date) => handleInputChange("prDocumentDate", date)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prBookNo">புத்தக எண்</Label>
                        <Input
                          id="prBookNo"
                          value={formData.prBookNo}
                          onChange={(e) => handleInputChange("prBookNo", e.target.value)}
                          placeholder="புத்தக எண்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prDocumentYear">ஆவண ஆண்டு</Label>
                        <Input
                          id="prDocumentYear"
                          value={formData.prDocumentYear}
                          onChange={(e) => handleInputChange("prDocumentYear", e.target.value)}
                          placeholder="ஆவண ஆண்டு"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="prDocumentNo">ஆவண எண்</Label>
                        <Input
                          id="prDocumentNo"
                          value={formData.prDocumentNo}
                          onChange={(e) => handleInputChange("prDocumentNo", e.target.value)}
                          placeholder="ஆவண எண்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prDocumentType">ஆவண வகை</Label>
                        <Input
                          id="prDocumentType"
                          value={formData.prDocumentType}
                          onChange={(e) => handleInputChange("prDocumentType", e.target.value)}
                          placeholder="ஆவண வகை"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="deathCertificateNo">இறப்பு சான்று எண்</Label>
                        <Input
                          id="deathCertificateNo"
                          value={formData.deathCertificateNo}
                          onChange={(e) => handleInputChange("deathCertificateNo", e.target.value)}
                          placeholder="இறப்பு சான்று எண்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deathCertificateDate">இறப்பு சான்று தேதி</Label>
                        <DatePicker
                          id="deathCertificateDate"
                          date={formData.deathCertificateDate}
                          onSelect={(date) => handleInputChange("deathCertificateDate", date)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="tahsildarOfficeName">வட்டாட்சியர் அலுவலகம்</Label>
                        <Input
                          id="tahsildarOfficeName"
                          value={formData.tahsildarOfficeName}
                          onChange={(e) => handleInputChange("tahsildarOfficeName", e.target.value)}
                          placeholder="வட்டாட்சியர் அலுவலகம்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="heirCertificateNo">வாரிசு சான்று எண்</Label>
                        <Input
                          id="heirCertificateNo"
                          value={formData.heirCertificateNo}
                          onChange={(e) => handleInputChange("heirCertificateNo", e.target.value)}
                          placeholder="வாரிசு சான்று எண்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="heirCertificateDate">வாரிசு சான்று தேதி</Label>
                        <DatePicker
                          id="heirCertificateDate"
                          date={formData.heirCertificateDate}
                          onSelect={(date) => handleInputChange("heirCertificateDate", date)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalShare">மொத்த பங்கு</Label>
                        <Input
                          id="totalShare"
                          value={formData.totalShare}
                          onChange={(e) => handleInputChange("totalShare", e.target.value)}
                          placeholder="மொத்த பங்கு"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="releaseShare">விடுதலை செய்யும் பங்கு</Label>
                        <Input
                          id="releaseShare"
                          value={formData.releaseShare}
                          onChange={(e) => handleInputChange("releaseShare", e.target.value)}
                          placeholder="விடுதலை செய்யும் பங்கு"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Receiver Details Tab */}
              <TabsContent value="receiver" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="receiverName">பெறுபவர் பெயர்</Label>
                        <Input
                          id="receiverName"
                          value={formData.receiverName}
                          onChange={(e) => handleInputChange("receiverName", e.target.value)}
                          placeholder="பெறுபவர் பெயர்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receiverAge">வயது</Label>
                        <Input
                          id="receiverAge"
                          value={formData.receiverAge}
                          onChange={(e) => handleInputChange("receiverAge", e.target.value)}
                          placeholder="வயது"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receiverRelationType">உறவு வகை</Label>
                        <Input
                          id="receiverRelationType"
                          value={formData.receiverRelationType}
                          onChange={(e) => handleInputChange("receiverRelationType", e.target.value)}
                          placeholder="உறவு வகை (மகன், மகள், மனைவி, தந்தை)"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="receiverRelationName">உறவினர் பெயர்</Label>
                      <Input
                        id="receiverRelationName"
                        value={formData.receiverRelationName}
                        onChange={(e) => handleInputChange("receiverRelationName", e.target.value)}
                        placeholder="உறவினர் பெயர்"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="receiverDoorNo">கதவு எண்</Label>
                        <Input
                          id="receiverDoorNo"
                          value={formData.receiverDoorNo}
                          onChange={(e) => handleInputChange("receiverDoorNo", e.target.value)}
                          placeholder="கதவு எண்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receiverAddressLine1">முகவரி வரி 1</Label>
                        <Input
                          id="receiverAddressLine1"
                          value={formData.receiverAddressLine1}
                          onChange={(e) => handleInputChange("receiverAddressLine1", e.target.value)}
                          placeholder="முகவரி வரி 1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="receiverAddressLine2">முகவரி வரி 2</Label>
                        <Input
                          id="receiverAddressLine2"
                          value={formData.receiverAddressLine2}
                          onChange={(e) => handleInputChange("receiverAddressLine2", e.target.value)}
                          placeholder="முகவரி வரி 2"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receiverAddressLine3">முகவரி வரி 3</Label>
                        <Input
                          id="receiverAddressLine3"
                          value={formData.receiverAddressLine3}
                          onChange={(e) => handleInputChange("receiverAddressLine3", e.target.value)}
                          placeholder="முகவரி வரி 3"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="receiverTaluk">வட்டம்</Label>
                        <Input
                          id="receiverTaluk"
                          value={formData.receiverTaluk}
                          onChange={(e) => handleInputChange("receiverTaluk", e.target.value)}
                          placeholder="வட்டம்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receiverDistrict">மாவட்டம்</Label>
                        <Input
                          id="receiverDistrict"
                          value={formData.receiverDistrict}
                          onChange={(e) => handleInputChange("receiverDistrict", e.target.value)}
                          placeholder="மாவட்டம்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receiverPincode">அஞ்சல் குறியீடு</Label>
                        <Input
                          id="receiverPincode"
                          value={formData.receiverPincode}
                          onChange={(e) => handleInputChange("receiverPincode", e.target.value)}
                          placeholder="அஞ்சல் குற��யீடு"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="receiverAadharNo">ஆதார் எண்</Label>
                        <Input
                          id="receiverAadharNo"
                          value={formData.receiverAadharNo}
                          onChange={(e) => handleInputChange("receiverAadharNo", e.target.value)}
                          placeholder="ஆதார் எண்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receiverPhoneNo">தொலைபேசி எண்</Label>
                        <Input
                          id="receiverPhoneNo"
                          value={formData.receiverPhoneNo}
                          onChange={(e) => handleInputChange("receiverPhoneNo", e.target.value)}
                          placeholder="தொலைபேசி எண்"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Giver Details Tab */}
              <TabsContent value="giver" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="giverName">கொடுப்பவர் பெயர்</Label>
                        <Input
                          id="giverName"
                          value={formData.giverName}
                          onChange={(e) => handleInputChange("giverName", e.target.value)}
                          placeholder="கொடுப்பவர் பெயர்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="giverAge">வயது</Label>
                        <Input
                          id="giverAge"
                          value={formData.giverAge}
                          onChange={(e) => handleInputChange("giverAge", e.target.value)}
                          placeholder="வயது"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="giverRelationType">உறவு வகை</Label>
                        <Input
                          id="giverRelationType"
                          value={formData.giverRelationType}
                          onChange={(e) => handleInputChange("giverRelationType", e.target.value)}
                          placeholder="உறவு வகை (மகன், மகள், மனைவி, தந்தை)"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="giverRelationName">உறவினர் பெயர்</Label>
                      <Input
                        id="giverRelationName"
                        value={formData.giverRelationName}
                        onChange={(e) => handleInputChange("giverRelationName", e.target.value)}
                        placeholder="உறவினர் பெயர்"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="giverDoorNo">கதவு எண்</Label>
                        <Input
                          id="giverDoorNo"
                          value={formData.giverDoorNo}
                          onChange={(e) => handleInputChange("giverDoorNo", e.target.value)}
                          placeholder="கதவு எண்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="giverAddressLine1">முகவரி வரி 1</Label>
                        <Input
                          id="giverAddressLine1"
                          value={formData.giverAddressLine1}
                          onChange={(e) => handleInputChange("giverAddressLine1", e.target.value)}
                          placeholder="முகவரி வரி 1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="giverAddressLine2">முகவரி வரி 2</Label>
                        <Input
                          id="giverAddressLine2"
                          value={formData.giverAddressLine2}
                          onChange={(e) => handleInputChange("giverAddressLine2", e.target.value)}
                          placeholder="முகவரி வரி 2"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="giverAddressLine3">முகவரி வரி 3</Label>
                        <Input
                          id="giverAddressLine3"
                          value={formData.giverAddressLine3}
                          onChange={(e) => handleInputChange("giverAddressLine3", e.target.value)}
                          placeholder="முகவரி வரி 3"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="giverTaluk">வட்டம்</Label>
                        <Input
                          id="giverTaluk"
                          value={formData.giverTaluk}
                          onChange={(e) => handleInputChange("giverTaluk", e.target.value)}
                          placeholder="வட்டம்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="giverDistrict">மாவட்டம்</Label>
                        <Input
                          id="giverDistrict"
                          value={formData.giverDistrict}
                          onChange={(e) => handleInputChange("giverDistrict", e.target.value)}
                          placeholder="மாவட்டம்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="giverPincode">அஞ்சல் குறியீடு</Label>
                        <Input
                          id="giverPincode"
                          value={formData.giverPincode}
                          onChange={(e) => handleInputChange("giverPincode", e.target.value)}
                          placeholder="அஞ்சல் குறியீடு"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="giverAadharNo">ஆதார் எண்</Label>
                        <Input
                          id="giverAadharNo"
                          value={formData.giverAadharNo}
                          onChange={(e) => handleInputChange("giverAadharNo", e.target.value)}
                          placeholder="ஆதார் எண்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="giverPhoneNo">தொலைபேசி எண்</Label>
                        <Input
                          id="giverPhoneNo"
                          value={formData.giverPhoneNo}
                          onChange={(e) => handleInputChange("giverPhoneNo", e.target.value)}
                          placeholder="தொலைபேசி எண்"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Property Details Tab */}
              <TabsContent value="property" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="propertyDetails">சொத்து விவரம்</Label>
                      <Textarea
                        id="propertyDetails"
                        value={formData.propertyDetails}
                        onChange={(e) => handleInputChange("propertyDetails", e.target.value)}
                        placeholder="சொத்து விவரத்தை விரிவாக குறிப்பிடவும்"
                        rows={10}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Witness Details Tab */}
              <TabsContent value="witness" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-4">முதல் சாட்சி விவரங்கள்</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="witness1Name">பெயர்</Label>
                        <Input
                          id="witness1Name"
                          value={formData.witness1Name}
                          onChange={(e) => handleInputChange("witness1Name", e.target.value)}
                          placeholder="பெயர்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness1Age">வயது</Label>
                        <Input
                          id="witness1Age"
                          value={formData.witness1Age}
                          onChange={(e) => handleInputChange("witness1Age", e.target.value)}
                          placeholder="வயது"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness1Relation">உறவு வகை</Label>
                        <Input
                          id="witness1Relation"
                          value={formData.witness1Relation}
                          onChange={(e) => handleInputChange("witness1Relation", e.target.value)}
                          placeholder="உறவு வகை (மகன், மகள், மனைவி, தந்தை)"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="witness1RelationName">உறவினர் பெயர்</Label>
                      <Input
                        id="witness1RelationName"
                        value={formData.witness1RelationName}
                        onChange={(e) => handleInputChange("witness1RelationName", e.target.value)}
                        placeholder="உறவினர் பெயர்"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="witness1DoorNo">கதவு எண்</Label>
                        <Input
                          id="witness1DoorNo"
                          value={formData.witness1DoorNo}
                          onChange={(e) => handleInputChange("witness1DoorNo", e.target.value)}
                          placeholder="கதவு எண்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness1AddressLine1">முகவரி வரி 1</Label>
                        <Input
                          id="witness1AddressLine1"
                          value={formData.witness1AddressLine1}
                          onChange={(e) => handleInputChange("witness1AddressLine1", e.target.value)}
                          placeholder="முகவரி வரி 1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="witness1AddressLine2">முகவரி வரி 2</Label>
                        <Input
                          id="witness1AddressLine2"
                          value={formData.witness1AddressLine2}
                          onChange={(e) => handleInputChange("witness1AddressLine2", e.target.value)}
                          placeholder="முகவரி வரி 2"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness1AddressLine3">முகவரி வரி 3</Label>
                        <Input
                          id="witness1AddressLine3"
                          value={formData.witness1AddressLine3}
                          onChange={(e) => handleInputChange("witness1AddressLine3", e.target.value)}
                          placeholder="முகவரி வரி 3"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="witness1Taluk">வட்டம்</Label>
                        <Input
                          id="witness1Taluk"
                          value={formData.witness1Taluk}
                          onChange={(e) => handleInputChange("witness1Taluk", e.target.value)}
                          placeholder="வட்டம்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness1District">மாவட்டம்</Label>
                        <Input
                          id="witness1District"
                          value={formData.witness1District}
                          onChange={(e) => handleInputChange("witness1District", e.target.value)}
                          placeholder="மாவட்டம்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness1Pincode">அஞ்சல் குறியீடு</Label>
                        <Input
                          id="witness1Pincode"
                          value={formData.witness1Pincode}
                          onChange={(e) => handleInputChange("witness1Pincode", e.target.value)}
                          placeholder="அஞ்சல் குறியீடு"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="witness1AadharNo">ஆதார் எண்</Label>
                      <Input
                        id="witness1AadharNo"
                        value={formData.witness1AadharNo}
                        onChange={(e) => handleInputChange("witness1AadharNo", e.target.value)}
                        placeholder="ஆதார் எண்"
                      />
                    </div>

                    <h3 className="font-medium text-lg mb-4 mt-8">இரண்டாம் சாட்சி விவரங்கள்</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="witness2Name">ப���யர்</Label>
                        <Input
                          id="witness2Name"
                          value={formData.witness2Name}
                          onChange={(e) => handleInputChange("witness2Name", e.target.value)}
                          placeholder="பெயர்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness2Age">வயது</Label>
                        <Input
                          id="witness2Age"
                          value={formData.witness2Age}
                          onChange={(e) => handleInputChange("witness2Age", e.target.value)}
                          placeholder="வயது"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness2Relation">உறவு வகை</Label>
                        <Input
                          id="witness2Relation"
                          value={formData.witness2Relation}
                          onChange={(e) => handleInputChange("witness2Relation", e.target.value)}
                          placeholder="உறவு வகை (மகன், மகள், மனைவி, தந்தை)"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="witness2RelationName">உறவினர் பெயர்</Label>
                      <Input
                        id="witness2RelationName"
                        value={formData.witness2RelationName}
                        onChange={(e) => handleInputChange("witness2RelationName", e.target.value)}
                        placeholder="உறவினர் பெயர்"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="witness2DoorNo">கதவு எண்</Label>
                        <Input
                          id="witness2DoorNo"
                          value={formData.witness2DoorNo}
                          onChange={(e) => handleInputChange("witness2DoorNo", e.target.value)}
                          placeholder="கதவு எண்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness2AddressLine1">முகவரி வரி 1</Label>
                        <Input
                          id="witness2AddressLine1"
                          value={formData.witness2AddressLine1}
                          onChange={(e) => handleInputChange("witness2AddressLine1", e.target.value)}
                          placeholder="முகவரி வரி 1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="witness2AddressLine2">முகவரி வரி 2</Label>
                        <Input
                          id="witness2AddressLine2"
                          value={formData.witness2AddressLine2}
                          onChange={(e) => handleInputChange("witness2AddressLine2", e.target.value)}
                          placeholder="முகவரி வரி 2"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness2AddressLine3">முகவரி வரி 3</Label>
                        <Input
                          id="witness2AddressLine3"
                          value={formData.witness2AddressLine3}
                          onChange={(e) => handleInputChange("witness2AddressLine3", e.target.value)}
                          placeholder="முகவரி வரி 3"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="witness2Taluk">வட்டம்</Label>
                        <Input
                          id="witness2Taluk"
                          value={formData.witness2Taluk}
                          onChange={(e) => handleInputChange("witness2Taluk", e.target.value)}
                          placeholder="வட்டம்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness2District">மாவட்டம்</Label>
                        <Input
                          id="witness2District"
                          value={formData.witness2District}
                          onChange={(e) => handleInputChange("witness2District", e.target.value)}
                          placeholder="மாவட்டம்"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="witness2Pincode">அஞ்சல் குறியீடு</Label>
                        <Input
                          id="witness2Pincode"
                          value={formData.witness2Pincode}
                          onChange={(e) => handleInputChange("witness2Pincode", e.target.value)}
                          placeholder="அஞ்சல் குறியீடு"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="witness2AadharNo">ஆதார் எண்</Label>
                      <Input
                        id="witness2AadharNo"
                        value={formData.witness2AadharNo}
                        onChange={(e) => handleInputChange("witness2AadharNo", e.target.value)}
                        placeholder="ஆதார் எண்"
                      />
                    </div>

                    <div className="mt-8">
                      <h3 className="font-medium text-lg mb-4">தட்டச்சு விவரங்கள்</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="typistName">தட்டச்சாளர் பெயர்</Label>
                          <Select
                            value={formData.typistName}
                            onValueChange={(value) => handleInputChange("typistName", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="தட்டச்சாளரை தேர்ந்தெடுக்கவும்" />
                            </SelectTrigger>
                            <SelectContent>
                              {typists.map((typist) => (
                                <SelectItem key={typist.id} value={typist.name}>
                                  {typist.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="typistOffice">அலுவலகம்</Label>
                          <Input
                            id="typistOffice"
                            value={formData.typistOffice}
                            onChange={(e) => handleInputChange("typistOffice", e.target.value)}
                            placeholder="அலுவலகம்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="typistPhone">தொலைபேசி எண்</Label>
                          <Input
                            id="typistPhone"
                            value={formData.typistPhone}
                            onChange={(e) => handleInputChange("typistPhone", e.target.value)}
                            placeholder="தொலைபேசி எண்"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? "சமர்ப்பிக்கிறது..." : "சமர்ப்பி"}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div>
          <Card className="p-6 border-amber-200 shadow-md bg-white h-full overflow-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-amber-800">பாகபாத்திய விடுதலை ஆவணம்</h2>
              <p className="text-amber-600">ஆவண முன்னோட்டம்</p>
            </div>

            {generateDocumentPreview()}
          </Card>
        </div>
      </div>
    </div>
  )
}

// Also export as default for backward compatibility
export default CreatePartitionReleaseForm
