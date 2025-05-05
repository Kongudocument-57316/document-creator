"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Link,
  ImageIcon,
  Table,
  Undo,
  Redo,
  Strikethrough,
  Superscript,
  Subscript,
  Indent,
  Outdent,
  Palette,
  FileText,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"

interface RichTextEditorProps {
  content: string
  onContentChange: (content: string) => void
}

export function RichTextEditor({ content, onContentChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [imageUploadMethod, setImageUploadMethod] = useState<"file" | "url">("file")
  const [tableRows, setTableRows] = useState("3")
  const [tableCols, setTableCols] = useState("3")
  const [fontFamily, setFontFamily] = useState("")
  const [fontSize, setFontSize] = useState("")
  const [textColor, setTextColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const handleEditorChange = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value: string | boolean = false) => {
    document.execCommand(command, false, value ? value.toString() : "")
    handleEditorChange()
  }

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value)
    execCommand("fontName", value)
  }

  const handleFontSizeChange = (value: string) => {
    setFontSize(value)
    execCommand("fontSize", value)
  }

  const handleTextColorChange = (value: string) => {
    setTextColor(value)
    execCommand("foreColor", value)
  }

  const handleBgColorChange = (value: string) => {
    setBgColor(value)
    execCommand("hiliteColor", value)
  }

  const handleLinkInsert = () => {
    if (linkUrl) {
      if (window.getSelection()?.toString()) {
        execCommand("createLink", linkUrl)
      } else if (linkText) {
        // If no text is selected but link text is provided
        const linkElement = document.createElement("a")
        linkElement.href = linkUrl
        linkElement.textContent = linkText

        // Insert at cursor position
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          range.insertNode(linkElement)
        }

        handleEditorChange()
      }
      setIsLinkDialogOpen(false)
      setLinkUrl("")
      setLinkText("")
    }
  }

  const handleImageUpload = async () => {
    try {
      if (imageUploadMethod === "file" && imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `document-images/${fileName}`

        // Create the bucket if it doesn't exist
        const { data: buckets } = await supabase.storage.listBuckets()
        if (!buckets?.find((bucket) => bucket.name === "document-assets")) {
          await supabase.storage.createBucket("document-assets", {
            public: true,
          })
        }

        const { error: uploadError } = await supabase.storage.from("document-assets").upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from("document-assets").getPublicUrl(filePath)

        if (data) {
          insertImage(data.publicUrl)
        }
      } else if (imageUploadMethod === "url" && imageUrl) {
        insertImage(imageUrl)
      }

      setIsImageDialogOpen(false)
      setImageFile(null)
      setImageUrl("")
      setImageAlt("")
    } catch (error: any) {
      toast.error(`படம் பதிவேற்றத்தில் பிழை: ${error.message}`)
    }
  }

  const insertImage = (url: string) => {
    const imgElement = document.createElement("img")
    imgElement.src = url
    imgElement.alt = imageAlt || "Document image"
    imgElement.style.maxWidth = "100%"

    // Insert at cursor position
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(imgElement)
    }

    handleEditorChange()
  }

  const handleTableInsert = () => {
    const rows = Number.parseInt(tableRows)
    const cols = Number.parseInt(tableCols)

    if (rows > 0 && cols > 0) {
      let tableHTML = '<table style="border-collapse: collapse; width: 100%;">'

      // Create header row
      tableHTML += "<thead><tr>"
      for (let j = 0; j < cols; j++) {
        tableHTML +=
          '<th style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">Header ' + (j + 1) + "</th>"
      }
      tableHTML += "</tr></thead><tbody>"

      // Create data rows
      for (let i = 0; i < rows - 1; i++) {
        tableHTML += "<tr>"
        for (let j = 0; j < cols; j++) {
          tableHTML += '<td style="border: 1px solid #ccc; padding: 8px;">Cell ' + (i + 1) + "-" + (j + 1) + "</td>"
        }
        tableHTML += "</tr>"
      }

      tableHTML += "</tbody></table><p></p>"

      // Insert at cursor position
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()

        const tableElement = document.createElement("div")
        tableElement.innerHTML = tableHTML

        while (tableElement.firstChild) {
          range.insertNode(tableElement.lastChild!)
        }
      }

      handleEditorChange()
      setIsTableDialogOpen(false)
      setTableRows("3")
      setTableCols("3")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-purple-200">
        <CardContent className="p-2">
          <Tabs defaultValue="basic">
            <TabsList className="mb-2">
              <TabsTrigger value="basic">அடிப்படை</TabsTrigger>
              <TabsTrigger value="format">வடிவமைப்பு</TabsTrigger>
              <TabsTrigger value="insert">செருகு</TabsTrigger>
              <TabsTrigger value="style">பாணி</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("bold")}
                className="text-purple-700 hover:bg-purple-100"
                title="தடிமன்"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("italic")}
                className="text-purple-700 hover:bg-purple-100"
                title="சாய்வு"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("underline")}
                className="text-purple-700 hover:bg-purple-100"
                title="அடிக்கோடு"
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("strikeThrough")}
                className="text-purple-700 hover:bg-purple-100"
                title="குறுக்குக்கோடு"
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
              <span className="border-r border-purple-200 mx-1"></span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("justifyLeft")}
                className="text-purple-700 hover:bg-purple-100"
                title="இடது சீரமை"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("justifyCenter")}
                className="text-purple-700 hover:bg-purple-100"
                title="மைய சீரமை"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("justifyRight")}
                className="text-purple-700 hover:bg-purple-100"
                title="வலது சீரமை"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("justifyFull")}
                className="text-purple-700 hover:bg-purple-100"
                title="முழு சீரமை"
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
              <span className="border-r border-purple-200 mx-1"></span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("insertUnorderedList")}
                className="text-purple-700 hover:bg-purple-100"
                title="புள்ளி பட்டியல்"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("insertOrderedList")}
                className="text-purple-700 hover:bg-purple-100"
                title="எண் பட்டியல்"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <span className="border-r border-purple-200 mx-1"></span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("indent")}
                className="text-purple-700 hover:bg-purple-100"
                title="உள்தள்ளு"
              >
                <Indent className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("outdent")}
                className="text-purple-700 hover:bg-purple-100"
                title="வெளித்தள்ளு"
              >
                <Outdent className="h-4 w-4" />
              </Button>
              <span className="border-r border-purple-200 mx-1"></span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("undo")}
                className="text-purple-700 hover:bg-purple-100"
                title="செயல்தவிர்"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("redo")}
                className="text-purple-700 hover:bg-purple-100"
                title="மீண்டும் செய்"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TabsContent>

            <TabsContent value="format" className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("formatBlock", "h1")}
                className="text-purple-700 hover:bg-purple-100"
                title="தலைப்பு 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("formatBlock", "h2")}
                className="text-purple-700 hover:bg-purple-100"
                title="தலைப்பு 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("formatBlock", "h3")}
                className="text-purple-700 hover:bg-purple-100"
                title="தலைப்பு 3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("formatBlock", "p")}
                className="text-purple-700 hover:bg-purple-100"
                title="பத்தி"
              >
                <Type className="h-4 w-4" />
              </Button>
              <span className="border-r border-purple-200 mx-1"></span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("superscript")}
                className="text-purple-700 hover:bg-purple-100"
                title="மேல்குறி"
              >
                <Superscript className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("subscript")}
                className="text-purple-700 hover:bg-purple-100"
                title="கீழ்குறி"
              >
                <Subscript className="h-4 w-4" />
              </Button>
              <span className="border-r border-purple-200 mx-1"></span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsColorDialogOpen(true)}
                className="text-purple-700 hover:bg-purple-100"
                title="நிறங்கள்"
              >
                <Palette className="h-4 w-4" />
              </Button>
            </TabsContent>

            <TabsContent value="insert" className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsLinkDialogOpen(true)}
                className="text-purple-700 hover:bg-purple-100"
                title="இணைப்பு"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsImageDialogOpen(true)}
                className="text-purple-700 hover:bg-purple-100"
                title="படம்"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsTableDialogOpen(true)}
                className="text-purple-700 hover:bg-purple-100"
                title="அட்டவணை"
              >
                <Table className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand("insertHorizontalRule")}
                className="text-purple-700 hover:bg-purple-100"
                title="கிடைமட்ட கோடு"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </TabsContent>

            <TabsContent value="style" className="flex flex-wrap gap-1 items-center">
              <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                <SelectTrigger className="w-[150px] h-8 text-xs border-purple-200">
                  <SelectValue placeholder="எழுத்துரு" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Latha">Latha</SelectItem>
                  <SelectItem value="Nirmala UI">Nirmala UI</SelectItem>
                  <SelectItem value="Bamini">Bamini</SelectItem>
                  <SelectItem value="TAM-Kavin">TAM-Kavin</SelectItem>
                  <SelectItem value="TAM-Shakti">TAM-Shakti</SelectItem>
                </SelectContent>
              </Select>

              <Select value={fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="w-[100px] h-8 text-xs border-purple-200">
                  <SelectValue placeholder="அளவு" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">சிறிய</SelectItem>
                  <SelectItem value="2">குறைந்த</SelectItem>
                  <SelectItem value="3">சாதாரண</SelectItem>
                  <SelectItem value="4">பெரிய</SelectItem>
                  <SelectItem value="5">மிகப்பெரிய</SelectItem>
                  <SelectItem value="6">மாபெரும்</SelectItem>
                  <SelectItem value="7">மிகமாபெரும்</SelectItem>
                </SelectContent>
              </Select>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div
        ref={editorRef}
        contentEditable
        className="min-h-[500px] p-4 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        onInput={handleEditorChange}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>இணைப்பைச் சேர்</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-text" className="text-right">
                உரை
              </Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="col-span-3"
                placeholder="இணைப்பு உரை"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-url" className="text-right">
                URL
              </Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              ரத்து
            </Button>
            <Button onClick={handleLinkInsert} className="bg-purple-600 hover:bg-purple-700">
              சேர்
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>படத்தைச் சேர்</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="file" onValueChange={(value) => setImageUploadMethod(value as "file" | "url")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">கோப்பு பதிவேற்றம்</TabsTrigger>
              <TabsTrigger value="url">URL மூலம்</TabsTrigger>
            </TabsList>
            <TabsContent value="file" className="space-y-4 py-4">
              <div className="grid gap-4">
                <Label htmlFor="image-file">படக் கோப்பு</Label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-alt">மாற்று உரை</Label>
                <Input
                  id="image-alt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="படத்தின் விளக்கம்"
                />
              </div>
            </TabsContent>
            <TabsContent value="url" className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="image-url">பட URL</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-alt-url">மாற்று உரை</Label>
                <Input
                  id="image-alt-url"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="படத்தின் விளக்கம்"
                />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
              ரத்து
            </Button>
            <Button onClick={handleImageUpload} className="bg-purple-600 hover:bg-purple-700">
              சேர்
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Dialog */}
      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>அட்டவணையைச் சேர்</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="table-rows" className="text-right">
                வரிசைகள்
              </Label>
              <Input
                id="table-rows"
                type="number"
                min="1"
                max="20"
                value={tableRows}
                onChange={(e) => setTableRows(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="table-cols" className="text-right">
                நெடுவரிசைகள்
              </Label>
              <Input
                id="table-cols"
                type="number"
                min="1"
                max="10"
                value={tableCols}
                onChange={(e) => setTableCols(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTableDialogOpen(false)}>
              ரத்து
            </Button>
            <Button onClick={handleTableInsert} className="bg-purple-600 hover:bg-purple-700">
              சேர்
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Color Dialog */}
      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>நிறங்களைத் தேர்ந்தெடு</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text-color" className="text-right">
                உரை நிறம்
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <span className="text-sm">{textColor}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bg-color" className="text-right">
                பின்னணி நிறம்
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <span className="text-sm">{bgColor}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsColorDialogOpen(false)}>
              ரத்து
            </Button>
            <Button
              onClick={() => {
                handleTextColorChange(textColor)
                handleBgColorChange(bgColor)
                setIsColorDialogOpen(false)
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              பயன்படுத்து
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
