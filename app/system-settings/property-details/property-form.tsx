"use client"

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

const formSchema = z.object({
  property_name: z.string().min(1, { message: "மனையின் பெயர் தேவை" }),
  registration_district_id: z.string().optional(),
  sub_registrar_office_id: z.string().optional(),
  district_id: z.string().optional(),
  taluk_id: z.string().optional(),
  village_id: z.string().optional(),
  survey_number: z.string().optional(),
  guide_value_sqm: z.string().optional(),
  guide_value_sqft: z.string().optional(),
  property_details: z.string().optional(),
})

export function PropertyForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [registrationDistricts, setRegistrationDistricts] = useState<any[]>([])
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [taluks, setTaluks] = useState<any[]>([])
  const [villages, setVillages] = useState<any[]>([])
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      property_name: "",
      registration_district_id: "",
      sub_registrar_office_id: "",
      district_id: "",
      taluk_id: "",
      village_id: "",
      survey_number: "",
      guide_value_sqm: "",
      guide_value_sqft: "",
      property_details: "",
    },
  })

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(`
        *,
        registration_districts:registration_district_id (name),
        sub_registrar_offices:sub_registrar_office_id (name),
        districts:district_id (name),
        taluks:taluk_id (name),
        villages:village_id (name)
      `)
        .order("property_name")

      if (error) {
        toast.error("சொத்து விவரங்களை பெறுவதில் பிழை: " + error.message)
        return
      }

      setProperties(data || [])
    } catch (error: any) {
      toast.error("சொத்து விவரங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    async function fetchRegistrationDistricts() {
      const { data, error } = await supabase.from("registration_districts").select("*")
      if (!error && data) {
        setRegistrationDistricts(data)
      }
    }

    async function fetchDistricts() {
      const { data, error } = await supabase.from("districts").select("*")
      if (!error && data) {
        setDistricts(data)
      }
    }

    fetchRegistrationDistricts()
    fetchDistricts()
    fetchProperties()
  }, [supabase])

  useEffect(() => {
    const registrationDistrictId = form.watch("registration_district_id")
    if (registrationDistrictId) {
      async function fetchSubRegistrarOffices() {
        const { data, error } = await supabase
          .from("sub_registrar_offices")
          .select("*")
          .eq("registration_district_id", registrationDistrictId)

        if (!error && data) {
          setSubRegistrarOffices(data)
        }
      }

      fetchSubRegistrarOffices()
    } else {
      setSubRegistrarOffices([])
    }
  }, [form.watch("registration_district_id"), supabase])

  useEffect(() => {
    const districtId = form.watch("district_id")
    if (districtId) {
      async function fetchTaluks() {
        const { data, error } = await supabase.from("taluks").select("*").eq("district_id", districtId)

        if (!error && data) {
          setTaluks(data)
        }
      }

      fetchTaluks()
    } else {
      setTaluks([])
    }
  }, [form.watch("district_id"), supabase])

  useEffect(() => {
    const talukId = form.watch("taluk_id")
    if (talukId) {
      async function fetchVillages() {
        const { data, error } = await supabase.from("villages").select("*").eq("taluk_id", talukId)

        if (!error && data) {
          setVillages(data)
        }
      }

      fetchVillages()
    } else {
      setVillages([])
    }
  }, [form.watch("taluk_id"), supabase])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Convert string values to numbers for numeric fields
      const numericValues = {
        ...values,
        registration_district_id: values.registration_district_id
          ? Number.parseInt(values.registration_district_id)
          : null,
        sub_registrar_office_id: values.sub_registrar_office_id
          ? Number.parseInt(values.sub_registrar_office_id)
          : null,
        district_id: values.district_id ? Number.parseInt(values.district_id) : null,
        taluk_id: values.taluk_id ? Number.parseInt(values.taluk_id) : null,
        village_id: values.village_id ? Number.parseInt(values.village_id) : null,
        guide_value_sqm: values.guide_value_sqm ? Number.parseFloat(values.guide_value_sqm) : null,
        guide_value_sqft: values.guide_value_sqft ? Number.parseFloat(values.guide_value_sqft) : null,
      }

      const { error, data } = await supabase.from("properties").insert([numericValues]).select()

      if (error) {
        throw error
      }

      // Add the new property to the properties array
      if (data && data.length > 0) {
        setProperties((prevProperties) => [...prevProperties, data[0]])
      }

      toast({
        title: "சொத்து சேர்க்கப்பட்டது",
        description: "சொத்து விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன",
      })

      form.reset()

      // Refresh the properties list
      fetchProperties()

      // Navigate to the search tab to show the newly added property
      router.push("/system-settings/property-details?tab=search")
    } catch (error: any) {
      toast({
        title: "பிழை ஏற்பட்டது",
        description: error.message || "சொத்து விவரங்களை சேமிக்க முடியவில்லை",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="property_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-700">மனையின் பெயர்</FormLabel>
              <FormControl>
                <Input
                  placeholder="மனையின் பெயர் உள்ளிடவும��"
                  {...field}
                  className="border-purple-200 focus-visible:ring-purple-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="registration_district_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-700">பதிவு மாவட்டம்</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-purple-200 focus-visible:ring-purple-400">
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
                <FormLabel className="text-purple-700">சார்பதிவாளர் அலுவலகம்</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!form.watch("registration_district_id")}
                >
                  <FormControl>
                    <SelectTrigger className="border-purple-200 focus-visible:ring-purple-400">
                      <SelectValue placeholder="சார்பதிவாளர் அலுவலகம் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subRegistrarOffices.map((office) => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="district_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-700">மாவட்டம்</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-purple-200 focus-visible:ring-purple-400">
                      <SelectValue placeholder="மாவட்டம் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {districts.map((district) => (
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
            name="taluk_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-700">வட்டம்</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch("district_id")}>
                  <FormControl>
                    <SelectTrigger className="border-purple-200 focus-visible:ring-purple-400">
                      <SelectValue placeholder="வட்டம் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taluks.map((taluk) => (
                      <SelectItem key={taluk.id} value={taluk.id.toString()}>
                        {taluk.name}
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
            name="village_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-700">கிராமம்</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch("taluk_id")}>
                  <FormControl>
                    <SelectTrigger className="border-purple-200 focus-visible:ring-purple-400">
                      <SelectValue placeholder="கிராமம் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {villages.map((village) => (
                      <SelectItem key={village.id} value={village.id.toString()}>
                        {village.name}
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
          name="survey_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-700">சர்வே எண்</FormLabel>
              <FormControl>
                <Input
                  placeholder="சர்வே எண் உள்ளிடவும்"
                  {...field}
                  className="border-purple-200 focus-visible:ring-purple-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="guide_value_sqm"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-700">வழிகாட்டு மதிப்பு (சதுர மீட்டர்)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="வழிகாட்டு மதிப்பு உள்ளிடவும்"
                    {...field}
                    className="border-purple-200 focus-visible:ring-purple-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guide_value_sqft"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-700">வழிகாட்டு மதிப்பு (சதுர அடி)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="வழிகாட்டு மதிப்பு உள்ளிடவும்"
                    {...field}
                    className="border-purple-200 focus-visible:ring-purple-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="property_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-700">சொத்து விவரங்கள்</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="சொத்து விவரங்��ளை உள்���ிடவும்"
                  {...field}
                  className="border-purple-200 focus-visible:ring-purple-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
          {isLoading ? "சேமிக்கிறது..." : "சேர்க்க"}
        </Button>
      </form>
    </Form>
  )
}
