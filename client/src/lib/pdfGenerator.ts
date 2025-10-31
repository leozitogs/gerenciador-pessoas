// client/src/lib/pdfGenerator.ts
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { Person, PDFExportType } from "./types";
import { format } from "date-fns";
import { formatCardNumber, formatCPF, formatRG } from "./validation";

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = A4_WIDTH - 2 * MARGIN;

interface PDFGeneratorOptions {
  people: Person[];
  title: string;
  type: PDFExportType;
}

function formatDocumentFromPerson(p: Person): string {
  const cpf = (p.cpf || "").trim();
  const rg = (p.rg || "").trim();
  if (cpf) return formatCPF(cpf);
  if (rg) return formatRG(rg.toUpperCase());
  return "—";
}

/** Cabeçalho (sincrono) — retorna o novo Y */
function addHeader(
  page: any,
  font: any,
  boldFont: any,
  title: string,
  y: number
): number {
  const titleSize = 16;
  const titleWidth = boldFont.widthOfTextAtSize(title, titleSize);

  page.drawText(title, {
    x: (A4_WIDTH - titleWidth) / 2,
    y,
    size: titleSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  const sub = "Gerenciador de Pessoas e Credenciamento";
  const subSize = 10;
  const subWidth = font.widthOfTextAtSize(sub, subSize);
  page.drawText(sub, {
    x: (A4_WIDTH - subWidth) / 2,
    y: y - 16,
    size: subSize,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });

  return y - 36;
}

/** Rodapé (sincrono) */
function addFooter(
  page: any,
  font: any,
  pageNum: number,
  totalPages: number
): void {
  const now = new Date();
  const dateTime = format(now, "dd/MM/yyyy HH:mm");
  const footerText = `${dateTime} · Página ${pageNum}/${totalPages}`;
  const footerSize = 10;
  const footerWidth = font.widthOfTextAtSize(footerText, footerSize);

  page.drawText(footerText, {
    x: (A4_WIDTH - footerWidth) / 2,
    y: 30,
    size: footerSize,
    font,
    color: rgb(0.45, 0.45, 0.45),
  });
}

function wrapText(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = String(text).split(" ");
  const lines: string[] = [];
  let current = "";

  for (const w of words) {
    const test = current ? `${current} ${w}` : w;
    const width = font.widthOfTextAtSize(test, fontSize);
    if (width > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function generateTablePDF(
  pdfDoc: PDFDocument,
  people: Person[],
  title: string,
  font: any,
  boldFont: any
): Promise<void> {
  const fontSize = 10;
  const headerFontSize = 11;
  const lineHeight = 14;
  const rowHeight = 48;
  const headerHeight = 26;

  // 3 colunas: Nome | Cartão | Documento
  const colWidths = {
    nome: CONTENT_WIDTH * 0.45,
    cartao: CONTENT_WIDTH * 0.25,
    doc: CONTENT_WIDTH * 0.30,
  };

  let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;
  const pages: any[] = [currentPage];

  // Cabeçalho
  y = addHeader(currentPage, font, boldFont, title, y);
  y -= 12;

  const drawTableHeader = (page: any, yPos: number): number => {
    let x = MARGIN;

    // Fundo do header
    page.drawRectangle({
      x: MARGIN,
      y: yPos - headerHeight,
      width: CONTENT_WIDTH,
      height: headerHeight,
      color: rgb(0.93, 0.93, 0.95),
    });

    // Bordas horizontais
    page.drawLine({
      start: { x: MARGIN, y: yPos },
      end: { x: A4_WIDTH - MARGIN, y: yPos },
      thickness: 1,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawLine({
      start: { x: MARGIN, y: yPos - headerHeight },
      end: { x: A4_WIDTH - MARGIN, y: yPos - headerHeight },
      thickness: 1,
      color: rgb(0.2, 0.2, 0.2),
    });

    const headers = ["Nome", "Cartão", "Documento"];
    const widths = [colWidths.nome, colWidths.cartao, colWidths.doc];

    headers.forEach((header, i) => {
      page.drawText(header, {
        x: x + 6,
        y: yPos - 17,
        size: headerFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      // coluna vertical
      page.drawLine({
        start: { x, y: yPos },
        end: { x, y: yPos - headerHeight },
        thickness: 1,
        color: rgb(0.2, 0.2, 0.2),
      });

      x += widths[i];
    });

    // última vertical
    page.drawLine({
      start: { x: A4_WIDTH - MARGIN, y: yPos },
      end: { x: A4_WIDTH - MARGIN, y: yPos - headerHeight },
      thickness: 1,
      color: rgb(0.2, 0.2, 0.2),
    });

    return yPos - headerHeight;
  };

  y = drawTableHeader(currentPage, y);

  people.forEach((person, idx) => {
    if (y < MARGIN + 80) {
      currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      pages.push(currentPage);
      y = A4_HEIGHT - MARGIN;
      y = addHeader(currentPage, font, boldFont, title, y);
      y -= 12;
      y = drawTableHeader(currentPage, y);
    }

    let x = MARGIN;

    // zebra
    if (idx % 2 === 1) {
      currentPage.drawRectangle({
        x: MARGIN,
        y: y - rowHeight,
        width: CONTENT_WIDTH,
        height: rowHeight,
        color: rgb(0.985, 0.985, 0.99),
      });
    }

    const data = [
      person.name || "—",
      formatCardNumber(person.cardNumber || "") || "—",
      formatDocumentFromPerson(person),
    ];
    const widths = [colWidths.nome, colWidths.cartao, colWidths.doc];

    data.forEach((text, i) => {
      const lines = wrapText(text, font, fontSize, widths[i] - 12);
      let textY = y - 16;

      lines.slice(0, 3).forEach((line) => {
        currentPage.drawText(line, {
          x: x + 6,
          y: textY,
          size: fontSize,
          font,
          color: rgb(0.05, 0.05, 0.08),
        });
        textY -= lineHeight;
      });

      // coluna separadora
      currentPage.drawLine({
        start: { x, y },
        end: { x, y: y - rowHeight },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.74),
      });

      x += widths[i];
    });

    // última vertical + base
    currentPage.drawLine({
      start: { x: A4_WIDTH - MARGIN, y },
      end: { x: A4_WIDTH - MARGIN, y: y - rowHeight },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.74),
    });
    currentPage.drawLine({
      start: { x: MARGIN, y: y - rowHeight },
      end: { x: A4_WIDTH - MARGIN, y: y - rowHeight },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.74),
    });

    y -= rowHeight;
  });

  // rodapés
  pages.forEach((page, i) => {
    addFooter(page, font, i + 1, pages.length);
  });
}

async function generateContinuousPDF(
  pdfDoc: PDFDocument,
  people: Person[],
  title: string,
  font: any,
  boldFont: any
): Promise<void> {
  const fontSize = 11;
  const lineHeight = 18;
  const itemSpacing = 8;

  let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;
  const pages: any[] = [currentPage];

  y = addHeader(currentPage, font, boldFont, title, y);
  y -= 24;

  for (const person of people) {
    const lines = [
      `Nome: ${person.name || "—"}`,
      `Cartão: ${formatCardNumber(person.cardNumber || "") || "—"}`,
      `Documento: ${formatDocumentFromPerson(person)}`,
    ];
    const totalHeight = lines.length * lineHeight + itemSpacing;

    if (y - totalHeight < MARGIN + 50) {
      currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      pages.push(currentPage);
      y = A4_HEIGHT - MARGIN;
      y = addHeader(currentPage, font, boldFont, title, y);
      y -= 24;
    }

    lines.forEach((line) => {
      currentPage.drawText(line, {
        x: MARGIN,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    });

    y -= itemSpacing;
  }

  pages.forEach((page, i) => addFooter(page, font, i + 1, pages.length));
}

async function generateSignaturesPDF(
  pdfDoc: PDFDocument,
  people: Person[],
  title: string,
  font: any,
  boldFont: any
): Promise<void> {
  const fontSize = 11;
  const signatureHeight = 100; // ~3.5 cm
  const itemSpacing = 10;

  let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;
  const pages: any[] = [currentPage];

  y = addHeader(currentPage, font, boldFont, title, y);
  y -= 24;

  for (const person of people) {
    const totalHeight = 20 + signatureHeight + itemSpacing;

    if (y - totalHeight < MARGIN + 50) {
      currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      pages.push(currentPage);
      y = A4_HEIGHT - MARGIN;
      y = addHeader(currentPage, font, boldFont, title, y);
      y -= 24;
    }

    currentPage.drawText(person.name || "(sem nome)", {
      x: MARGIN,
      y,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    y -= 25;

    currentPage.drawLine({
      start: { x: MARGIN, y },
      end: { x: A4_WIDTH - MARGIN, y },
      thickness: 0.5,
      color: rgb(0.5, 0.5, 0.5),
    });

    y -= signatureHeight + itemSpacing;
  }

  pages.forEach((page, i) => addFooter(page, font, i + 1, pages.length));
}

export async function generatePDF({
  people,
  title,
  type,
}: PDFGeneratorOptions): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  switch (type) {
    case "table":
      await generateTablePDF(pdfDoc, people, title, font, boldFont);
      break;
    case "continuous":
      await generateContinuousPDF(pdfDoc, people, title, font, boldFont);
      break;
    case "signatures":
      await generateSignaturesPDF(pdfDoc, people, title, font, boldFont);
      break;
  }

  return await pdfDoc.save();
}

export function generatePDFFilename(title: string): string {
  const now = new Date();
  const dateStr = format(now, "yyyy-MM-dd");
  const timeStr = format(now, "HHmm");
  const sanitizedTitle = title
    .replace(/[^a-zA-Z0-9\s\-_]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  return `${sanitizedTitle}-${dateStr}-${timeStr}.pdf`;
}
