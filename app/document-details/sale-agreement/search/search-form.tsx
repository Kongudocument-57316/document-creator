"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const searchFormSchema = z.object({
  documentName: z.string().optional(),
  documentNumber: z.string().optional(),
  documentYear: z.string().optional(),
  fromDate: z.date().optional().nullable(),
  toDate: z.date().optional().nullable(),
  subRegistrarOfficeId: z.string().optional(),
  buyerName: z.string().optional(),
  sellerName: z.string().optional(),
})

type SearchFormValues = z.infer<typeof searchFormSchema>

interface SubRegistrarOffice {
  id: number
  name: string
  registration_district_id: number
}

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFilters, setHasFilters] = useState(false)

  // Parse search params with safer defaults
  const getInitialValues = () => {
    const values: SearchFormValues = {
      documentName: searchParams.get("documentName") || "",
      documentNumber: searchParams.get("documentNumber") || "",
      documentYear: searchParams.get("documentYear") || "",
      fromDate: null,
      toDate: null,
      subRegistrarOfficeId: searchParams.get("subRegistrarOfficeId") || "",
      buyerName: searchParams.get("buyerName") || "",
      sellerName: searchParams.get("sellerName") || "",
    }

    // Safely parse dates
    try {
      const fromDateParam = searchParams.get("fromDate")
      if (fromDateParam) {
        values.fromDate = new Date(fromDateParam)
        // Check if date is valid
        if (isNaN(values.fromDate.getTime())) {
          values.fromDate = null
        }
      }
    } catch (e) {
      console.error("Error parsing fromDate:", e)
      values.fromDate = null
    }

    try {
      const toDateParam = searchParams.get("toDate")
      if (toDateParam) {
        values.toDate = new Date(toDateParam)
        // Check if date is valid
        if (isNaN(values.toDate.getTime())) {
          values.toDate = null
        }
      }
    } catch (e) {
      console.error("Error parsing toDate:", e)
      values.toDate = null
    }

    return values
  }

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: getInitialValues(),
  })

  // Check if there are any active filters
  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasActiveFilters = Object.entries(value).some(([_, val]) => {
        if (val === undefined || val === null) return false
        if (typeof val === "string") return val.trim() !== ""
        return true
      })
      setHasFilters(hasActiveFilters)
    })

    return () => subscription.unsubscribe()
  }, [form.watch])

  useEffect(() => {
    async function fetchSubRegistrarOffices() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/sub-registrar-offices")

        if (!response.ok) {
          throw new Error(`Failed to fetch sub-registrar offices: ${response.statusText}`)
        }

        const data = await response.json()
        setSubRegistrarOffices(data)
      } catch (err) {
        console.error("Error fetching sub-registrar offices:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch sub-registrar offices")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubRegistrarOffices()
  }, [])

  function onSubmit(data: SearchFormValues) {
    try {
      const params = new URLSearchParams()

      if (data.documentName) params.set("documentName", data.documentName)
      if (data.documentNumber) params.set("documentNumber", data.documentNumber)
      if (data.documentYear) params.set("documentYear", data.documentYear)
      if (data.fromDate) params.set("fromDate", format(data.fromDate, "yyyy-MM-dd"))
      if (data.toDate) params.set("toDate", format(data.toDate, "yyyy-MM-dd"))
      if (data.subRegistrarOfficeId) params.set("subRegistrarOfficeId", data.subRegistrarOfficeId)
      if (data.buyerName) params.set("buyerName", data.buyerName)
      if (data.sellerName) params.set("sellerName", data.sellerName)

      router.push(`/document-details/sale-agreement/search?${params.toString()}`)
    } catch (err) {
      console.error("Error in form submission:", err)
      setError(err instanceof Error ? err.message : "An error occurred during form submission")
    }
  }

  function resetForm() {
    form.reset({
      documentName: "",
      documentNumber: "",
      documentYear: "",
      fromDate: null,
      toDate: null,
      subRegistrarOfficeId: "",
      buyerName: "",
      sellerName: "",
    })
    router.push("/document-details/sale-agreement/search")
  }

  return (
    <Card className="bg-white border-blue-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>கிரைய உடன்படிக்கை ஆவணங்கள் தேடுதல்</CardTitle>
        {hasFilters && (
          <Button variant="outline" size="sm" onClick={resetForm} className="h-8 gap-1">
            <X className="h-4 w-4" />
            வடிகட்டிகளை அழி
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="documentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ஆவண பெயர்</FormLabel>
                    <FormControl>
                      <Input placeholder="ஆவண பெயரை உள்ளிடவும்" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ஆவண எண்</FormLabel>
                    <FormControl>
                      <Input placeholder="ஆவண எண்ணை உள்ளிடவும்" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ஆண்டு</FormLabel>
                    <FormControl>
                      <Input placeholder="ஆண்டை உள்ளிடவும்" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>தொடக்க தேதி</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "yyyy-MM-dd") : <span>தேதியைத் தேர்ந்தெடுக்கவும்</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
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

              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>முடிவு தேதி</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "yyyy-MM-dd") : <span>தேதியைத் தேர்ந்தெடுக்கவும்</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
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

              <FormField
                control={form.control}
                name="subRegistrarOfficeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>சார்பதிவாளர் அலுவலகம்</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">அனைத்தும்</SelectItem>
                        {isLoading ? (
                          <SelectItem value="loading">ஏற்றுகிறது...</SelectItem>
                        ) : error ? (
                          <SelectItem value="error">பிழை: {error}</SelectItem>
                        ) : (
                          subRegistrarOffices.map((office) => (
                            <SelectItem key={office.id} value={office.id.toString()}>
                              {office.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buyerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>வாங்குபவர் பெயர்</FormLabel>
                    <FormControl>
                      <Input placeholder="வாங்குபவர் பெயரை உள்ளிடவும்" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sellerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>விற்பவர் பெயர்</FormLabel>
                    <FormControl>
                      <Input placeholder="விற்பவர் பெயரை உள்ளிடவும்" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="flex justify-between px-0 pt-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                அழி
              </Button>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                தேடு
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
