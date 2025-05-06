"use client"

import { Label } from "@/components/ui/label"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BookNumber {
  id: number
  number: string
}

interface DocumentType {
  id: number
  name: string
}

interface SubmissionType {
  id: number
  name: string
}

interface Typist {
  id: number
  name: string
}

interface Office {
  id: number
  name: string
}

interface RegistrationDistrict {
  id: number
  name: string
}

interface SubRegistrarOffice {
  id: number
  name: string
  registration_district_id: number
}

interface Property {
  id: number
  property_name: string
}

interface User {
  id: number
  name: string
}

interface PaymentMethod {
  id: number
  name: string
}

interface LandType {
  id: number
  name: string
}

const formSchema = z.object({
  document_number: z.string().min(1, { message: "ஆவண எண் தேவை" }),
  document_date: z.date({ required_error: "ஆவண தேதி தேவை" }),
  book_number_id: z.string().min(1, { message: "புத்தக எண் தேவை" }),
  document_type_id: z.string().min(1, { message: "ஆவண வகை தேவை" }),
  submission_type_id: z.string().min(1, { message: "ஒப்படைப்பு வகை தேவை" }),
  typist_id: z.string().optional(),
  office_id: z.string().optional(),
  registration_district_id: z.string().min(1, { message: "பதிவு மாவட்டம் தேவை" }),
  sub_registrar_office_id: z.string().min(1, { message: "சார்பதிவாளர் அலுவலகம் தேவை" }),
  property_id: z.string().min(1, { message: "சொத்து விவரம் தேவை" }),
  seller_id: z.string().min(1, { message: "விற்பனையாளர் தேவை" }),
  buyer_id: z.string().min(1, { message: "வாங்குபவர் தேவை" }),
  sale_amount: z.string().min(1, { message: "விற்பனை தொகை தேவை" }),
  payment_method_id: z.string().min(1, { message: "பணம் செலுத்தும் முறை தேவை" }),
  land_type_id: z.string().optional(),
  remarks: z.string().optional(),
})

export function SaleDocumentForm() {
  const [bookNumbers, setBookNumbers] = useState<BookNumber[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [submissionTypes, setSubmissionTypes] = useState<SubmissionType[]>([])
  const [typists, setTypists] = useState<Typist[]>([])
  const [offices, setOffices] = useState<Office[]>([])
  const [registrationDistricts, setRegistrationDistricts] = useState<RegistrationDistrict[]>([])
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [filteredSubRegistrarOffices, setFilteredSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [landTypes, setLandTypes] = useState<LandType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [documentFile, setDocumentFile] = useState<File | null>(null)

  const supabase = getSupabaseBrowserClient()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_number: "",
      document_date: new Date(),
      book_number_id: "",
      document_type_id: "",
      submission_type_id: "",
      typist_id: "",
      office_id: "",
      registration_district_id: "",
      sub_registrar_office_id: "",
      property_id: "",
      seller_id: "",
      buyer_id: "",
      sale_amount: "",
      payment_method_id: "",
      land_type_id: "",
      remarks: "",
    },
  })

  useEffect(() => {
    async function fetchReferenceData() {
      try {
        // Fetch book numbers
        const { data: bookNumbersData } = await supabase.from("book_numbers").select("id, number").order("number")
        if (bookNumbersData) setBookNumbers(bookNumbersData)

        // Fetch document types
        const { data: documentTypesData } = await supabase.from("document_types").select("id, name").order("name")
        if (documentTypesData) setDocumentTypes(documentTypesData)

        // Fetch submission types
        const { data: submissionTypesData } = await supabase.from("submission_types").select("id, name").order("name")
        if (submissionTypesData) setSubmissionTypes(submissionTypesData)

        // Fetch typists
        const { data: typistsData } = await supabase.from("typists").select("id, name").order("name")
        if (typistsData) setTypists(typistsData)

        // Fetch offices
        const { data: officesData } = await supabase.from("offices").select("id, name").order("name")
        if (officesData) setOffices(officesData)

        // Fetch registration districts
        const { data: registrationDistrictsData } = await supabase
          .from("registration_districts")
          .select("id, name")
          .order("name")
        if (registrationDistrictsData) setRegistrationDistricts(registrationDistrictsData)

        // Fetch sub registrar offices
        const { data: subRegistrarOfficesData } = await supabase
          .from("sub_registrar_offices")
          .select("id, name, registration_district_id")
          .order("name")
        if (subRegistrarOfficesData) setSubRegistrarOffices(subRegistrarOfficesData)

        // Fetch properties
        const { data: propertiesData } = await supabase
          .from("properties")
          .select("id, property_name")
          .order("property_name")
        if (propertiesData) setProperties(propertiesData)

        // Fetch users
        const { data: usersData } = await supabase.from("users").select("id, name").order("name")
        if (usersData) setUsers(usersData)

        // Fetch payment methods
        const { data: paymentMethodsData } = await supabase.from("payment_methods").select("id, name").order("name")
        if (paymentMethodsData) setPaymentMethods(paymentMethodsData)

        // Fetch land types
        const { data: landTypesData } = await supabase.from("land_types").select("id, name").order("name")
        if (landTypesData) setLandTypes(landTypesData)
      } catch (error) {
        console.error("Error fetching reference data:", error)
        toast.error("தரவுகளை பெறுவதில் பிழை ஏற்பட்டது")
      }
    }

    fetchReferenceData()
  }, [supabase])

  useEffect(() => {
    const registrationDistrictId = form.watch("registration_district_id")
    if (registrationDistrictId) {
      const filtered = subRegistrarOffices.filter(
        (office) => office.registration_district_id === Number.parseInt(registrationDistrictId),
      )
      setFilteredSubRegistrarOffices(filtered)
    } else {
      setFilteredSubRegistrarOffices([])
    }
  }, [form.watch("registration_district_id"), subRegistrarOffices])

  const uploadFile = async (file: File) => {
    try {
      const fileName = `${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage.from("document_files").upload(fileName, file)

      if (error) throw error

      return fileName
    } catch (error: any) {
      console.error("File upload error:", error)
      throw new Error(`File upload failed: ${error.message}`)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      let documentFilePath = null

      // Upload document file if provided
      if (documentFile) {
        try {
          documentFilePath = await uploadFile(documentFile)
        } catch (error: any) {
          toast.error("ஆவண கோப்பு பதிவேற்றத்தில் பிழை: " + error.message)
        }
      }

      // Convert string values to numbers for numeric fields
      const numericValues = {
        document_number: values.document_number,
        document_date: values.document_date.toISOString().split("T")[0],
        book_number_id: Number.parseInt(values.book_number_id),
        document_type_id: Number.parseInt(values.document_type_id),
        submission_type_id: Number.parseInt(values.submission_type_id),
        typist_id: values.typist_id ? Number.parseInt(values.typist_id) : null,
        office_id: values.office_id ? Number.parseInt(values.office_id) : null,
        registration_district_id: Number.parseInt(values.registration_district_id),
        sub_registrar_office_id: Number.parseInt(values.sub_registrar_office_id),
        property_id: Number.parseInt(values.property_id),
        seller_id: Number.parseInt(values.seller_id),
        buyer_id: Number.parseInt(values.buyer_id),
        sale_amount: Number.parseFloat(values.sale_amount),
        payment_method_id: Number.parseInt(values.payment_method_id),
        land_type_id: values.land_type_id ? Number.parseInt(values.land_type_id) : null,
        document_file_path: documentFilePath,
        remarks: values.remarks,
      }

      const { error, data } = await supabase.from("sale_documents").insert([numericValues]).select()

      if (error) {
        throw error
      }

      toast({
        title: "ஆவணம் சேர்க்கப்பட்டது",
        description: "கிரைய ஆவண விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன",
      })

      form.reset()
      setDocumentFile(null)

      // Navigate to the search page
      router.push("/document-details/sale-document/search")
    } catch (error: any) {
      toast({
        title: "பிழை ஏற்பட்டது",
        description: error.message || "ஆவண விவரங்களை சேமிக்க முடியவில்லை",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="document_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">ஆவண எண்</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ஆவண எண் உள்ளிடவும்"
                    {...field}
                    className="border-cyan-200 focus-visible:ring-cyan-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="document_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-cyan-800 font-medium">ஆவண தேதி</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-cyan-200 focus-visible:ring-cyan-400",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>தேதியை தேர்ந்தெடுக்கவும்</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="book_number_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">புத்தக எண்</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="புத்தக எண் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bookNumbers.map((bookNumber) => (
                      <SelectItem key={bookNumber.id} value={bookNumber.id.toString()}>
                        {bookNumber.number}
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
            name="document_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">ஆவண வகை</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="ஆவண வகை தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {documentTypes.map((documentType) => (
                      <SelectItem key={documentType.id} value={documentType.id.toString()}>
                        {documentType.name}
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
            name="submission_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">ஒப்படைப்பு வகை</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="ஒப்படைப்பு வகை தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {submissionTypes.map((submissionType) => (
                      <SelectItem key={submissionType.id} value={submissionType.id.toString()}>
                        {submissionType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="typist_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">தட்டச்சாளர்</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="தட்டச்சாளர் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="not-selected">தேர்ந்தெடுக்கவில்லை</SelectItem>
                    {typists.map((typist) => (
                      <SelectItem key={typist.id} value={typist.id.toString()}>
                        {typist.name}
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
            name="office_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">அலுவலகம்</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="அலுவலகம் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="not-selected">தேர்ந்தெடுக்கவில்லை</SelectItem>
                    {offices.map((office) => (
                      <SelectItem key={office.id} value={office.id.toString()}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="registration_district_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">பதிவு மாவட்டம்</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="பதிவு மாவட்டம் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {registrationDistricts.map((district) => (
                      <SelectItem key={district.id} value={district.id.toString()}>
                        {district.name}
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
            name="sub_registrar_office_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">சார்பதிவாளர் அலுவலகம்</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={filteredSubRegistrarOffices.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="சார்பதிவாளர் அலுவலகம் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredSubRegistrarOffices.map((office) => (
                      <SelectItem key={office.id} value={office.id.toString()}>
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

        <FormField
          control={form.control}
          name="property_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cyan-800 font-medium">சொத்து விவரம்</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                    <SelectValue placeholder="சொத்து விவரம் தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.property_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="seller_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">விற்பனையாளர்</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="விற்பனையாளர் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
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
            name="buyer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">வாங்குபவர்</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="வாங்குபவர் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="sale_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">விற்பனை தொகை</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="விற்பனை தொகை உள்ளிடவும்"
                    {...field}
                    className="border-cyan-200 focus-visible:ring-cyan-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_method_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">பணம் செலுத்தும் முறை</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="பணம் செலுத்தும் முறை தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="land_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-cyan-800 font-medium">நில வகை</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-cyan-200 focus-visible:ring-cyan-400">
                      <SelectValue placeholder="நில வகை தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="not-selected">தேர்ந்தெடுக்கவில்லை</SelectItem>
                    {landTypes.map((landType) => (
                      <SelectItem key={landType.id} value={landType.id.toString()}>
                        {landType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label htmlFor="document-file" className="text-cyan-800 font-medium">
              ஆவண கோப்பு
            </Label>
            <Input
              id="document-file"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setDocumentFile(e.target.files[0])
                }
              }}
              className="mt-1 border-cyan-200 focus-visible:ring-cyan-400"
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cyan-800 font-medium">குறிப்புகள்</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="குறிப்புகள் உள்ளிடவும்"
                  {...field}
                  className="border-cyan-200 focus-visible:ring-cyan-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700">
            {isLoading ? "சேமிக்கிறது..." : "சேமி"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset()
              setDocumentFile(null)
            }}
            disabled={isLoading}
            className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
          >
            ரத்து ��ெய்
          </Button>
        </div>
      </form>
    </Form>
  )
}
