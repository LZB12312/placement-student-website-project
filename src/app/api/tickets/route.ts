import { Event } from '@/app/data';
import { jsPDF } from 'jspdf';

export const runtime = 'nodejs';

type PdfTicketItem = Omit<Event, 'id'> & {
  id: string;
  quantity: number;
  total: number;
  unitPrice: number;
};

function getTicketItems(request: Request): PdfTicketItem[] {
  const requestUrl = new URL(request.url);
  const tickets = requestUrl.searchParams.get('tickets');

  if (!tickets) {
    return [];
  }

  try {
    return JSON.parse(tickets) as PdfTicketItem[];
  } catch {
    return [];
  }
}

function getTicketTotals(ticketItems: PdfTicketItem[]): { quantity: number; total: number } {
  return ticketItems.reduce(
    (totals, item) => ({
      quantity: totals.quantity + item.quantity,
      total: totals.total + item.total,
    }),
    { quantity: 0, total: 0 },
  );
}

export async function GET(request: Request): Promise<Response> {
  const ticketItems = getTicketItems(request);
  const ticketTotals = getTicketTotals(ticketItems);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = 22;

  doc.setTextColor(63, 97, 47);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Your Reserved Tickets', margin, y);

  y += 12;
  doc.setTextColor(70, 70, 70);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(
    `${ticketTotals.quantity} ${ticketTotals.quantity === 1 ? 'ticket' : 'tickets'} reserved - Order total: £${ticketTotals.total.toFixed(2)}`,
    margin,
    y,
  );

  y += 14;

  if (ticketItems.length === 0) {
    doc.text('No tickets were selected for this PDF.', margin, y);
  }

  for (const item of ticketItems) {
    for (let ticketNumber = 1; ticketNumber <= item.quantity; ticketNumber += 1) {
      if (y > pageHeight - 54) {
        doc.addPage();
        y = 22;
      }

      doc.setDrawColor(183, 208, 170);
      doc.roundedRect(margin, y, pageWidth - (margin * 2), 42, 2, 2);

      doc.setTextColor(63, 97, 47);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(item.title, margin + 6, y + 9, { maxWidth: pageWidth - (margin * 2) - 12 });

      doc.setTextColor(70, 70, 70);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Ticket ${ticketNumber} of ${item.quantity}`, margin + 6, y + 17);
      doc.text(`Date: ${item.date}`, margin + 6, y + 24, { maxWidth: pageWidth - (margin * 2) - 12 });
      doc.text(`Time: ${item.time}`, margin + 6, y + 31, { maxWidth: pageWidth - (margin * 2) - 12 });
      doc.text(`Location: ${item.venue}`, margin + 6, y + 38, { maxWidth: pageWidth - (margin * 2) - 12 });

      doc.setFont('helvetica', 'bold');
      doc.text(item.unitPrice > 0 ? `£${item.unitPrice.toFixed(2)}` : 'Free', pageWidth - margin - 30, y + 17);

      y += 50;
    }
  }

  return new Response(doc.output('arraybuffer'), {
    headers: {
      'Content-Disposition': 'inline; filename="tenterden-tickets.pdf"',
      'Content-Type': 'application/pdf',
    },
  });
}
