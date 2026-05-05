"use client";

import jsPDF from "jspdf";

interface GenerateQrPdfOptions {
  slug: string;
  businessName: string;
  logoUrl?: string | null;
  qrDataUrl: string;
  themeColor?: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function generateQrPdf({
  slug,
  businessName,
  logoUrl,
  qrDataUrl,
  themeColor = "#C25E3A",
}: GenerateQrPdfOptions): Promise<void> {
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `https://mesa.pe/${slug}`;

  // A4 @ 150dpi = 1240 x 1754
  const DPR = 2;
  const W = 1240;
  const H = 1754;

  const canvas = document.createElement("canvas");
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");
  ctx.scale(DPR, DPR);

  // ── 1. Background ──
  ctx.fillStyle = "#FDF8F3";
  ctx.fillRect(0, 0, W, H);

  // ── 2. Measure content to centre vertically ──
  const padX = 100;
  const contentW = W - padX * 2;

  const labelH = 44;
  const labelGap = 72;

  const nameSize = 56;
  ctx.font = `600 ${nameSize}px "Playfair Display", ui-serif, Georgia, serif`;
  const nameMetrics = ctx.measureText(businessName);
  const nameLines =
    nameMetrics.width > contentW
      ? wrapText(ctx, businessName, contentW)
      : [businessName];
  const nameBlockH = nameLines.length * (nameSize + 8);
  const nameGap = 20;

  const subSize = 24;
  const subGap = 52;

  const qrBoxPad = 28;
  const qrSize = 440;
  const qrBlockH = qrSize + qrBoxPad * 2;
  const qrGap = 44;

  const instrSize = 22;
  ctx.font = `400 ${instrSize}px "DM Sans", ui-sans-serif, system-ui, sans-serif`;
  const instrText =
    "Abre la cámara de tu celular y apunta al código QR para ver nuestro menú completo con precios actualizados.";
  const instrLines = wrapText(ctx, instrText, contentW - 80);
  const instrBlockH = instrLines.length * (instrSize + 10);
  const instrGap = 36;

  const hintH = 48;
  const hintGap = 52;

  const dividerH = 1;
  const dividerGap = 40;

  const footerSize = 18;
  const brandSize = 24;
  const urlSize = 15;
  const footerBlockH = footerSize + brandSize + urlSize + 16;

  const totalContentH =
    labelH +
    labelGap +
    nameBlockH +
    nameGap +
    subSize +
    subGap +
    qrBlockH +
    qrGap +
    instrBlockH +
    instrGap +
    hintH +
    hintGap +
    dividerH +
    dividerGap +
    footerBlockH;

  let cursorY = (H - totalContentH) / 2;

  // ── 3. Label pill ──
  const label = "Escanea para ver nuestra carta";
  ctx.font = '500 20px "DM Sans", ui-sans-serif, system-ui, sans-serif';
  const labelW = ctx.measureText(label).width + 56;
  const labelX = (W - labelW) / 2;

  ctx.save();
  ctx.beginPath();
  roundRect(ctx, labelX, cursorY, labelW, labelH, 999);
  ctx.fillStyle = themeColor;
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, W / 2, cursorY + labelH / 2 + 1);

  cursorY += labelH + labelGap;

  // ── 4. Business name ──
  ctx.fillStyle = "#2A211E";
  ctx.font = `600 ${nameSize}px "Playfair Display", ui-serif, Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  for (const line of nameLines) {
    ctx.fillText(line, W / 2, cursorY);
    cursorY += nameSize + 8;
  }
  cursorY += nameGap - 8;

  // ── 5. Subtitle ──
  ctx.fillStyle = "#7D6F65";
  ctx.font = `400 ${subSize}px "DM Sans", ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText("Carta digital · Pedidos por WhatsApp", W / 2, cursorY);

  cursorY += subGap;

  // ── 6. QR card ──
  const qrX = (W - qrSize) / 2;
  const qrY = cursorY + qrBoxPad;

  ctx.save();
  ctx.beginPath();
  roundRect(ctx, qrX - qrBoxPad, cursorY, qrSize + qrBoxPad * 2, qrBlockH, 24);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#EDE6DE";
  ctx.stroke();
  ctx.restore();

  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // Logo overlay
  if (logoUrl) {
    try {
      const logoImg = await loadImage(logoUrl);
      const logoSize = 72;
      const logoX = qrX + (qrSize - logoSize) / 2;
      const logoY = qrY + (qrSize - logoSize) / 2;

      ctx.save();
      ctx.beginPath();
      roundRect(ctx, logoX - 10, logoY - 10, logoSize + 20, logoSize + 20, 14);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      roundRect(ctx, logoX, logoY, logoSize, logoSize, 10);
      ctx.clip();
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      ctx.restore();
    } catch {
      // Logo failed — QR alone is fine
    }
  }

  cursorY += qrBlockH + qrGap;

  // ── 7. Instructions ──
  ctx.fillStyle = "#7D6F65";
  ctx.font = `400 ${instrSize}px "DM Sans", ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  for (const line of instrLines) {
    ctx.fillText(line, W / 2, cursorY);
    cursorY += instrSize + 10;
  }
  cursorY += instrGap - 10;

  // ── 8. WhatsApp hint pill ──
  const hint = "También puedes hacer tu pedido por WhatsApp";
  ctx.font = '500 20px "DM Sans", ui-sans-serif, system-ui, sans-serif';
  const hintW = ctx.measureText(hint).width + 56;
  const hintX = (W - hintW) / 2;

  ctx.save();
  ctx.beginPath();
  roundRect(ctx, hintX, cursorY, hintW, hintH, 999);
  ctx.fillStyle = "#F5F0EB";
  ctx.fill();
  ctx.restore();

  // Green dot
  ctx.save();
  ctx.beginPath();
  ctx.arc(hintX + 26, cursorY + hintH / 2, 8, 0, Math.PI * 2);
  ctx.fillStyle = "#25D366";
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#6B5B4F";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(hint, hintX + 42, cursorY + hintH / 2 + 1);

  cursorY += hintH + hintGap;

  // ── 9. Divider ──
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(padX + 80, cursorY);
  ctx.lineTo(W - padX - 80, cursorY);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#EDE6DE";
  ctx.stroke();
  ctx.restore();

  cursorY += dividerGap;

  // ── 10. Footer ──
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#7D6F65";
  ctx.font = '400 18px "DM Sans", ui-sans-serif, system-ui, sans-serif';
  ctx.fillText("Carta digital creada con", W / 2, cursorY);

  cursorY += 28;
  ctx.fillStyle = themeColor;
  ctx.font = '700 22px "DM Sans", ui-sans-serif, system-ui, sans-serif';
  ctx.fillText("mesa.pe", W / 2, cursorY);

  cursorY += 26;
  ctx.fillStyle = "#A89B8C";
  ctx.font = '400 14px "DM Sans", ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(publicUrl, W / 2, cursorY);

  // ── 11. Terracotta accent line at very top ──
  ctx.save();
  ctx.fillStyle = themeColor;
  ctx.fillRect(0, 0, W, 8);
  ctx.restore();

  // ── Export ──
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
  pdf.save(`${slug}-qr-mesa.pdf`);
}

// ── Helpers ──

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}
