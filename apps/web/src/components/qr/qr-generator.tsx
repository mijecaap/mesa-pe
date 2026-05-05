"use client";

import { useRef, useCallback, useState } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Download, Copy, Check, Link2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateQrPdf } from "@/lib/pdf-export";

interface QrGeneratorProps {
  slug: string;
  logoUrl?: string | null;
  businessName: string;
}

export function QrGenerator({ slug, logoUrl, businessName }: QrGeneratorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${slug}` : `https://mesa.pe/${slug}`;

  const downloadPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${slug}-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("QR descargado en PNG");
  }, [slug]);

  const downloadPdf = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error("QR no disponible para generar PDF");
      return;
    }

    try {
      toast.info("Generando PDF, espera un momento...");
      const qrDataUrl = canvas.toDataURL("image/png");
      await generateQrPdf({ slug, businessName, logoUrl, qrDataUrl });
      toast.success("PDF descargado correctamente");
    } catch (err) {
      console.error("[QR PDF] Error generando PDF:", err);
      toast.error("Error al generar el PDF. Intenta de nuevo.");
    }
  }, [slug, businessName, logoUrl]);

  const downloadSvg = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = `${slug}-qr.svg`;
    link.href = url;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("QR descargado en SVG");
  }, [slug]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      toast.success("Link copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [publicUrl]);

  const qrSize = 280;
  const logoSize = 56;

  return (
    <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Hidden canvas for PNG download */}
        <div className="hidden">
          <QRCodeCanvas
            value={publicUrl}
            size={qrSize}
            level="H"
            ref={canvasRef}
          />
        </div>

        {/* Visible SVG QR */}
        <div
          data-qr-slug={slug}
          className="relative rounded-xl border border-sand bg-white p-5 shadow-sm"
        >
          <QRCodeSVG
            value={publicUrl}
            size={qrSize}
            level="H"
            ref={svgRef}
            includeMargin
          />
          {logoUrl && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="rounded-xl border-2 border-white bg-white shadow-sm overflow-hidden"
                style={{ width: logoSize, height: logoSize }}
              >
                <img
                  src={logoUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-sand bg-cream/40 px-3 py-2.5">
            <Link2 className="h-4 w-4 shrink-0 text-warm-gray" />
            <span className="flex-1 truncate text-sm text-coffee">
              {publicUrl}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyLink}
              className="shrink-0 rounded-lg text-warm-gray hover:bg-sand/60 hover:text-coffee"
            >
              {copied ? <Check className="h-4 w-4 text-moss" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={downloadPng}
              className="w-full rounded-xl border-sand hover:bg-sand/40"
            >
              <Download className="mr-2 h-4 w-4" />
              PNG
            </Button>
            <Button
              variant="outline"
              onClick={downloadSvg}
              className="w-full rounded-xl border-sand hover:bg-sand/40"
            >
              <Download className="mr-2 h-4 w-4" />
              SVG
            </Button>
            <Button
              variant="outline"
              onClick={downloadPdf}
              className="w-full rounded-xl border-sand hover:bg-sand/40"
            >
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-warm-gray">
          Escanea el código para ver la carta digital de {businessName}
        </p>
      </div>
    </div>
  );
}
