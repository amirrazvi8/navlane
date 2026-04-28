import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, Loader2 } from "lucide-react"
import Swal from "sweetalert2"

export function ResumeUpload({ targetGoal, setAnalysisResult }: { targetGoal: string, setAnalysisResult: (data: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
      if (!file) {
          Swal.fire("Error", "Please select a resume file first.", "error");
          return;
      }
      if (!targetGoal) {
          Swal.fire("Error", "Please enter a target career goal first.", "error");
          return;
      }

      setLoading(true);
      try {
          const formData = new FormData();
          formData.append("resume", file);
          formData.append("targetGoal", targetGoal);

          const res = await fetch("/api/analysis/resume", {
              method: "POST",
              body: formData
          });

          if (!res.ok) {
              const data = await res.json();
              throw new Error(data.message || "Failed to analyze resume.");
          }

          const analysis = await res.json();
          setAnalysisResult(analysis);
          Swal.fire("Success", "Resume analyzed successfully!", "success");
      } catch (error: any) {
          Swal.fire("Analysis Failed", error.message, "error");
      } finally {
          setLoading(false);
      }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
          {file ? (
              <p className="text-sm font-medium text-primary mb-2">{file.name}</p>
          ) : (
              <>
                  <p className="text-sm text-muted-foreground mb-2">Click to select your resume</p>
                  <p className="text-xs text-muted-foreground mb-4">PDF, DOCX up to 5MB</p>
              </>
          )}
          <Button variant="outline" type="button" disabled={loading} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
              {file ? "Change File" : "Select File"}
          </Button>
        </div>
        <Button 
            className="w-full mt-4" 
            onClick={handleAnalyze} 
            disabled={!file || !targetGoal || loading}
        >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Analyzing with AI..." : "Analyze Resume"}
        </Button>
      </CardContent>
    </Card>
  )
}
