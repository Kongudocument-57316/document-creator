"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { saveDocument } from "./save-document-action"
import { useRouter } from "next/navigation"
import { DocumentNameDialog } from "@/components/document-name-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Save, RefreshCw, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserSearch } from "./user-search"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type {
  Party,
  Witness,
  User,
  DocumentType,
  SubRegistrarOffice,
  BookNumber,
  Typist,
  TypistOffice,
  SubmissionType,
} from "./fetch-data-utils"

// Form schema
const formSchema = z.object({
  documentName: z.string().optional(),
  documentNumber: z.string().optional(),
  documentDate: z.string().optional(), // Changed from date to string
  documentPlace: z.string().optional(),
  registrationOfficeId: z.string().optional(),
  bookNumberId: z.string().optional(),
  documentYear: z.string().optional(),
  documentTypeId: z.string().optional(),
  submissionTypeId: z.string().optional(),
  previousDocumentDate: z.string().optional(), // Changed from date to string
  previousDocumentNumber: z.string().optional(),

  // First party (donor) details
  firstPartyName: z.string().optional(),
  firstPartyAge: z.string().optional(),
  firstPartyAddress: z.string().optional(),
  donorDoorNo: z.string().optional(),
  donorAddressLine1: z.string().optional(),
  donorAddressLine2: z.string().optional(),
  donorAddressLine3: z.string().optional(),
  donorTaluk: z.string().optional(),
  donorDistrict: z.string().optional(),
  donorPincode: z.string().optional(),
  donorAadharNo: z.string().optional(),
  donorPhoneNo: z.string().optional(),
  donorRelationName: z.string().optional(),
  donorRelationType: z.string().optional(),

  // Second party (recipient) details
  secondPartyName: z.string().optional(),
  secondPartyAge: z.string().optional(),
  secondPartyAddress: z.string().optional(),
  recipientDoorNo: z.string().optional(),
  recipientAddressLine1: z.string().optional(),
  recipientAddressLine2: z.string().optional(),
  recipientAddressLine3: z.string().optional(),
  recipientTaluk: z.string().optional(),
  recipientDistrict: z.string().optional(),
  recipientPincode: z.string().optional(),
  recipientAadharNo: z.string().optional(),
  recipientPhoneNo: z.string().optional(),
  recipientRelationName: z.string().optional(),
  recipientRelationType: z.string().optional(),

  // Relationship between parties
  relationshipType: z.string().optional(),

  // Previous document details
  prDocumentDate: z.string().optional(),
  prDocumentMonth: z.string().optional(),
  prDocumentYear: z.string().optional(),
  prBookNo: z.string().optional(),
  prDocumentNo: z.string().optional(),
  prDocumentType: z.string().optional(),
  prDocumentCopyType: z.string().optional(),
  subRegistrarOffice: z.string().optional(),

  // Property details
  propertyDescription: z.string().optional(),
  propertyBoundaries: z.string().optional(),
  propertyArea: z.string().optional(),
  settlementAmount: z.string().optional(),

  // Witness 1 details
  witness1Name: z.string().optional(),
  witness1Age: z.string().optional(),
  witness1Address: z.string().optional(),
  witness1RelationName: z.string().optional(),
  witness1RelationType: z.string().optional(),
  witness1DoorNo: z.string().optional(),
  witness1AddressLine1: z.string().optional(),
  witness1AddressLine2: z.string().optional(),
  witness1AddressLine3: z.string().optional(),
  witness1Taluk: z.string().optional(),
  witness1District: z.string().optional(),
  witness1Pincode: z.string().optional(),
  witness1AadharNo: z.string().optional(),

  // Witness 2 details
  witness2Name: z.string().optional(),
  witness2Age: z.string().optional(),
  witness2Address: z.string().optional(),
  witness2RelationName: z.string().optional(),
  witness2RelationType: z.string().optional(),
  witness2DoorNo: z.string().optional(),
  witness2AddressLine1: z.string().optional(),
  witness2AddressLine2: z.string().optional(),
  witness2AddressLine3: z.string().optional(),
  witness2Taluk: z.string().optional(),
  witness2District: z.string().optional(),
  witness2Pincode: z.string().optional(),
  witness2AadharNo: z.string().optional(),

  // Typist details
  typistId: z.string().optional(),
  typistOfficeId: z.string().optional(),
  typistName: z.string().optional(),
  typistOfficeName: z.string().optional(),
  typistOfficeLocation: z.string().optional(),
  typistPhoneNo: z.string().optional(),

  // Additional terms
  additionalTerms: z.string().optional(),
})

export type SettlementFormValues = z.infer<typeof formSchema>

interface CreateSettlementDocumentFormProps {
  parties: Party[]
  witnesses: Witness[]
  users: User[]
  documentTypes: DocumentType[]
  submissionTypes: SubmissionType[]
  subRegistrarOffices: SubRegistrarOffice[]
  bookNumbers: BookNumber[]
  typists: Typist[]
  typistOffices: TypistOffice[]
  defaultValues: {
    defaultRegistrationOffice: string
    defaultBookNumber: string
    defaultTypist: string
    defaultTypistOffice: string
  }
  error?: string
}

export function CreateSettlementDocumentForm({
  parties = [],
  witnesses = [],
  users = [],
  documentTypes = [],
  submissionTypes = [],
  subRegistrarOffices = [],
  bookNumbers = [],
  typists = [],
  typistOffices = [],
  defaultValues = {
    defaultRegistrationOffice: "",
    defaultBookNumber: "",
    defaultTypist: "",
    defaultTypistOffice: "",
  },
  error,
}: CreateSettlementDocumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPreviewVisible, setIsPreviewVisible] = useState(true)
  const [autoPreview, setAutoPreview] = useState(true)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const { toast } = useToast()
  const router = useRouter()

  // Initialize form with default values
  const form = useForm<SettlementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentName: "",
      documentNumber: "",
      documentDate: new Date().toLocaleDateString("en-GB"), // Format as DD/MM/YYYY
      documentPlace: "",
      registrationOfficeId: defaultValues.defaultRegistrationOffice || "",
      bookNumberId: defaultValues.defaultBookNumber || "",
      documentYear: new Date().getFullYear().toString(),
      documentTypeId: "",
      submissionTypeId: "",
      previousDocumentDate: "", // Empty string instead of Date
      previousDocumentNumber: "",

      // First party (donor) details
      firstPartyName: "",
      firstPartyAge: "",
      firstPartyAddress: "",
      donorDoorNo: "",
      donorAddressLine1: "",
      donorAddressLine2: "",
      donorAddressLine3: "",
      donorTaluk: "",
      donorDistrict: "",
      donorPincode: "",
      donorAadharNo: "",
      donorPhoneNo: "",
      donorRelationName: "",
      donorRelationType: "father", // Default relationship type

      // Second party (recipient) details
      secondPartyName: "",
      secondPartyAge: "",
      secondPartyAddress: "",
      recipientDoorNo: "",
      recipientAddressLine1: "",
      recipientAddressLine2: "",
      recipientAddressLine3: "",
      recipientTaluk: "",
      recipientDistrict: "",
      recipientPincode: "",
      recipientAadharNo: "",
      recipientPhoneNo: "",
      recipientRelationName: "",
      recipientRelationType: "son", // Default relationship type

      // Relationship between parties
      relationshipType: "father", // Default relationship type

      // Previous document details
      prDocumentDate: "",
      prDocumentMonth: "",
      prDocumentYear: "",
      prBookNo: "",
      prDocumentNo: "",
      prDocumentType: "",
      prDocumentCopyType: "original", // Default to original
      subRegistrarOffice: "",

      // Property details
      propertyDescription: "",
      propertyBoundaries: "",
      propertyArea: "",
      settlementAmount: "",

      // Witness 1 details
      witness1Name: "",
      witness1Age: "",
      witness1Address: "",
      witness1RelationName: "",
      witness1RelationType: "father",
      witness1DoorNo: "",
      witness1AddressLine1: "",
      witness1AddressLine2: "",
      witness1AddressLine3: "",
      witness1Taluk: "",
      witness1District: "",
      witness1Pincode: "",
      witness1AadharNo: "",

      // Witness 2 details
      witness2Name: "",
      witness2Age: "",
      witness2Address: "",
      witness2RelationName: "",
      witness2RelationType: "father",
      witness2DoorNo: "",
      witness2AddressLine1: "",
      witness2AddressLine2: "",
      witness2AddressLine3: "",
      witness2Taluk: "",
      witness2District: "",
      witness2Pincode: "",
      witness2AadharNo: "",

      // Typist details
      typistId: defaultValues.defaultTypist || "",
      typistOfficeId: defaultValues.defaultTypistOffice || "",
      typistName: "",
      typistOfficeName: "",
      typistOfficeLocation: "",
      typistPhoneNo: "",

      // Additional terms
      additionalTerms: "",
    },
  })

  // Effect to update form values when defaultValues change
  useEffect(() => {
    if (defaultValues.defaultTypistOffice) {
      form.setValue("typistOfficeId", defaultValues.defaultTypistOffice)
    }
    if (defaultValues.defaultTypist) {
      form.setValue("typistId", defaultValues.defaultTypist)
    }
    if (defaultValues.defaultRegistrationOffice) {
      form.setValue("registrationOfficeId", defaultValues.defaultRegistrationOffice)
    }
    if (defaultValues.defaultBookNumber) {
      form.setValue("bookNumberId", defaultValues.defaultBookNumber)
    }
  }, [defaultValues, form])

  // Form submission handler
  const onSubmit = async (values: SettlementFormValues) => {
    setIsDialogOpen(true)
  }

  // Save document handler
  const handleSaveDocument = async (documentName: string) => {
    setIsSubmitting(true)
    try {
      const values = form.getValues()
      const result = await saveDocument({
        ...values,
        documentName,
      })

      if (result.success) {
        toast({
          title: "வெற்றி",
          description: "ஆவணம் வெற்றிகரமாக சேமிக���கப்பட்டது",
        })
        form.reset()
        router.refresh() // Refresh the route
      } else {
        toast({
          title: "பிழை",
          description: result.error || "ஆவணத்தை சேமிப்பதில் பிழை ஏற்பட்டது",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving document:", error)
      toast({
        title: "பிழை",
        description: "ஆவணத்தை சேமிப்பதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsDialogOpen(false)
    }
  }

  // Load draft handler
  const handleLoadDraft = (draftData: any) => {
    try {
      // Reset form with draft data
      form.reset(draftData)

      // No need to handle date conversion since we're using strings now

      toast({
        title: "வரைவு ஏற்றப்பட்டது",
        description: "வரைவு வெற்றிகரமாக ஏற்றப்பட்டது",
      })
    } catch (error) {
      console.error("Error loading draft:", error)
      toast({
        title: "பிழை",
        description: "வரைவை ஏற்றுவதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    }
  }

  // Reset form handler
  const handleResetForm = () => {
    setIsResetDialogOpen(true)
  }

  // Confirm reset handler
  const confirmReset = () => {
    try {
      form.reset()
      setIsResetDialogOpen(false)
      toast({
        title: "படிவம் மீட்டமைக்கப்��ட்டது",
        description: "அனைத்து புலங்களும் அழிக்கப்பட்டன",
      })
    } catch (error) {
      console.error("Error resetting form:", error)
      toast({
        title: "பிழை",
        description: "படிவத்தை மீட்டமைப்பதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    }
  }

  // User selection handlers
  const handleFirstPartySelect = (user: any) => {
    form.setValue("firstPartyName", user.name || "")
    form.setValue("firstPartyAge", user.age || "")
    form.setValue("firstPartyAddress", user.address || formatAddress(user) || "")
  }

  const handleSecondPartySelect = (user: any) => {
    form.setValue("secondPartyName", user.name || "")
    form.setValue("secondPartyAge", user.age || "")
    form.setValue("secondPartyAddress", user.address || formatAddress(user) || "")
  }

  const handleWitness1Select = (user: any) => {
    form.setValue("witness1Name", user.name || "")
    form.setValue("witness1Age", user.age || "")
    form.setValue("witness1Address", user.address || formatAddress(user) || "")
  }

  const handleWitness2Select = (user: any) => {
    form.setValue("witness2Name", user.name || "")
    form.setValue("witness2Age", user.age || "")
    form.setValue("witness2Address", user.address || formatAddress(user) || "")
  }

  // Helper function to format address
  function formatAddress(user: any): string {
    if (!user) return ""

    const addressParts = [
      user.door_no,
      user.address_line1,
      user.address_line2,
      user.address_line3,
      user.taluk,
      user.district,
      user.pincode,
    ].filter(Boolean)

    return addressParts.length > 0 ? addressParts.join(", ") : ""
  }

  // Tab navigation handlers
  const handleNextTab = () => {
    const tabs = ["basic", "users", "property", "witnesses", "typist"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handlePreviousTab = () => {
    const tabs = ["basic", "users", "property", "witnesses", "typist"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  // Get form values for preview
  const formValues = form.getValues()

  // Find typist and typist office names for display
  const selectedTypist = typists.find((t) => t.id === formValues.typistId)
  const selectedTypistOffice = typistOffices.find((o) => o.id === formValues.typistOfficeId)

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>பிழை</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button onClick={() => router.refresh()}>மீண்டும் முயற்சிக்கவும்</Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">புதிய தானசெட்டில்மெண்ட் ஆவண உருவாக்க படிவம்</h2>
          <p className="text-muted-foreground">தானசெட்டில்மெண்ட் ஆவணத்தை உருவாக்க கீழே உள்ள படிவத்தை நிரப்பவும்</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch id="auto-preview" checked={autoPreview} onCheckedChange={setAutoPreview} />
            <Label htmlFor="auto-preview">தானியங்கி முன்னோட்டம்</Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">அடிப்படை</TabsTrigger>
                  <TabsTrigger value="users">பயனாளர்</TabsTrigger>
                  <TabsTrigger value="property">சொத்து</TabsTrigger>
                  <TabsTrigger value="witnesses">சாட்சிகள்</TabsTrigger>
                  <TabsTrigger value="typist">தட்டச்சு</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>அடிப்படை விவரங்கள்</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="documentDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>ஆவணத் தேதி (DD/MM/YYYY)</FormLabel>
                            <FormControl>
                              <Input placeholder="DD/MM/YYYY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-medium mb-4">முந்தைய ஆவணம் விவரங்கள்</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="previousDocumentDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>முந்தைய ஆவணத் தேதி (DD/MM/YYYY)</FormLabel>
                                <FormControl>
                                  <Input placeholder="DD/MM/YYYY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="registrationOfficeId"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>சார்பதிவாளர் அலுவலகம்</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தை தேர்ந்தெடுக்கவும்" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {subRegistrarOffices.map((office) => (
                                      <SelectItem key={office.id} value={office.id}>
                                        {office.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="bookNumberId"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>புத்தக எண்</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="புத்தக எண்ணை தேர்ந்தெடுக்கவும்" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {bookNumbers.map((book) => (
                                      <SelectItem key={book.id} value={book.id}>
                                        {book.number}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="documentYear"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>ஆவண ஆண்டு</FormLabel>
                                <FormControl>
                                  <Input placeholder="ஆவண ஆண்டை உள்ளிடவும்" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="documentNumber"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>ஆவண எண்</FormLabel>
                                <FormControl>
                                  <Input placeholder="ஆவண எண்ணை உள்ளிடவும்" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="documentTypeId"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>ஆவணத்தின் வகை</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="ஆவணத்தின் வகையை தேர்ந்தெடுக்கவும்" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {documentTypes.map((type) => (
                                      <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="submissionTypeId"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>ஆவணம் ஒப்படைப்பு வகை</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="ஆவணம் ஒப்படைப்பு வகையை தேர்ந்தெடுக்கவும்" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {submissionTypes.map((type) => (
                                      <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="documentPlace"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>ஆவணம் நிறைவேற்றப்பட்ட இடம்</FormLabel>
                            <FormControl>
                              <Input placeholder="ஆவணம் நிறைவேற்றப்பட்ட இடத்தை உள்ளிடவும்" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>பயனாளர் விவரங்கள்</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="border p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-4">எழுதிகொடுப்பவர்கள் விவரங்கள்</h3>
                        <UserSearch title="" onSelect={handleFirstPartySelect} users={[...parties, ...users]} />

                        <div className="mt-4 border-t pt-4">
                          <h4 className="font-medium mb-2">தேர்ந்தெடுக்கப்பட்ட விவரங்கள்</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <FormField
                              control={form.control}
                              name="firstPartyName"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>பெயர்</FormLabel>
                                  <FormControl>
                                    <Input placeholder="பெயரை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="firstPartyAge"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>வயது</FormLabel>
                                  <FormControl>
                                    <Input placeholder="வயதை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="firstPartyAddress"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>முகவரி</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="முகவரியை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-4">எழுதிவாங்குபவர்கள் விவரங்கள்</h3>
                        <UserSearch title="" onSelect={handleSecondPartySelect} users={[...parties, ...users]} />

                        <div className="mt-4 border-t pt-4">
                          <h4 className="font-medium mb-2">தேர்ந்தெடுக்கப்பட்ட விவரங்கள்</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <FormField
                              control={form.control}
                              name="secondPartyName"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>பெயர்</FormLabel>
                                  <FormControl>
                                    <Input placeholder="பெயரை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="secondPartyAge"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>வயது</FormLabel>
                                  <FormControl>
                                    <Input placeholder="வயதை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="secondPartyAddress"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>முகவரி</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="முகவரியை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="property" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>சொத்து விவரங்கள்</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="propertyDescription"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>சொத்து விவரம்</FormLabel>
                            <FormControl>
                              <Textarea placeholder="சொத்து விவரங்களை உள்ளிடவும்" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="propertyBoundaries"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>சொத்து எல்லைகள்</FormLabel>
                            <FormControl>
                              <Textarea placeholder="சொத்தின் எல்லைகளை உள்ளிடவும்" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="propertyArea"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>சொத்தின் அளவு</FormLabel>
                            <FormControl>
                              <Input placeholder="சொத்தின் அளவை உள்ளிடவும்" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="settlementAmount"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>தீர்வு தொகை</FormLabel>
                            <FormControl>
                              <Input placeholder="தீர்வு தொகையை உள்ளிடவும்" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="witnesses" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>சாட்சிகள் விவரங்கள்</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="border p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-4">சாட்சி 1 விவரங்கள்</h3>
                        <UserSearch title="" onSelect={handleWitness1Select} users={[...witnesses, ...users]} />

                        <div className="mt-4 border-t pt-4">
                          <h4 className="font-medium mb-2">தேர்ந்தெடுக்கப்பட்ட விவரங்கள்</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <FormField
                              control={form.control}
                              name="witness1Name"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>பெயர்</FormLabel>
                                  <FormControl>
                                    <Input placeholder="பெயரை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="witness1Age"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>வயது</FormLabel>
                                  <FormControl>
                                    <Input placeholder="வயதை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="witness1Address"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>முகவரி</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="��ுகவரியை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-4">சாட்சி 2 விவரங்கள்</h3>
                        <UserSearch title="" onSelect={handleWitness2Select} users={[...witnesses, ...users]} />

                        <div className="mt-4 border-t pt-4">
                          <h4 className="font-medium mb-2">தேர்ந்தெடுக்கப்பட்ட விவரங்கள்</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <FormField
                              control={form.control}
                              name="witness2Name"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>பெயர்</FormLabel>
                                  <FormControl>
                                    <Input placeholder="பெயரை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="witness2Age"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>வயது</FormLabel>
                                  <FormControl>
                                    <Input placeholder="வயதை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="witness2Address"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>முகவரி</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="முகவரியை உள்ளிடவும்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="typist" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>தட்டச்சு அலுவலகம்</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-md mb-4">
                        <p className="text-sm text-blue-700">இந்த விவரங்கள் அமைப்புகள் பக்கத்திலிருந்து தானாகவே ஏற்றப்படுகின்றன</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="typistId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>தட்டச்சாளர்</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="தட்டச்சாளரை தேர்ந்தெடுக்கவும்" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {typists.length === 0 ? (
                                  <SelectItem value="no-typists" disabled>
                                    தட்டச்சாளர்கள் எதுவும் இல்லை
                                  </SelectItem>
                                ) : (
                                  typists.map((typist) => (
                                    <SelectItem key={typist.id} value={typist.id}>
                                      {typist.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            {typists.length === 0 && (
                              <p className="text-sm text-amber-600 mt-1">
                                தட்டச்சாளர்கள் எதுவும் இல்லை. அமைப்புகள் பக்கத்தில் சேர்க்கவும்.
                              </p>
                            )}
                            {selectedTypist && (
                              <p className="text-sm text-muted-foreground mt-1">தற்போதைய தேர்வு: {selectedTypist.name}</p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="typistOfficeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>தட்டச்சு அலுவலகம்</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="தட்டச்சு அலுவலகத்தை தேர்ந்தெடுக்கவும்" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {typistOffices.length === 0 ? (
                                  <SelectItem value="no-offices" disabled>
                                    தட்டச்சு அலுவலகங்கள் எதுவும் இல்லை
                                  </SelectItem>
                                ) : (
                                  typistOffices.map((office) => (
                                    <SelectItem key={office.id} value={office.id}>
                                      {office.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            {typistOffices.length === 0 && (
                              <p className="text-sm text-amber-600 mt-1">
                                தட்டச்சு அலுவலகங்கள் எதுவும் இல்லை. அமைப்புகள் பக்கத்தில் சேர்க்கவும்.
                              </p>
                            )}
                            {selectedTypistOffice && (
                              <p className="text-sm text-muted-foreground mt-1">
                                தற்போதைய தேர்வு: {selectedTypistOffice.name}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handlePreviousTab} disabled={activeTab === "basic"}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    முந்தைய பக்கம்
                  </Button>
                  <Button type="button" variant="outline" onClick={handleNextTab} disabled={activeTab === "typist"}>
                    அடுத்த பக்கம்
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleResetForm}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    மீட்டமை
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    சேமிக்க
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle>ஆவண முன்னோட்டம்</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {isPreviewVisible && (
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-4">தானசெட்டில்மெண்ட் ஆவணம்</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold">ஆவணத் தேதி:</p>
                        <p>{formValues.documentDate || "-"}</p>
                      </div>

                      <div>
                        <p className="font-semibold">எழுதிகொடுப்பவர்:</p>
                        <p>
                          {formValues.firstPartyName || "-"}, வயது: {formValues.firstPartyAge || "-"}
                        </p>
                        <p>{formValues.firstPartyAddress || "-"}</p>
                      </div>

                      <div>
                        <p className="font-semibold">எழுதிவாங்குபவர்:</p>
                        <p>
                          {formValues.secondPartyName || "-"}, வயது: {formValues.secondPartyAge || "-"}
                        </p>
                        <p>{formValues.secondPartyAddress || "-"}</p>
                      </div>

                      <div>
                        <p className="font-semibold">சொத்து விவரம்:</p>
                        <p>{formValues.propertyDescription || "-"}</p>
                      </div>

                      <div>
                        <p className="font-semibold">சொத்து எல்லைகள்:</p>
                        <p>{formValues.propertyBoundaries || "-"}</p>
                      </div>

                      <div>
                        <p className="font-semibold">சொத்தின் அளவு:</p>
                        <p>{formValues.propertyArea || "-"}</p>
                      </div>

                      <div>
                        <p className="font-semibold">தீர்வு தொகை:</p>
                        <p>{formValues.settlementAmount || "-"}</p>
                      </div>

                      <div>
                        <p className="font-semibold">தட்டச்சு விவரங்கள்:</p>
                        <p>தட்டச்சாளர்: {selectedTypist?.name || "-"}</p>
                        <p>அலுவலகம்: {selectedTypistOffice?.name || "-"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsPreviewVisible(!isPreviewVisible)}>
                {isPreviewVisible ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    மறை
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    காட்டு
                  </>
                )}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    try {
                      // Save draft functionality
                      const draftData = form.getValues()
                      localStorage.setItem("settlementDocumentDraft", JSON.stringify(draftData))
                      toast({
                        title: "வரைவு சேமிக்கப்பட்டது",
                        description: "உங்கள் வரைவு உள்ளூர் சேமிப்பில் சேமிக்கப்பட்டது",
                      })
                    } catch (error) {
                      console.error("Error saving draft:", error)
                      toast({
                        title: "பிழை",
                        description: "வரைவை சேமிப்பதில் பிழை ஏற்பட்டது",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  வரைவு சேமி
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    try {
                      // Load draft functionality
                      const savedDraft = localStorage.getItem("settlementDocumentDraft")
                      if (savedDraft) {
                        const draftData = JSON.parse(savedDraft)
                        handleLoadDraft(draftData)
                      } else {
                        toast({
                          title: "வரைவு இல்லை",
                          description: "சேமிக்கப்பட்ட வரைவு எதுவும் கிடைக்கவில்லை",
                          variant: "destructive",
                        })
                      }
                    } catch (error) {
                      console.error("Error loading draft:", error)
                      toast({
                        title: "பிழை",
                        description: "வரைவை ஏற்றுவதில் பிழை ஏற்பட்டது",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  வரைவ�� ஏற்று
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <DocumentNameDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSaveDocument} />

      {/* Reset Confirmation Dialog */}
      <dialog
        className={`fixed inset-0 z-50 bg-black/50 ${isResetDialogOpen ? "flex" : "hidden"} items-center justify-center`}
        open={isResetDialogOpen}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">படிவத்தை மீட்டமைக்க விரும்புகிறீர்களா?</h3>
          <p className="mb-4">இந்த செயல்பாடு அனைத்து புலங்களையும் அழித்துவிடும். தொடர விரும்புகிறீர்களா?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              ரத்து செய்
            </Button>
            <Button variant="destructive" onClick={confirmReset}>
              மீட்டமை
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
