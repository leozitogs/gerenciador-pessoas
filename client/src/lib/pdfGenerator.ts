import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { Person, PDFExportType } from './types';
import { maskCardNumber } from './validation';
import { format } from 'date-fns';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = A4_WIDTH - 2 * MARGIN;

interface PDFGeneratorOptions {
  people: Person[];
  title: string;
  type: PDFExportType;
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
  const dateTime = format(now, "dd/MM/yyyy HH:mm");
  const footerText = `${dateTime} - Página ${pageNum}/${totalPages}`;
  const footerSize = 10;
  const footerWidth = font.widthOfTextAtSize(footerText, footerSize);
  
  page.drawText(footerText, {
    x: (A4_WIDTH - footerWidth) / 2,
    y: 30,
    size: footerSize,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });
}

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
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
  const lineHeight = 20;
  const rowHeight = 60;
  const headerHeight = 25;
  
  const colWidths = {
    nome: CONTENT_WIDTH * 0.35,
    cartao: CONTENT_WIDTH * 0.25,
    cpf: CONTENT_WIDTH * 0.20,
    rg: CONTENT_WIDTH * 0.20,
  };
  
  let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;
  let pageNum = 1;
  const pages: any[] = [currentPage];
  
  // Cabeçalho do documento
  y = await addHeader(currentPage, font, boldFont, title, y);
  y -= 20;
  
  // Cabeçalho da tabela
  const drawTableHeader = (page: any, yPos: number): number => {
    let x = MARGIN;
    
    // Fundo do cabeçalho
    page.drawRectangle({
      x: MARGIN,
      y: yPos - headerHeight,
      width: CONTENT_WIDTH,
      height: headerHeight,
      color: rgb(0.9, 0.9, 0.9),
    });
    
    // Bordas
    page.drawLine({
      start: { x: MARGIN, y: yPos },
      end: { x: A4_WIDTH - MARGIN, y: yPos },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    page.drawLine({
      start: { x: MARGIN, y: yPos - headerHeight },
      end: { x: A4_WIDTH - MARGIN, y: yPos - headerHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    // Colunas
    const headers = ['Nome', 'Cartão', 'CPF', 'RG'];
    const widths = [colWidths.nome, colWidths.cartao, colWidths.cpf, colWidths.rg];
    
    headers.forEach((header, i) => {
      page.drawText(header, {
        x: x + 5,
        y: yPos - 17,
        size: headerFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      
      // Linha vertical
      page.drawLine({
        start: { x, y: yPos },
        end: { x, y: yPos - headerHeight },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      
      x += widths[i];
    });
    
    // Última linha vertical
    page.drawLine({
      start: { x: A4_WIDTH - MARGIN, y: yPos },
      end: { x: A4_WIDTH - MARGIN, y: yPos - headerHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    return yPos - headerHeight;
  };
  
  y = drawTableHeader(currentPage, y);
  
  // Linhas de dados
  for (const person of people) {
    if (y < MARGIN + 100) {
      pageNum++;
      currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      pages.push(currentPage);
      y = A4_HEIGHT - MARGIN;
      y = await addHeader(currentPage, font, boldFont, title, y);
      y -= 20;
      y = drawTableHeader(currentPage, y);
    }
    
    const maskedCard = maskCardNumber(person.cardNumber);
    let x = MARGIN;
    
    // Fundo da linha
    currentPage.drawRectangle({
      x: MARGIN,
      y: y - rowHeight,
      width: CONTENT_WIDTH,
      height: rowHeight,
      color: rgb(1, 1, 1),
    });
    
    // Dados
    const data = [
      person.name || '—',
      maskedCard || '—',
      person.cpf || '—',
      person.rg || '—',
    ];
    const widths = [colWidths.nome, colWidths.cartao, colWidths.cpf, colWidths.rg];
    
    data.forEach((text, i) => {
      const lines = wrapText(text, font, fontSize, widths[i] - 10);
      let textY = y - 15;
      
      lines.slice(0, 3).forEach((line) => {
        currentPage.drawText(line, {
          x: x + 5,
          y: textY,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        textY -= lineHeight;
      });
      
      // Linha vertical
      currentPage.drawLine({
        start: { x, y },
        end: { x, y: y - rowHeight },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
      });
      
      x += widths[i];
    });
    
    // Última linha vertical
    currentPage.drawLine({
      start: { x: A4_WIDTH - MARGIN, y },
      end: { x: A4_WIDTH - MARGIN, y: y - rowHeight },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    });
    
    // Linha horizontal inferior
    currentPage.drawLine({
      start: { x: MARGIN, y: y - rowHeight },
      end: { x: A4_WIDTH - MARGIN, y: y - rowHeight },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    });
    
    y -= rowHeight;
  }
  
  // Adicionar rodapés
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
  let pageNum = 1;
  const pages: any[] = [currentPage];
  
  // Cabeçalho do documento
  y = await addHeader(currentPage, font, boldFont, title, y);
  y -= 30;
  
  for (const person of people) {
    const maskedCard = maskCardNumber(person.cardNumber);
    const lines = [
      `Nome: ${person.name || '—'}`,
      `Cartão: ${maskedCard || '—'}`,
      `CPF: ${person.cpf || '—'}`,
      `RG: ${person.rg || '—'}`,
    ];
    
    const totalHeight = lines.length * lineHeight + itemSpacing;
    
    if (y - totalHeight < MARGIN + 50) {
      pageNum++;
      currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      pages.push(currentPage);
      y = A4_HEIGHT - MARGIN;
      y = await addHeader(currentPage, font, boldFont, title, y);
      y -= 30;
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
  
  // Adicionar rodapés
  pages.forEach((page, i) => {
    addFooter(page, font, i + 1, pages.length);
  });
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
  let pageNum = 1;
  const pages: any[] = [currentPage];
  
  // Cabeçalho do documento
  y = await addHeader(currentPage, font, boldFont, title, y);
  y -= 30;
  
  for (const person of people) {
    const totalHeight = 20 + signatureHeight + itemSpacing;
    
    if (y - totalHeight < MARGIN + 50) {
      pageNum++;
      currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      pages.push(currentPage);
      y = A4_HEIGHT - MARGIN;
      y = await addHeader(currentPage, font, boldFont, title, y);
      y -= 30;
    }
    
    // Nome
    currentPage.drawText(person.name || '(sem nome)', {
      x: MARGIN,
      y,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    y -= 25;
    
    // Linha para assinatura
    currentPage.drawLine({
      start: { x: MARGIN, y },
      end: { x: A4_WIDTH - MARGIN, y },
      thickness: 0.5,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    y -= signatureHeight + itemSpacing;
  }
  
  // Adicionar rodapés
  pages.forEach((page, i) => {
    addFooter(page, font, i + 1, pages.length);
  });
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
    case 'table':
      await generateTablePDF(pdfDoc, people, title, font, boldFont);
      break;
    case 'continuous':
      await generateContinuousPDF(pdfDoc, people, title, font, boldFont);
      break;
    case 'signatures':
      await generateSignaturesPDF(pdfDoc, people, title, font, boldFont);
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
  
  return `${sanitizedTitle}-${dateStr}-${timeStr}.pdf`;
}
