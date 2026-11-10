"use client";

import React, { useState } from "react";
import { Printer, Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ExactPdfLiveViewerProps {
  blobUrl: string | null;
  loading?: boolean;
  title?: string;
  onPrint?: () => void;
  onDownload?: () => void;
  className?: string;
  minHeight?: string;
  showToolbar?: boolean;
}

export const ExactPdfLiveViewer: React.FC<ExactPdfLiveViewerProps> = ({
  blobUrl,
  loading = false,
  title = "Document Preview",
  onPrint,
  onDownload,
  className = "",
  minHeight = "720px",
  showToolbar = false,
}) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, "_blank");
    }
  };

  return (
    <div className={`w-full flex flex-col bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-inner ${className}`}>
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <span>{title}</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Exact 32 Smiles PDF Template
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {blobUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenNewTab}
                className="h-8 px-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                title="Open in Full Window"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Full View
              </Button>
            )}

            {onDownload && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="h-8 px-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Download
              </Button>
            )}

            {onPrint && (
              <Button
                type="button"
                size="sm"
                onClick={onPrint}
                className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold"
              >
                <Printer className="h-3.5 w-3.5 mr-1" />
                Print
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main PDF Viewer Display Area */}
      <div className="relative w-full flex-1 flex justify-center items-center" style={{ minHeight }}>
        {loading || !blobUrl ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Generating high-fidelity 32 Smiles template overlay...</span>
          </div>
        ) : (
          <iframe
            src={`${blobUrl}#toolbar=0&navpanes=0&view=FitH`}
            title={title}
            className="w-full h-full border-none shadow-sm"
            style={{ minHeight, display: "block" }}
            onLoad={() => setIframeLoaded(true)}
          />
        )}
      </div>
    </div>
  );
};

