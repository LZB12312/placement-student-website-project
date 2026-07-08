import { notFound } from 'next/navigation';
import { events } from '../../data';

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const event = events.find((item) => slugify(item.title) === id || String(item.id) === id);

  if (!event) {
    notFound();
  }

  return (
    <main>
      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Description:</strong> {event.description}</p> 
    </main>
  );
}