import { Event, events } from '@/app/data';
import { jsPDF } from 'jspdf';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

function getImageFormat(imagePath: string): 'JPEG' | 'PNG' {
  return imagePath.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
}

async function getImageDataUrl(imagePath: string): Promise<string | null> {
  try {
    const cleanPath = imagePath.replace(/^\//, '');
    const imageBuffer = await readFile(path.join(process.cwd(), 'public', cleanPath));
    const mimeType = getImageFormat(imagePath) === 'PNG' ? 'image/png' : 'image/jpeg';

    return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
  } catch {
    return null;
  }
}

type PdfEvent = Omit<Event, 'id'> & {
  id: string | number;
};

function getSelectedEventIds(request: Request): number[] {
  const requestUrl = new URL(request.url);
  const eventIds = requestUrl.searchParams.get('events');

  if (!eventIds) {
    return [];
  }

  return eventIds
    .split(',')
    .map((eventId) => Number(eventId))
    .filter((eventId) => Number.isInteger(eventId));
}

function getCustomEvents(request: Request): PdfEvent[] {
  const requestUrl = new URL(request.url);
  const customEvents = requestUrl.searchParams.get('customEvents');

  if (!customEvents) {
    return [];
  }

  try {
    return JSON.parse(customEvents) as PdfEvent[];
  } catch {
    return [];
  }
}

export async function GET(request: Request): Promise<Response> {
  const selectedEventIds = getSelectedEventIds(request);
  const selectedEvents: PdfEvent[] = [
    ...events.filter((event) => selectedEventIds.includes(event.id)),
    ...getCustomEvents(request),
  ];
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const imageSize = 34;
  let y = 22;

  doc.setTextColor(63, 97, 47);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Your Event Itinerary', margin, y);

  y += 14;

  if (selectedEvents.length === 0) {
    doc.setTextColor(70, 70, 70);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('No liked events were selected for this itinerary.', margin, y);
  }

  for (const event of selectedEvents) {
    if (y > pageHeight - 58) {
      doc.addPage();
      y = 22;
    }

    const imageDataUrl = event.image ? await getImageDataUrl(event.image) : null;

    if (imageDataUrl && event.image) {
      doc.addImage(imageDataUrl, getImageFormat(event.image), margin, y, imageSize, imageSize);
    }

    const textX = margin + imageSize + 8;
    const maxTextWidth = pageWidth - textX - margin;

    doc.setTextColor(63, 97, 47);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(event.title, textX, y + 7, { maxWidth: maxTextWidth });

    doc.setTextColor(70, 70, 70);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Date: ${event.date}`, textX, y + 16, { maxWidth: maxTextWidth });
    doc.text(`Time: ${event.time}`, textX, y + 24, { maxWidth: maxTextWidth });
    doc.text(`Location: ${event.venue}`, textX, y + 32, { maxWidth: maxTextWidth });

    y += 44;

    doc.setDrawColor(220, 226, 218);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  }

  return new Response(doc.output('arraybuffer'), {
    headers: {
      'Content-Disposition': 'inline; filename="tenterden-events-itinerary.pdf"',
      'Content-Type': 'application/pdf',
    },
  });
}
