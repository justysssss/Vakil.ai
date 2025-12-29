"use client";

import * as React from 'react';
import Dropzone from '@/components/upload/Dropzone';
import UploadControls from '@/components/upload/UploadControls';
import PdfViewer from '@/components/pdf/PdfViewer';
import UploadSidebar from '@/components/upload/Sidebar';

export default function UploadPage() {
    const [file, setFile] = React.useState<File | null>(null);

    return (
        <div className="min-h-screen flex items-start justify-center bg-background p-8">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-card/80 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold">VakilVerify — Upload & Analyze</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Drop a PDF contract to begin clause-level analysis and redline heatmaps.</p>

                    <div className="mt-6">
                        <Dropzone onFileSelect={setFile} accept={["application/pdf"]} />
                    </div>

                    <div className="mt-6">
                        <UploadControls file={file} onAnalyze={() => { /* Frontend-only: actual backend wired later */ }} />
                    </div>

                    <div className="mt-8">
                        <PdfViewer file={file} />
                    </div>
                </div>

                <div className="md:col-span-1">
                    <UploadSidebar />
                </div>
            </div>
        </div>
    );
}
