"use client"

import { useEffect, useState, useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, FileDown, Printer } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"

interface DocumentEditorProps {
  initialContent?: string
  documentId?: string
  templateId?: string
  formData: any
  onSave: (content: string) => Promise<void>
}

export function DocumentEditor({ initialContent = "", documentId, templateId, formData, onSave }: DocumentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [template, setTemplate] = useState<string>("")
  const editorRef = useRef<any>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function loadTemplate() {
      try {
        setIsLoading(true)

        // If we have a document ID, load the existing document
        if (documentId) {
          const { data, error } = await supabase
            .from("sale_deed_documents")
            .select("content")
            .eq("id", documentId)
            .single()

          if (error) throw error
          if (data?.content) {
            setContent(data.content)
            return
          }
        }

        // Otherwise load a template
        const templateIdToUse = templateId || "default"
        const { data, error } = await supabase
          .from("document_templates")
          .select("content")
          .eq("id", templateIdToUse)
          .single()

        if (error) {
          // If template not found, use default template
          setTemplate(getDefaultTemplate())
        } else if (data?.content) {
          setTemplate(data.content)
        } else {
          setTemplate(getDefaultTemplate())
        }
      } catch (error) {
        console.error("Error loading template:", error)
        toast.error("டெம்ப்ளேட் ஏற்றுவதில் பிழை")
        setTemplate(getDefaultTemplate())
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplate()
  }, [documentId, templateId, supabase])

  useEffect(() => {
    if (template && !initialContent) {
      // Replace placeholders with actual data
      const processedTemplate = replacePlaceholders(template, formData)
      setContent(processedTemplate)
    }
  }, [template, formData, initialContent])

  const replacePlaceholders = (template: string, data: any) => {
    // Basic placeholder replacement
    let result = template

    // Replace buyer details
    if (Array.isArray(data.buyer) && data.buyer.length > 0) {
      // Handle multiple buyers
      const isSingleBuyer = data.buyer.length === 1

      // Replace BUYER_PARTY_NAME with all buyer names
      const buyerNames = data.buyer.map((buyer: any, index: number) => `${index + 1}. ${buyer.name}`).join(", ")

      result = result.replace(/BUYER PARTY NAME/g, buyerNames)

      // Replace other buyer details with the first buyer's details
      if (data.buyer[0]) {
        const buyer = data.buyer[0]
        result = result.replace(/BUYER BANK NAME/g, buyer.bank_name || "")
        result = result.replace(/BUYER BANK BRANCH/g, buyer.bank_branch || "")
        result = result.replace(/BUYER ACCOUNT TYPE/g, buyer.account_type || "")
        result = result.replace(/BUYER ACCOUNT NO/g, buyer.account_number || "")
      }

      // Update singular/plural terms
      if (!isSingleBuyer) {
        result = result.replace(/வாங்குபவர்/g, "வாங்குபவர்கள்")
        // Add other plural transformations as needed
      }
    }

    // Replace seller details
    if (Array.isArray(data.seller) && data.seller.length > 0) {
      // Handle multiple sellers
      const isSingleSeller = data.seller.length === 1

      // Replace SELLER_PARTY_NAME with all seller names
      const sellerNames = data.seller.map((seller: any, index: number) => `${index + 1}. ${seller.name}`).join(", ")

      result = result.replace(/SELLER PARTY NAME/g, sellerNames)

      // Replace other seller details with the first seller's details
      if (data.seller[0]) {
        const seller = data.seller[0]
        result = result.replace(/SELLER BANK NAME/g, seller.bank_name || "")
        result = result.replace(/SELLER BANK BRANCH/g, seller.bank_branch || "")
        result = result.replace(/SELLER ACCOUNT TYPE/g, seller.account_type || "")
        result = result.replace(/SELLER ACCOUNT NO/g, seller.account_number || "")
      }

      // Update singular/plural terms
      if (!isSingleSeller) {
        result = result.replace(/எழுதிக்கொடுப்பவர்/g, "எழுதிக்கொடுப்பவர்கள்")
        // Add other plural transformations as needed
      }
    }

    // Replace payment details
    if (data.payment) {
      result = result.replace(/AMOUNT/g, data.payment.totalAmount || "")
      result = result.replace(/AMOUNT IN WORDS/g, data.payment.amountInWords || "")

      // Replace transaction details
      if (data.payment.paymentMethod === "cheque") {
        result = result.replace(/CHEQUE NO/g, data.payment.chequeNumber || "")
      } else if (data.payment.paymentMethod === "dd") {
        result = result.replace(/DD NO/g, data.payment.ddNumber || "")
      } else if (data.payment.paymentMethod === "rtgs") {
        result = result.replace(/RTGS TRANSACTION NO/g, data.payment.rtgsNumber || "")
      } else if (data.payment.paymentMethod === "neft") {
        result = result.replace(/NEFT TRANSACTION NO/g, data.payment.neftNumber || "")
      } else if (data.payment.paymentMethod === "imps") {
        result = result.replace(/IMPS TRANSACTION NO/g, data.payment.impsNumber || "")
      }

      // Replace transaction date
      if (data.payment.paymentDate) {
        result = result.replace(/TRANSACTION DATE/g, data.payment.paymentDate || "")
      }
    }

    // Replace property details
    if (data.property) {
      result = result.replace(/DISTRICT/g, data.property.district || "")
      result = result.replace(/PINCODE/g, data.property.pincode || "")
      result = result.replace(/TALUK/g, data.property.taluk || "")
      result = result.replace(/ADDRESS LINE/g, data.property.addressLine || "")
      result = result.replace(/DOOR NO/g, data.property.doorNo || "")

      // Replace property measurements
      result = result.replace(/SQ FEET/g, data.property.areaInSqFt || "")
      result = result.replace(/SQ METER/g, data.property.areaInSqMt || "")
      result = result.replace(/GUIDELINE VALUE/g, data.property.guidelineValue || "")

      // Replace property boundaries
      result = result.replace(/NORTH BOUNDARY/g, data.property.northBoundary || "")
      result = result.replace(/SOUTH BOUNDARY/g, data.property.southBoundary || "")
      result = result.replace(/EAST BOUNDARY/g, data.property.eastBoundary || "")
      result = result.replace(/WEST BOUNDARY/g, data.property.westBoundary || "")
    }

    // Replace deed details
    if (data.deed) {
      result = result.replace(/YEAR/g, data.deed.year || "")
      result = result.replace(/MONTH/g, data.deed.month || "")
      result = result.replace(/DATE/g, data.deed.day || "")

      // Replace document details
      if (data.previousDoc) {
        if (data.previousDoc.commonDocuments && data.previousDoc.commonDocuments.length > 0) {
          const doc = data.previousDoc.commonDocuments[0]
          result = result.replace(/PR DOCUMENT DATE/g, doc.documentDate || "")
          result = result.replace(/PR DOCUMENT YEAR/g, doc.documentYear || "")
          result = result.replace(/PR DOCUMENT NO/g, doc.documentNumber || "")
          result = result.replace(/PR DOCUMENT TYPE/g, doc.documentType || "")
          result = result.replace(/PR BOOK NO/g, doc.bookNumber || "")
        }
      }
    }

    // Replace witness details
    if (Array.isArray(data.witness) && data.witness.length > 0) {
      // Handle multiple witnesses
      const isSingleWitness = data.witness.length === 1

      // Replace WITNESS_NAME with all witness names
      const witnessNames = data.witness.map((witness: any, index: number) => `${index + 1}. ${witness.name}`).join(", ")

      result = result.replace(/WITNESS NAME/g, witnessNames)

      // Update singular/plural terms
      if (!isSingleWitness) {
        result = result.replace(/சாட்சி/g, "சாட்சிகள்")
        // Add other plural transformations as needed
      }
    }

    return result
  }

  const getDefaultTemplate = () => {
    return `
    <h1 style="text-align: center;">கிரைய ஆவணம்</h1>
    <p>கிரையம் ரூ.AMOUNT/-</p>
    <p>YEAR-ம் வருடம் MONTH மாதம் DATE-ம் தேதியில்</p>
    <p>DISTRICT மாவட்டம்-PINCODE, TALUK வட்டம், ADDRESS LINE 123, இதில் எண்.DOOR NO என்ற முகவரியில் வசித்து வருபவரும், RELATIONS NAME அவர்களின் RELATIONSHIP TYPE PARTY AGE வயதுடைய PARTY NAME (ஆதார் அடையாள அட்டை எண்.AADHAR NO, அலைபேசி எண்.PHONE NO) ஆகிய தங்களுக்கு</p>
    <p>DISTRICT மாவட்டம்-PINCODE, TALUK வட்டம், ADDRESS LINE 123, இதில் எண்.DOOR NO என்ற முகவரியில் வசித்து வருபவரும், RELATIONS NAME அவர்களின் RELATIONSHIP TYPE PARTY AGE வயதுடைய PARTY NAME (ஆதார் அடையாள அட்டை எண்.AADHAR NO, அலைபேசி எண்.PHONE NO) ஆகிய நான் எழுதிக் கொடுத்த சத்தகிரைய சாசனபத்திரத்திற்கு விவரம் என்னவென்றால்.</p>
    <p>எனக்கு உரித்த PR DOCUMENT DATE/MONTH/YEAR-ம் தேதியில், SUBREGISTER OFFICE சார்பதிவாளர் அலுவலகத்தில் PR BOOK NO புத்தகம் PR DOCUMENT YEAR-ம் ஆண்டின் PR DOCUMENT NO -ம் என்னாக பதிவு செய்யப்பட்ட PR DOCUMENT TYPE ஆவணத்தின் படி பாத்தியப்பட்டதாகும்</p>
    <p>மேற்படி எனக்கில் பாத்தியப்பட்டு என்னுடைய அனுபோக சொந்தத்தில் இருந்து வருகிற இதனாலிற்கண்டவாறு சொத்தை நான் தங்களுக்கு ரூ.AMOUNT/-ரூபாய் AMOUNT IN WORDS மட்டும் விலைக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு மேற்படி கிரையத் தொகையை கீழ்கண்ட சாட்சிகள் முன்பாக நான் தங்களிடமிருந்து பெற்றுக்கொண்டு கீழ்கண்ட சொத்துக்கள் இன்று தங்களுக்கு சத்தகிரையமும் கைவசமும் செய்து கொடுத்திருக்கின்றேன்</p>
    <p>மேற்படி எனக்கில் பாத்தியப்பட்டு என்னுடைய அனுபோக சொந்தத்தில் இருந்து வருகிற இதனாலிற்கண்டவாறு சொத்தை நான் தங்களுக்கு ரூ.AMOUNT/-ரூபாய் AMOUNT IN WORDS மட்டும் விலைக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு மேற்படி கிரையத் தொகை எனக்கு வாங்கியதற்கான விவரம்:-</p>
    <p>கிரையம் பெறும் BUYER PARTY NAME அவர்களின் BUYER BANK NAME, BUYER BANK BRANCH, BUYER ACCOUNT TYPE ACCOUNT NO.-க்கு எனக்கு காட்சினால் எண்.CHEQUE NO-மூலம், கிரையம் எழுதி கொடுக்கும் SELLER PARTY NAME அவர்களின் பெயரில் வழங்கிய தொகை ரூ.AMOUNT/-ரூபாய் AMOUNT IN WORDS மட்டும் TRANSACTION DATE/MONTH/YEAR-ம் தேதியில் காசாகி விட்டபடியால், கீழ்கண்ட சொத்துக்கள் இன்று தங்களுக்கு சத்தக் கிரையமும் கைவசமும் செய்து கொடுத்திருக்கின்றேன்.</p>
    <p>கிரையம் பெறும் BUYER PARTY NAME அவர்களின் BUYER BANK NAME, BUYER BANK BRANCH, BUYER ACCOUNT TYPE ACCOUNT NO.-க்கு எனக்கு காட்சினால் எண்.DD NO-மூலம், கிரையம் எழுதி கொடுக்கும் SELLER PARTY NAME அவர்களின் பெயரில் வழங்கிய தொகை ரூ.AMOUNT/-ரூபாய் AMOUNT IN WORDS மட்டும் TRANSACTION DATE/MONTH/YEAR-ம் தேதியில் காசாகி விட்டபடியால், கீழ்கண்ட சொத்துக்கள் இன்று தங்களுக்கு சத்தக் கிரையமும் கைவசமும் செய்து கொடுத்திருக்கின்றேன்.</p>
    <p>கிரையம் பெறும் BUYER PARTY NAME அவர்களின் BUYER BANK NAME, BUYER BANK BRANCH, BUYER ACCOUNT TYPE ACCOUNT NO.-க்கிருந்து, எனது SELLER BANK NAME, SELLER BANK BRANCH, SELLER ACCOUNT TYPE ACCOUNT NO.-க்கு வங்கி மின்னணு பரிமாற்றத்தின் எண்.RTGS TRANSACTION NO-மூலம் ரூ.AMOUNT/-ரூபாய் AMOUNT IN WORDS மட்டும் TRANSACTION DATE/MONTH/YEAR-ம் தேதியில் எனக்கு வரவாகி விட்டபடியால், கீழ்கண்ட சொத்துக்கள் இன்று தங்களுக்கு சத்தக் கிரையமும் கைவசமும் செய்து கொடுத்திருக்கின்றேன்.</p>
    <p>கிரையம் பெறும் BUYER PARTY NAME அவர்களின் BUYER BANK NAME, BUYER BANK BRANCH, BUYER ACCOUNT TYPE ACCOUNT NO.-க்கிருந்து, எனது SELLER BANK NAME, SELLER BANK BRANCH, SELLER ACCOUNT TYPE ACCOUNT NO.-க்கு வங்கி மின்னணு பரிமாற்றத்தின் எண்.NEFT TRANSACTION NO-மூலம் ரூ.AMOUNT/-ரூபாய் AMOUNT IN WORDS மட்டும் TRANSACTION DATE/MONTH/YEAR-ம் தேதியில் எனக்கு வரவாகி விட்டபடியால், கீழ்கண்ட சொத்துக்கள் இன்று தங்களுக்கு சத்தக் கிரையமும் கைவசமும் செய்து கொடுத்திருக்கின்றேன்.</p>
    <p>கிரையம் பெறும் BUYER PARTY NAME அவர்களின் BUYER BANK NAME, BUYER BANK BRANCH, BUYER ACCOUNT TYPE ACCOUNT NO.-க்கிருந்து, எனது SELLER BANK NAME, SELLER BANK BRANCH, SELLER ACCOUNT TYPE ACCOUNT NO.-க்கு வங்கி மின்னணு பரிமாற்றத்தின் எண்.IMPS TRANSACTION NO-மூலம் ரூ.AMOUNT/-ரூபாய் AMOUNT IN WORDS மட்டும் TRANSACTION DATE/MONTH/YEAR-ம் தேதியில் எனக்கு வரவாகி விட்டபடியால், கீழ்கண்ட சொத்துக்கள் இன்று தங்களுக்கு சத்தக் கிரையமும் கைவசமும் செய்து கொடுத்திருக்கின்றேன்.</p>
    <p>கிரைய சொத்தை இது முதல் தாங்கள் சர்வ சுதந்திர பாத்தியத்துடனும் தானாதி விலிங்கான விற்கினையாளுக்குரிய போக்கியமாகவும் தாங்கள் அனுபவித்துக்கொள்ள வேண்டியதாகவும்</p>
    <p>கிரையச் சொத்தை குறித்து இனியில் எனக்கும், எனக்கு பின்வட்ட எனது இதர ஆண், பெண் வாரிசுகளுக்கும் இனி எவ்வித பாத்தியமும் சம்பந்தமும் பின் தொடர்ந்தும் உரிமையும் இல்லை</p>
    <p>கிரைய சொத்துக்களின் மேயில் யாருக்கும் முன் விலைக்கு விலையம் கடன், போட்ட நடவடிக்கைகள் முதலியன ஏதுமில்லையென்றும் உண்மையாகவும் உறுதியாகவும் கொள்கின்றேன்</p>
    <p>பின்வரும் அட்டவடி குருகால் ஏற்படும் முன் விலைக்கு விலையம் அடமானம், கிரைய உடன்படிக்கை, கோர்ட் நடவடிக்கைகள், நோட்டீசும், ரஜிஸ்டர் மார்க்கேஜ் முகவியன ஏதுமிருப்பதாக தெரியவரும் பட்சத்தில் அவற்றை நானே முன்னின்று எனது சொந்த செலவிலும், சொந்த பொறுப்பிலும் எனது இதர சொத்துக்களைக் கொண்டு நானே முன்னின்று தீர்த்துக் கொள்கே இதன் மூலம் உறுதி கூறுகிறேன்</p>
    <p>கிரைய பத்திரத்தில் எழுதிக்கொடுப்பவருக்கு முழு உரிமையும் கைவசமும் உள்ளது என எழுதியிருப்பதற்கு, எழுதிக்கொடுப்பவருக்கு, எழுதிக்கொடுப்பவர் அளித்த பதிவுருக்களை எழுதியாளுவான் ஆய்வு செய்து, அதன் மேரில் இந்த கிரைய ஆவணம் தயார் செய்யப்பட்டு எழுதியாளுவான் எழுதிக்கொடுப்பவர் என இரு சாப்பிடாக் முத்திரையில் கேட்டு என கிரைய அடைந்தவர் பெற்றுக் கொள்ள அவர் அடைந்தவன் பெற்றும் கிரைய ஆவணம் பதிவு செய்யப்படுகிறது.</p>
    <p>பிற்காலத்தில் கிரைய ஆவணத்தில் ஏதேனும் பிழைகள் ஏற்பட்டாக வாங்குபவர் கூறினால், சம்பந்தப்பட்ட சாப்பிடானார் அலுவலகம் வந்து பிழை திருத்தம் ஆவணத்தில் ஏற்படாமல் பிற்பி பிரச்சனைகளும் பெற்றுக் கொள்ளாமல் பிழையைத் திருத்திக் கொள்ள நான் கடமைப்பட்டவர் ஆவேன்.</p>
    <p>மேற்படி நான் பிழையதிருத்தல் பதிவில் எழுதிக்கொள்க தவறினால், மேற்படி கிரையம் பெறும் தாங்கள் எழுதியாளுவர் ஆவணம் எழுதி, அதன் மூலம் பிழையைத் திருத்திக் கொள்ள வேண்டியது</p>
    <p>கீழ்கண்ட கிரைய சொத்தின் பட்டா தாக்கள் பெயருக்கு மாறும் பொருட்டு பட்டா மாறுதல் மனுவில் இதனுடன் தாக்கல் செய்கின்றேன்</p>
    <p>மேலே சொன்ன PR BOOK NO புத்தகம் PR DOCUMENT NO/PR DOCUMENT YEAR என PR DOCUMENT TYPE ஆவணத்தின் PR DOCUMENT ORIGINAL/ OR XEROX COPY இக்கிரைய ஆவணத்திற்கு ஆதாரமாக தங்களுக்கு கொடுத்திருக்கின்றேன்.</p>
    <p>மேலும் தனிக்கையின் போது இந்த ஆவணம் தொடர்பாக அரசுக்கு இழப்பு ஏற்படின் அத்தொகையை கிரையம் பெற்றவர் செலுத்தவும் உறுதியளிக்கிறார்</p>
    <p>பின்வரும் அட்டவடி குருகால் ஏற்படும் முன் விலைக்கு விலையம்</p>
    <p>மனை எண்:-site no-க்கு கொகுமுறியும், அளவு விவரமும்:-</p>
    <p>-----------வடக்கு</p>
    <p>-----------கிழக்கு</p>
    <p>-----------தெற்கு</p>
    <p>-----------மேற்கு</p>
    <p>இதன் மத்தியில் கடந்த கிழக்குமேற் SQ FEET அடி, தென்வடக்கு கிழக்குமேற் SQ FEET அடி, கிழக்கும் மேற்கிலும் SQ FEET அடி, தென்வடக்கிலும் SQ FEET அடி, ஆகியவை SQ FEET சதுரடி.ப்ர அளவுள்ள இடம் மற்றும் அதிலுள்ள பூராவும்</p>
    <p>மேற்படி இடத்தில் கட்டிட எல்லைகள் மேற்படி F#SF NO மற் காரையானது F#SF SUBDIVISION NO மற் காரணை என சப்டிவிஷன் பதிவு எஃப் F# SF new SUBDIVISION NO மற் காரணை என சப்டிவிஷன் உள்ளது</p>
    <p>மேற்படி மனையப்பிரிவில் விட்டப்பட்டுள்ள சகல விதமான காலணிகளிலும், சகல விதமான காணா வண்டி வாகனங்களுக்கும் பொதுவில் போக வர உள்ள மார்க்க உபாத்தியங்கள் சகிதம் பூராவும்</p>
    <p>SQ FEET சதுரடி (SQ METER சதுர மீட்டர் ரூ.GUIDELINE VALUE)</p>
    <p>இடத்தின் மதிப்பு ரூ. AMOUNT/-</p>
    <p>கட்டபத்தி மதிப்பு ரூ. AMOUNT/-</p>
    <p>ஆக மொத்த மதிப்பு ரூ. TOTAL/-</p>
    <p>எழுதிக்கொடுப்பவர் எழுதிவாங்குபவர்</p>
    <p>சாட்சிகள் ----------------------------------------------PARTY NAME, தந்தை/RELATIONS NAME, வயது எண்.DOOR NO, ADDRESS LINE 123, TALUK வட்டம், DISTRICT மாவட்டம்-PINCODE. (வயது-PARTY AGE) (ஆதார் அடையாள அட்டை எ  ADDRESS LINE 123, TALUK வட்டம், DISTRICT மாவட்டம்-PINCODE. (வயது-PARTY AGE) (ஆதார் அடையாள அட்டை எண்.AADHAR NO)

    <p>2. -------------------------------------------- PARTY NAME, தந்தை/RELATIONS NAME, வயது எண்.DOOR NO, ADDRESS LINE 123, TALUK வட்டம், DISTRICT மாவட்டம்-PINCODE. (வயது-PARTY AGE) (ஆதார் அடையாள அட்டை எண்.AADHAR NO)</p>
    <p>கண்ணியில் பட்சம் செய்து ஆவணம் தயார் செய்தவர்-NAME (தொலைபேசி எண்.PHONE NO)</p>
    `
  }

  const handleSaveContent = async () => {
    if (!editorRef.current) return

    try {
      setIsSaving(true)
      const currentContent = editorRef.current.getContent()
      await onSave(currentContent)
      toast.success("ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது")
    } catch (error) {
      console.error("Error saving document:", error)
      toast.error("ஆவணத்தை சேமிப்பதில் பிழை")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrintPreview = () => {
    if (!editorRef.current) return

    const content = editorRef.current.getContent()
    const printWindow = window.open("", "_blank")

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>கிரைய ஆவணம் அச்சிடுதல்</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 20mm;
            }
            @media print {
              body {
                margin: 0;
                padding: 15mm;
              }
            }
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const handleExportPDF = () => {
    if (!editorRef.current) return

    // Use html2pdf or similar library to export as PDF
    // This is a placeholder for the actual implementation
    toast.info("PDF ஏற்றுமதி செயல்பாடு செயல்படுத்தப்படுகிறது")
  }

  return (
    <Card className="border-purple-200 shadow-md">
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-purple-700">ஆவணம் ஏற்றப்படுகிறது...</span>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Editor
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={content}
                init={{
                  height: 600,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "pagebreak",
                  ],
                  toolbar:
                    "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help | pagebreak",
                  content_style: "body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; }",
                  language: "ta",
                  language_url: "/tinymce/langs/ta.js", // Path to Tamil language file if available
                  branding: false,
                  promotion: false,
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleSaveContent}
                disabled={isSaving}
                className="border-purple-300 hover:bg-purple-50 text-purple-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    சேமிக்கிறது...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    சேமி
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handlePrintPreview}
                className="border-purple-300 hover:bg-purple-50 text-purple-700"
              >
                <Printer className="h-4 w-4 mr-2" />
                அச்சிடு
              </Button>
              <Button
                variant="outline"
                onClick={handleExportPDF}
                className="border-purple-300 hover:bg-purple-50 text-purple-700"
              >
                <FileDown className="h-4 w-4 mr-2" />
                PDF ஏற்றுமதி
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
