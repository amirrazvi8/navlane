import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"

export function ResumeUpload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 hover:bg-muted/50 transition-colors cursor-pointer">
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">Drag and drop your resume here</p>
          <p className="text-xs text-muted-foreground mb-4">PDF, DOCX up to 5MB</p>
          <Button variant="outline">Select File</Button>
        </div>
      </CardContent>
    </Card>
  )
}
