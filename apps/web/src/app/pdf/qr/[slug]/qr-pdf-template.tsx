"use client";

import { QRCodeSVG } from "qrcode.react";

interface QrPdfTemplateProps {
  slug: string;
  businessName: string;
  logoUrl?: string | null;
  themeColor?: string;
}

export function QrPdfTemplate({
  slug,
  businessName,
  logoUrl,
  themeColor = "#C25E3A",
}: QrPdfTemplateProps) {
  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : "https://mesa.pe"}/${slug}`;

  const qrSize = 440;
  const logoSize = 72;

  return (
    <div
      data-pdf-ready="true"
      className="pdf-page"
      style={
        {
          "--theme-color": themeColor,
        } as React.CSSProperties
      }
    >
      {/* Accent line */}
      <div className="accent-line" style={{ backgroundColor: themeColor }} />

      <div className="content">
        {/* Label pill */}
        <div className="label-pill" style={{ backgroundColor: themeColor }}>
          Escanea para ver nuestra carta
        </div>

        {/* Business name */}
        <h1 className="business-name">{businessName}</h1>

        {/* Subtitle */}
        <p className="subtitle">Carta digital · Pedidos por WhatsApp</p>

        {/* QR Card */}
        <div className="qr-card">
          <div className="qr-wrapper">
            <QRCodeSVG
              value={publicUrl}
              size={qrSize}
              level="H"
              includeMargin
            />
            {logoUrl && (
              <div className="logo-overlay">
                <div className="logo-bg">
                  <img
                    src={logoUrl}
                    alt=""
                    className="logo-img"
                    width={logoSize}
                    height={logoSize}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <p className="instructions">
          Abre la cámara de tu celular y apunta al código QR para ver nuestro
          menú completo con precios actualizados.
        </p>

        {/* WhatsApp hint */}
        <div className="whatsapp-hint">
          <span className="whatsapp-dot" />
          <span>También puedes hacer tu pedido por WhatsApp</span>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Footer */}
        <div className="footer">
          <p className="footer-label">Carta digital creada con</p>
          <p className="footer-brand" style={{ color: themeColor }}>
            mesa.pe
          </p>
          <p className="footer-url">{publicUrl}</p>
        </div>
      </div>
    </div>
  );
}
