import { DocumentEditorWrapper } from "./document-editor-wrapper"

export const metadata = {
  title: "ஆவண எடிட்டர் | தமிழ் ஆவ",
  description: "ஆவணங்களை உருவாக்கவும், திருத்தவும், ஏற்றுமதி செய்யவும்",
}

export default function DocumentEditorPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold text-purple-800">ஆவண எடிட்டர்</h1>
      <DocumentEditorWrapper />
    </div>
  )
}
