"use client";

import React, { useMemo } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { ProfessionalTemplate } from './pdf-templates/ProfessionalTemplate';
import { ModernTemplate } from './pdf-templates/ModernTemplate';
import { MinimalTemplate } from './pdf-templates/MinimalTemplate';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface LivePDFPreviewProps {
    data: ResumeData;
    template: 'professional' | 'modern' | 'minimal';
}

export default function LivePDFPreview({ data, template }: LivePDFPreviewProps) {
    // Memoize the document to prevent unnecessary re-renders on every tiny state change if possible
    const Document = useMemo(() => {
        switch (template) {
            case 'modern':
                return <ModernTemplate data={data} />;
            case 'minimal':
                return <MinimalTemplate data={data} />;
            case 'professional':
            default:
                return <ProfessionalTemplate data={data} />;
        }
    }, [data, template]);

    return (
        <div className="w-full h-full flex flex-col bg-background/50 rounded-xl overflow-hidden border border-border/50">
            <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border/50">
                <span className="text-sm font-medium">Live PDF Preview</span>
                <PDFDownloadLink document={Document} fileName={`${data.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_${template}.pdf`}>
                    {({ loading }) => (
                        <Button variant="default" size="sm" className="gap-2 h-8" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            Download PDF
                        </Button>
                    )}
                </PDFDownloadLink>
            </div>
            
            <div className="flex-1 w-full relative bg-white/5 p-2 md:p-6 flex items-center justify-center">
                <div className="w-full max-w-[800px] h-full shadow-2xl rounded-sm overflow-hidden border border-border/20 bg-white">
                    <PDFViewer width="100%" height="100%" style={{ border: 'none' }} showToolbar={false}>
                        {Document}
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
}
