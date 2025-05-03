import { Document, Packer, Paragraph, HeadingLevel, AlignmentType, TextRun } from "docx"
import FileSaver from "file-saver"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// Export to Word document
export async function exportMortgageLoanToWord(formData: any, filename = "அடமான_கடன்_ஆவணம்.docx") {
  try {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "ஈடுகாட்டிய அடமான கடன் பத்திரம்",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `${formData.documentYear || "_______"}-ம் வருடம் ${formData.documentMonth || "_______"} மாதம் ${
                formData.documentDate || "_______"
              }-ம் தேதியில்`,
              alignment: AlignmentType.LEFT,
              spacing: { before: 400, after: 400 },
            }),
            new Paragraph({
              text: `${formData.buyerDistrict || "_______"} மாவட்டம்-${formData.buyerPincode || "_______"}, ${
                formData.buyerTaluk || "_______"
              } வட்டம், ${formData.buyerAddressLine3 || "_______"}, ${formData.buyerAddressLine2 || "_______"}, ${
                formData.buyerAddressLine1 || "_______"
              }, கதவு எண்:- ${formData.buyerDoorNo || "_______"} என்ற முகவரியில் வசித்து வருபவரும், ${
                formData.buyerRelationsName || "_______"
              } அவர்களின் ${formData.buyerRelationType || "_______"} ${
                formData.buyerAge || "_______"
              } வயதுடைய ${formData.buyerName || "_______"} (ஆதார் அடையாள அட்டை எண்:- ${
                formData.buyerAadharNo || "_______"
              }, கைப்பேசி எண்:- ${formData.buyerPhoneNo || "_______"}) ஆகிய தங்களுக்கு`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `${formData.sellerDistrict || "_______"} மாவட்டம்-${formData.sellerPincode || "_______"}, ${
                formData.sellerTaluk || "_______"
              } வட்டம், ${formData.sellerAddressLine3 || "_______"}, ${formData.sellerAddressLine2 || "_______"}, ${
                formData.sellerAddressLine1 || "_______"
              }, கதவு எண்:-${formData.sellerDoorNo || "_______"} என்ற முகவரியில் வசித்து வருபவரும், ${
                formData.sellerRelationsName || "_______"
              } அவர்களின் ${formData.sellerRelationType || "_______"} ${
                formData.sellerAge || "_______"
              } வயதுடைய ${formData.sellerName || "_______"} (ஆதார் அடையாள அட்டை எண்:- ${
                formData.sellerAadharNo || "_______"
              }, கைப்பேசி எண்:- ${
                formData.sellerPhoneNo || "_______"
              }) ஆகிய நான் மனப்பூர்வமான சம்மதத்துடன் எழுதிக் கொடுக்கும் சுவாதீனமில்லாத அடமானக்கடன் பத்திரம்.`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `என்னவென்றால், இந்த அடமானக்கடன் பத்திரத்தில் சொத்து விவரத்தில் விவரமாக குறிக்கப்பட்ட சொத்தானது எனக்கு கடந்த ${
                formData.prDocumentDate || "_______"
              }/${formData.prDocumentMonth || "_______"}/${formData.prDocumentYear || "_______"}-ம் தேதியில், ${
                formData.subRegisterOffice || "_______"
              } சார்பதிவாளர் அலுவலகம் ${formData.prBookNo || "_______"} புத்தகம் ${
                formData.prDocumentYear || "_______"
              }-ம் ஆண்டின் ${formData.prDocumentNo || "_______"}-ம் எண்ணாக பதிவு செய்யப்பட்ட ${
                formData.prDocumentType || "_______"
              } ஆவணத்தின் படி எனக்கு தனித்து பாத்தியப்பட்ட சொத்தாகும்.`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `மேற்படி வகையில் எனக்கு பாத்தியப்பட்டு நான் சர்வ சுதந்திரமாக ஆண்டனுபவித்து வருகின்ற கீழ்க்கண்ட சொத்தை நான் உங்களிடம் அவசர நிமித்தமாகவும், குடும்பார்த்தமான செலவுகளுக்காவும், வியாபாரத்திற்கு வேண்டியும், நாளது தேதியில் தங்களுக்கு ஈடு காட்டி, மேற்படி அசல் ஆவணத்தை அடமானம் வைத்து, அடமானத் தொகையாக ரூ.${
                formData.loanAmount || "_______"
              }/-(ரூபாய் ${
                formData.loanAmountInWords || "_______"
              } மட்டும்) என் குடும்பார்த்தமான செலவுகளுக்காக கீழ்க்கண்ட சாட்சிகள் முன்னிலையில் தங்களிடமிருந்து நான் ரொக்கமாய் கடனாகப் பெற்றுக் கொண்டேன்.`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `மேற்படி தொகைக்கு ${formData.loanStartDate || "_______"}/${
                formData.loanStartMonth || "_______"
              }/${formData.loanStartYear || "_______"}-ம் தேதி முதல் காலக் கெடுவிற்கு இந்த ரூ.${
                formData.loanAmount || "_______"
              }/-(ரூபாய் ${formData.loanAmountInWords || "_______"} மட்டும்)-த்திற்கு பிரதி ஆங்கில மாதம் தோறும் ரூ. ${
                formData.monthlyInterestAmount || "_______"
              }/-க்கு ரூ.${
                formData.interestRate || "_______"
              } வட்டி வீதம் உண்டான வட்டித் தொகையை, நான் உங்களுக்கு தவறாமல் செலுத்தி வந்து, அசல் கடன் தொகையை ${
                formData.loanEndDate || "_______"
              }/${formData.loanEndMonth || "_______"}/${
                formData.loanEndYear || "_______"
              }-ம் தேதி முதல் வரும் காலக்கெடுவிற்குள் நான் உங்களுக்கு செலுத்தி விடுவதாக ஒப்புக்கொண்டுள்ளேன்.`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `அவ்வாறு வட்டிக்கெடுவில் வட்டியை செலுத்தத் தவறும் பட்சத்தில் ரூ.${formData.loanAmount || "_______"}/- க்கு ரூ.${
                formData.interestRate || "_______"
              } பைசா மட்டும் மேற்படி வட்டியில் கூடுதலாக சேர்த்து கட்டத் தவறிய மாதத்திற்கு மட்டும் உண்டான வட்டியை நான் உங்களுக்கு செலுத்தி விடுவதாக முழுமனதுடன் ஒப்புக்கொண்டுள்ளேன்.`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `அவ்வாறு வட்டிக்கெடுவில் வட்டியும், அசல் கெடுவில் அசல் தொகையும் நான் உங்களுக்கு செலுத்தத் தவறும் பட்சத்தில் சொத்துரிமை மாற்றுச்சட்ட பிரிவின் கீழ் பகிரங்க ஏலத்திலோ அல்லது பேரம் பேசி விலைக்கோ, அல்லது இதனடியிற்கண்ட சொத்தை வேறு நபருக்கு விலைக்கு பேசி விற்பனை செய்து அதன் மூலம் வரும் தொகையிலிருந்து உங்களுக்கு சேர வேண்டிய அசல் கடன் தொகையை பிடித்தம் செய்து கொண்டது போக எனக்கு சேர வேண்டிய தொகையை எனது வசம் ஒப்படைக்க வேண்டியது என நான் உங்களிடம் முழு மனதுடன் ஒப்புக்கொண்டுள்ளேன்.`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `கீழ்க்கண்ட சொத்து��்களின் பேரில் எந்தவிதமான வில்லங்க விவகாரமும் அடமான��ும் ஈக்விடபுள் மார்ட்கேஜ், கோர்ட் ஜப்தி ஆகியவை ஒன்றும் இல்லை எனவும் நான் எந்தவிதமான வில்லங்க விவகாரத்திற்கும் உட்படுத்தவில்லை எனவும் உண்மையாகவும் உறுதியாகவும் சொல்கிறேன்.`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `அப்படி தவறி ஏதாவது வில்லங்க விவகாரம் இருந்து பின்னிட்டு வெளிப்படும் பட்சத்தில் அதை நானே முன்னின்று எனது சொந்த பொறுப்பிலும் சொந்த செலவிலும் எனது இதர சொத்துகளைக் கொண்டு முன்னின்று தீர்த்துக் கொடுக்க கடமைப்பட்டவர் ஆவேன்.`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `இந்தப்படிக்கு நான் என் மனப்பூர்வமாய் தங்களுக்கு எழுதிக்கொடுத்த சுவாதீனமில்லாத அடமானக்கடன் பத்திரம். மேற்படி சொத்து சுவாதீனம் கொடுக்கப்படவில்லை.`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 800 },
            }),
            new Paragraph({
              text: "சொத்து விவரம்",
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              spacing: { before: 400, after: 400 },
            }),
            new Paragraph({
              text: formData.propertyDetails || "சொத்து விவரங்கள் இங்கே காண்பிக்கப்படும்.",
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 800 },
            }),
            new Paragraph({
              text: "சாட்சிகள் :-",
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: `1. (${formData.witness1Name || "_______"}) ${formData.witness1RelationType || "_______"}.${
                formData.witness1RelationsName || "_______"
              }, கதவு எண்:-${formData.witness1DoorNo || "_______"}, ${formData.witness1AddressLine1 || "_______"}, ${
                formData.witness1AddressLine2 || "_______"
              }, ${formData.witness1AddressLine3 || "_______"}, ${formData.witness1Taluk || "_______"} வட்டம், ${
                formData.witness1District || "_______"
              } மாவட்டம்-${formData.witness1Pincode || "_______"}, (வயது-${
                formData.witness1Age || "_______"
              }) (ஆதார் அடையாள அட்டை எண்:-${formData.witness1AadharNo || "_______"}).`,
              alignment: AlignmentType.LEFT,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `2. (${formData.witness2Name || "_______"}) ${formData.witness2RelationType || "_______"}.${
                formData.witness2RelationsName || "_______"
              }, கதவு எண்:-${formData.witness2DoorNo || "_______"}, ${formData.witness2AddressLine1 || "_______"}, ${
                formData.witness2AddressLine2 || "_______"
              }, ${formData.witness2AddressLine3 || "_______"}, ${formData.witness2Taluk || "_______"} வட்டம், ${
                formData.witness2District || "_______"
              } மாவட்டம்-${formData.witness2Pincode || "_______"}, (வயது-${
                formData.witness2Age || "_______"
              }) (ஆதார் அடையாள அட்டை எண்:-${formData.witness2AadharNo || "_______"}).`,
              alignment: AlignmentType.LEFT,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-${formData.typistName || "_______"}`,
              alignment: AlignmentType.RIGHT,
              spacing: { before: 400 },
            }),
            new Paragraph({
              text: `(${formData.typistOfficeName || "_______"}, போன்:-${formData.typistPhoneNo || "_______"})`,
              alignment: AlignmentType.RIGHT,
              spacing: { after: 800 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "வாங்குபவர் கையொப்பம்",
                  bold: true,
                }),
                new TextRun({
                  text: "\t\t\t\t\t\t\t\t\t\t",
                }),
                new TextRun({
                  text: "விற்பவர் கையொப்பம்",
                  bold: true,
                }),
              ],
              spacing: { before: 800, after: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "_________________",
                }),
                new TextRun({
                  text: "\t\t\t\t\t\t\t\t",
                }),
                new TextRun({
                  text: "_________________",
                }),
              ],
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: formData.buyerName || "_______",
                }),
                new TextRun({
                  text: "\t\t\t\t\t\t\t\t\t\t",
                }),
                new TextRun({
                  text: formData.sellerName || "_______",
                }),
              ],
              spacing: { before: 200 },
            }),
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })
    FileSaver.saveAs(blob, filename)

    return true
  } catch (error) {
    console.error("Error generating Word document:", error)
    return false
  }
}

// Export to PDF document
export async function exportMortgageLoanToPDF(formData: any, filename = "அடமான_கடன்_ஆவணம்.pdf") {
  try {
    // Wait for the PDF content to be rendered
    await new Promise((resolve) => setTimeout(resolve, 100))

    const element = document.getElementById("pdf-content")
    if (!element) {
      throw new Error("PDF content element not found")
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Calculate dimensions
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4")

    // Split into pages if content is too long
    let heightLeft = imgHeight
    let position = 0
    let pageNumber = 1

    // Add first page
    pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight, "", "FAST")
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight, "", "FAST")
      heightLeft -= pageHeight
      pageNumber++
    }

    // Save the PDF
    pdf.save(filename)
    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    return false
  }
}
