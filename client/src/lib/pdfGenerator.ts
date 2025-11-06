// client/src/lib/pdfGenerator.ts

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { Person, PDFExportOptions, PDFExportType } from './types';
import { formataDocumento, mascaraDocumento } from './doc';
import { format } from 'date-fns';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = A4_WIDTH - 2 * MARGIN;

interface PDFGeneratorOptions extends PDFExportOptions {}

function getRawDocument(person: Person): string {
  return (
    person.document ||
    person.cpf ||
    person.rg ||
    ''
  );
}

function getDisplayDocument(person: Person, maskDocuments: boolean): string {
  const raw = getRawDocument(person);
  if (!raw) return '—';
  return maskDocuments ? mascaraDocumento(raw) : formataDocumento(raw);
}

function getDisplayCard(person: Person): string {
  return person.cardNumber || '—';
}

async function addHeader(
  page: any,
  font: any,
  boldFont: any,
  title: string,
  y: number
): Promise<number> {
  const titleSize = 16;
  const titleWidth = boldFont.widthOfTextAtSize(title, titleSize);

  page.drawText(title, {
    x: (A4_WIDTH - titleWidth) / 2,
    y,
    size: titleSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  return y - 30;
}

async function addFooter(
  page: any,
  font: any,
  pageNum: number,
  totalPages: number
): Promise<void> {
  const now = new Date();
  const dateTime = format(now, 'dd/MM/yyyy HH:mm');
  const footerText = `${dateTime} · Página ${pageNum}/${totalPages}`;
  const footerSize = 9;
  const footerWidth = font.widthOfTextAtSize(footerText, footerSize);

  page.drawText(footerText, {
    x: (A4_WIDTH - footerWidth) / 2,
    y: 28,
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
  const words = (text || '').split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const w = font.widthOfTextAtSize(test, fontSize);

    if (w > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }

  if (current) lines.push(current);
  return lines;
}

/* ---------- PDF Tabela ---------- */

async function generateTablePDF(
  pdfDoc: PDFDocument,
  people: Person[],
  title: string,
  font: any,
  boldFont: any,
  maskDocuments: boolean
): Promise<void> {
  const fontSize = 10;
  const headerFontSize = 11;
  const lineHeight = 16;
  const rowHeight = 40;
  const headerHeight = 24;

  const colWidths = {
    nome: CONTENT_WIDTH * 0.45,
    cartao: CONTENT_WIDTH * 0.20,
    doc: CONTENT_WIDTH * 0.35,
  };

  let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;
  let pageNum = 1;
  const pages: any[] = [currentPage];

  y = await addHeader(currentPage, font, boldFont, title, y);
  y -= 10;

  const drawTableHeader = (page: any, yPos: number): number => {
    let x = MARGIN;

    // fundo cabeçalho
    page.drawRectangle({
      x: MARGIN,
      y: yPos - headerHeight,
      width: CONTENT_WIDTH,
      height: headerHeight,
      color: rgb(0.93, 0.95, 0.98),
    });

    // borda externa superior
    page.drawLine({
      start: { x: MARGIN, y: yPos },
      end: { x: A4_WIDTH - MARGIN, y: yPos },
      thickness: 1,
      color: rgb(0.2, 0.2, 0.25),
    });

    const headers = ['Nome', 'Cartão', 'Documento'];
    const widths = [colWidths.nome, colWidths.cartao, colWidths.doc];

    headers.forEach((header, i) => {
      page.drawText(header, {
        x: x + 6,
        y: yPos - 16,
        size: headerFontSize,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.15),
      });

      // linha vertical
      page.drawLine({
        start: { x, y: yPos },
        end: { x, y: yPos - headerHeight },
        thickness: 0.8,
        color: rgb(0.8, 0.8, 0.85),
      });

      x += widths[i];
    });

    // última linha vertical
    page.drawLine({
      start: { x: A4_WIDTH - MARGIN, y: yPos },
      end: { x: A4_WIDTH - MARGIN, y: yPos - headerHeight },
      thickness: 0.8,
      color: rgb(0.8, 0.8, 0.85),
    });

    return yPos - headerHeight;
  };

  y = drawTableHeader(currentPage, y);

  for (const person of people) {
    if (y < MARGIN + 80) {
      pageNum++;
      currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      pages.push(currentPage);
      y = A4_HEIGHT - MARGIN;
      y = await addHeader(currentPage, font, boldFont, title, y);
      y -= 10;
      y = drawTableHeader(currentPage, y);
    }

    const card = getDisplayCard(person);
    const doc = getDisplayDocument(person, maskDocuments);

    let x = MARGIN;

    // fundo da linha
    currentPage.drawRectangle({
      x: MARGIN,
      y: y - rowHeight,
      width: CONTENT_WIDTH,
      height: rowHeight,
      color: rgb(1, 1, 1),
    });

    const data = [
      person.name || '—',
      card,
      doc,
    ];
    const widths = [colWidths.nome, colWidths.cartao, colWidths.doc];

    data.forEach((value, i) => {
      const lines = wrapText(String(value), font, fontSize, widths[i] - 10);
      let textY = y - 14;

      lines.slice(0, 2).forEach((line) => {
        currentPage.drawText(line, {
          x: x + 6,
          y: textY,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
        textY -= lineHeight;
      });

      // linha vertical
      currentPage.drawLine({
        start: { x, y },
        end: { x, y: y - rowHeight },
        thickness: 0.4,
        color: rgb(0.88, 0.88, 0.9),
      });

      x += widths[i];
    });

    // borda inferior da linha
    currentPage.drawLine({
      start: { x: MARGIN, y: y - rowHeight },
      end: { x: A4_WIDTH - MARGIN, y: y - rowHeight },
      thickness: 0.4,
      color: rgb(0.88, 0.88, 0.9),
    });

    y -= rowHeight;
  }

  // rodapés
  pages.forEach((page, i) => {
    addFooter(page, font, i + 1, pages.length);
  });
}

/* ---------- PDF Contínuo (lista limpa) ---------- */

async function generateContinuousPDF(
  pdfDoc: PDFDocument,
  people: Person[],
  title: string,
  font: any,
  boldFont: any,
  maskDocuments: boolean
): Promise<void> {
  const fontSize = 11;
  const lineHeight = 18;
  const itemSpacing = 10;

  let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;
  let pageNum = 1;
  const pages: any[] = [currentPage];

  y = await addHeader(currentPage, font, boldFont, title, y);
  y -= 10;

  for (const person of people) {
    const card = getDisplayCard(person);
    const doc = getDisplayDocument(person, maskDocuments);

    const blockLines = [
      `Nome: ${person.name || '—'}`,
      `Cartão: ${card}`,
      `Documento: ${doc}`,
    ];

    const blockHeight = blockLines.length * lineHeight + itemSpacing;

    if (y - blockHeight < MARGIN + 40) {
      pageNum++;
      currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      pages.push(currentPage);
      y = A4_HEIGHT - MARGIN;
      y = await addHeader(currentPage, font, boldFont, title, y);
      y -= 10;
    }

    blockLines.forEach((line) => {
      currentPage.drawText(line, {
        x: MARGIN,
        y,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= lineHeight;
    });

    y -= itemSpacing;
  }

  pages.forEach((page, i) => {
    addFooter(page, font, i + 1, pages.length);
  });
}

/* ---------- PDF Assinaturas ---------- */

async function generateSignaturesPDF(
  pdfDoc: PDFDocument,
  people: Person[],
  title: string,
  font: any,
  boldFont: any,
  maskDocuments: boolean
): Promise<void> {
  const nameSize = 11;
  const infoSize = 9;
  const signatureHeight = 40; // altura do espaço de assinatura
  const itemSpacing = 18;

  let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;
  let pageNum = 1;
  const pages: any[] = [currentPage];

  y = await addHeader(currentPage, font, boldFont, title, y);
  y -= 20;

  for (const person of people) {
    const card = getDisplayCard(person);
    const doc = getDisplayDocument(person, maskDocuments);

    const needed =
      20 + // nome
      14 + // linha info
      signatureHeight +
      itemSpacing;

    if (y - needed < MARGIN + 40) {
      pageNum++;
      currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      pages.push(currentPage);
      y = A4_HEIGHT - MARGIN;
      y = await addHeader(currentPage, font, boldFont, title, y);
      y -= 20;
    }

    // Nome
    currentPage.drawText(person.name || '(sem nome)', {
      x: MARGIN,
      y,
      size: nameSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    y -= 16;

    // Cartão + Documento (requisito novo)
    const infoLine = `Cartão: ${card}   |   Documento: ${doc}`;
    currentPage.drawText(infoLine, {
      x: MARGIN,
      y,
      size: infoSize,
      font,
      color: rgb(0.25, 0.25, 0.25),
    });

    y -= 18;

    // Linha de assinatura
    currentPage.drawLine({
      start: { x: MARGIN, y },
      end: { x: A4_WIDTH - MARGIN, y },
      thickness: 0.6,
      color: rgb(0.3, 0.3, 0.3),
    });

    y -= signatureHeight + itemSpacing;
  }

  pages.forEach((page, i) => {
    addFooter(page, font, i + 1, pages.length);
  });
}

/* ---------- Funções públicas ---------- */

export async function generatePDF(
  options: PDFGeneratorOptions
): Promise<Uint8Array> {
  const { people, title, type, maskDocuments } = options;

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  switch (type as PDFExportType) {
    case 'table':
      await generateTablePDF(pdfDoc, people, title, font, boldFont, maskDocuments);
      break;
    case 'continuous':
      await generateContinuousPDF(
        pdfDoc,
        people,
        title,
        font,
        boldFont,
        maskDocuments
      );
      break;
    case 'signatures':
      await generateSignaturesPDF(
        pdfDoc,
        people,
        title,
        font,
        boldFont,
        maskDocuments
      );
      break;
  }

  return await pdfDoc.save();
}

export function generatePDFFilename(title: string): string {
  const now = new Date();
  const dateStr = format(now, 'yyyy-MM-dd');
  const timeStr = format(now, 'HHmm');

  const sanitizedTitle = title
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  return `${sanitizedTitle || 'lista'}-${dateStr}-${timeStr}.pdf`;
}
