"use client";

import * as React from 'react';

interface UploadControlsProps {
    file: File | null;
    onAnalyze: () => void;
}

export default function UploadControls({ file, onAnalyze }: UploadControlsProps) {
    const [uploading, setUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        let t: number | undefined;
        if (uploading) {
            t = window.setInterval(() => {
                setProgress((p) => Math.min(100, p + Math.floor(Math.random() * 10) + 5));
            }, 400);
        }
        return () => { if (t) window.clearInterval(t); };
    }, [uploading]);

    const startAnalyze = () => {
        if (!file) return;
        setUploading(true);
        setProgress(0);
        // Simulate upload progress for frontend-only
        setTimeout(() => {
            setProgress(100);
            setUploading(false);
            onAnalyze();
        }, 2000 + Math.random() * 1500);
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                {file ? (
                    <div className="text-sm">
                        <div className="font-medium">{file.name}</div>
                        <div className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(1)} KB • {file.type}</div>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">No file selected</div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    disabled={!file || uploading}
                    onClick={startAnalyze}
                    className={`inline-flex items-center px-4 py-2 rounded-md bg-primary text-white disabled:opacity-50`}
                >
                    {uploading ? 'Analyzing...' : 'Analyze'}
                </button>
            </div>

            {uploading && (
                <div className="w-40">
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}
        </div>
    );
}
