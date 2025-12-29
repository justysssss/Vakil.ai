"use client";

import * as React from 'react';

export default function UploadSidebar() {
    return (
        <aside className="w-full md:w-80 p-4 rounded-lg bg-card/60 border border-border/10">
            <h3 className="font-semibold">VakilVerify — Quick Tips</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Upload a single PDF contract (max 25 MB).</li>
                <li>• We will extract text & coordinates using Amazon Textract.</li>
                <li>• High-risk clauses are highlighted with a red heatmap.</li>
                <li>• Generate safe counter-clauses and email drafts.</li>
            </ul>

            <div className="mt-4">
                <h4 className="text-sm font-medium">Analysis options</h4>
                <div className="mt-2 flex flex-col gap-2 text-sm">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="accent-primary" defaultChecked />
                        <span className="text-sm">Run Stamp Duty Auditor</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="accent-primary" defaultChecked />
                        <span className="text-sm">MSME 45-Day Alert</span>
                    </label>
                </div>
            </div>
        </aside>
    );
}
