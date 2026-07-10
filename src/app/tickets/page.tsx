'use client';

import PageLayout from '@/app/genericLayout';
import { Badge, Button, Card, Image, NumberInput, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Event, events } from '../data';
import { sortEventsByDate } from '../lib/eventSorting';
import { getCurrentUser, getCustomEvents, getRemovedBaseEventIds, StoredUser } from '../lib/localStore';
import styles from './tickets.module.css';

type DisplayEvent = Omit<Event, 'id'> & {
  id: string;
};

const baseEvents: DisplayEvent[] = sortEventsByDate(events.map((event) => ({
  ...event,
  id: String(event.id),
})));

type TicketStatus = {
  actionLabel: string;
  canReserve: boolean;
  price: number;
  summary: string;
  type: 'paid' | 'free' | 'none';
};

type TicketReservation = {
  eventId: string;
  eventTitle: string;
  quantity: number;
  total: number;
};

type ReservedTicketItem = DisplayEvent & {
  quantity: number;
  total: number;
  unitPrice: number;
};

function getReservationKey(username: string): string {
  return `tenterden-ticket-reservations-${username}`;
}

function readReservations(username: string): Record<string, TicketReservation> {
  try {
    const value = window.localStorage.getItem(getReservationKey(username));
    return value ? (JSON.parse(value) as Record<string, TicketReservation>) : {};
  } catch {
    return {};
  }
}

function writeReservations(username: string, reservations: Record<string, TicketReservation>): void {
  window.localStorage.setItem(getReservationKey(username), JSON.stringify(reservations));
}

function getReservationTotals(reservations: Record<string, TicketReservation>): { quantity: number; total: number } {
  return Object.values(reservations).reduce(
    (totals, reservation) => ({
      quantity: totals.quantity + reservation.quantity,
      total: totals.total + reservation.total,
    }),
    { quantity: 0, total: 0 },
  );
}

function cleanQuantity(quantity: number): number {
  return Math.min(Math.max(Math.round(quantity), 1), 10);
}

function getTicketStatus(ticketPrice: string): TicketStatus {
  const lowerTicketPrice = ticketPrice.toLowerCase();

  if (lowerTicketPrice.includes('no ticket') || lowerTicketPrice.includes('no tickets')) {
    return {
      actionLabel: 'No ticket needed',
      canReserve: false,
      price: 0,
      summary: 'You can attend this event without booking a ticket.',
      type: 'none',
    };
  }

  if (lowerTicketPrice === 'free') {
    return {
      actionLabel: 'Reserve free ticket',
      canReserve: true,
      price: 0,
      summary: 'Free entry. Reserve a place so it appears in your ticket list.',
      type: 'free',
    };
  }

  const priceMatch = /^£\s*(\d+(?:\.\d{1,2})?)$/.exec(ticketPrice.trim());
  const price = priceMatch ? Number(priceMatch[1]) : 0;

  return {
    actionLabel: 'Reserve tickets',
    canReserve: price > 0,
    price,
    summary: price > 0 ? 'Select a quantity below to reserve tickets.' : 'Ticket price unavailable.',
    type: 'paid',
  };
}

export default function Tickets(): ReactNode {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StoredUser | null | undefined>(undefined);
  const [eventsData, setEventsData] = useState<DisplayEvent[]>(baseEvents);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reservations, setReservations] = useState<Record<string, TicketReservation>>({});
  const [ticketPdfUrl, setTicketPdfUrl] = useState<string | null>(null);
  const [isGeneratingTickets, setIsGeneratingTickets] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(`/tickets${window.location.hash}`)}`);
      return;
    }

    const removedEventIds = getRemovedBaseEventIds();
    const nextEvents = sortEventsByDate([
      ...baseEvents.filter((event) => !removedEventIds.includes(event.id)),
      ...getCustomEvents(),
    ]);
    const availableEventIds = nextEvents.map((event) => event.id);
    const savedReservations = Object.fromEntries(
      Object.entries(readReservations(user.username)).filter(([eventId]) => availableEventIds.includes(eventId)),
    );

    setCurrentUser(user);
    setEventsData(nextEvents);
    setReservations(savedReservations);
    setQuantities(Object.fromEntries(
      Object.entries(savedReservations).map(([eventId, reservation]) => [eventId, reservation.quantity]),
    ));
    writeReservations(user.username, savedReservations);
  }, [router]);

  function updateQuantity(eventId: string, quantity: string | number): void {
    const nextQuantity = typeof quantity === 'number' ? quantity : Number(quantity);

    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [eventId]: Number.isFinite(nextQuantity) ? cleanQuantity(nextQuantity) : 1,
    }));
    setTicketPdfUrl(null);
    setMessage('');
  }

  function handleReserve(event: DisplayEvent, ticketStatus: TicketStatus): void {
    if (!currentUser) {
      return;
    }

    const quantity = cleanQuantity(quantities[event.id] ?? 1);
    const ticketWord = quantity === 1 ? 'ticket' : 'tickets';
    const reservation: TicketReservation = {
      eventId: event.id,
      eventTitle: event.title,
      quantity,
      total: ticketStatus.price * quantity,
    };

    const nextReservations = {
      ...reservations,
      [event.id]: reservation,
    };
    const reservationTotals = getReservationTotals(nextReservations);

    setReservations(nextReservations);
    writeReservations(currentUser.username, nextReservations);
    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [event.id]: quantity,
    }));
    setTicketPdfUrl(null);

    if (ticketStatus.type === 'free') {
      setMessage(`${quantity} free ${ticketWord} reserved for ${event.title}.`);
      return;
    }

    setMessage(`${quantity} ${ticketWord} reserved for ${event.title}. Order total: £${reservationTotals.total.toFixed(2)}.`);
  }

  function getReservedTicketItems(): ReservedTicketItem[] {
    return eventsData
      .filter((event) => reservations[event.id])
      .map((event) => {
        const reservation = reservations[event.id];
        const ticketStatus = getTicketStatus(event.ticketPrice);

        return {
          ...event,
          quantity: reservation.quantity,
          total: reservation.total,
          unitPrice: ticketStatus.price,
        };
      });
  }

  function handleGenerateTicketPdf(): void {
    const reservedTicketItems = getReservedTicketItems();

    if (reservedTicketItems.length === 0) {
      return;
    }

    setIsGeneratingTickets(true);
    setMessage('');

    const ticketsUrl = new URL('/api/tickets', window.location.origin);
    ticketsUrl.searchParams.set('tickets', JSON.stringify(reservedTicketItems));
    setTicketPdfUrl(ticketsUrl.toString());
    setIsGeneratingTickets(false);
  }

  async function handleCopyTicketPdfLink(): Promise<void> {
    if (!ticketPdfUrl) {
      return;
    }

    await navigator.clipboard.writeText(ticketPdfUrl);
    setMessage('Ticket PDF link copied.');
  }

  if (currentUser === undefined) {
    return (
      <PageLayout>
        <main className={styles.page}>
          <Card shadow="sm" radius="md" withBorder className={styles.accessCard}>
            <p className={styles.message}>Checking your login...</p>
          </Card>
        </main>
      </PageLayout>
    );
  }

  const reservationTotals = getReservationTotals(reservations);
  const hasReservations = reservationTotals.quantity > 0;
  const reservedTicketItems = getReservedTicketItems();

  return (
    <PageLayout>
      <main className={styles.page}>
        <section className={styles.header}>
          <div>
            <h2>Tickets</h2>
            <p>
              Reserve tickets for festival events from one place.
            </p>
          </div>
          <Button component="a" href="/events" variant="light" className={styles.backButton}>
            Back to events
          </Button>
        </section>

        {hasReservations && (
          <section className={styles.orderSummary}>
            <div className={styles.summaryHeader}>
              <div>
                <span className={styles.ticketLabel}>Your reserved tickets</span>
                <h3>Ticket total</h3>
                <p>{reservationTotals.quantity} {reservationTotals.quantity === 1 ? 'ticket' : 'tickets'} reserved</p>
              </div>
              <strong>Order total: £{reservationTotals.total.toFixed(2)}</strong>
            </div>

            <div className={styles.summaryList}>
              {reservedTicketItems.map((item) => (
                <div key={item.id} className={styles.summaryRow}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.date} at {item.time}</p>
                  </div>
                  <span>{item.quantity} x {item.unitPrice > 0 ? `£${item.unitPrice.toFixed(2)}` : 'Free'}</span>
                  <strong>£{item.total.toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className={styles.summaryActions}>
              <Button
                className={styles.button}
                loading={isGeneratingTickets}
                onClick={handleGenerateTicketPdf}
              >
                Generate ticket PDF
              </Button>
              {ticketPdfUrl && (
                <>
                  <Button component="a" href={ticketPdfUrl} target="_blank" variant="light" className={styles.secondaryButton}>
                    Open PDF
                  </Button>
                  <Button component="a" href={ticketPdfUrl} download="tenterden-tickets.pdf" variant="light" className={styles.secondaryButton}>
                    Download
                  </Button>
                  <Button variant="light" className={styles.secondaryButton} onClick={handleCopyTicketPdfLink}>
                    Copy link
                  </Button>
                </>
              )}
            </div>
          </section>
        )}

        <Stack gap="lg">
          {eventsData.map((event) => {
            const ticketStatus = getTicketStatus(event.ticketPrice);
            const quantity = cleanQuantity(quantities[event.id] ?? 1);
            const reservation = reservations[event.id];
            const total = ticketStatus.price * quantity;

            return (
              <Card
                id={`event-${event.id}`}
                key={event.id}
                shadow="sm"
                radius="md"
                withBorder
                className={styles.ticketCard}
              >
                {event.image && (
                  <Image
                    src={event.image}
                    alt=""
                    className={styles.eventImage}
                    radius="md"
                    fit="cover"
                  />
                )}

                <div className={styles.cardContent}>
                  <div>
                    <div className={styles.badgeRow}>
                      <Badge variant="light" color="yellow" className={styles.badge}>
                        {event.venue}
                      </Badge>
                      <Badge variant="light" color="gray" className={styles.badge}>
                        {event.time}
                      </Badge>
                    </div>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.date}>{event.date}</p>
                  </div>

                  <div className={styles.ticketInfo}>
                    <span className={styles.ticketLabel}>Ticket information</span>
                    <p>{event.ticketPrice}</p>
                    <p className={styles.ticketSummary}>{ticketStatus.summary}</p>
                  </div>

                  <div className={styles.actions}>
                    {ticketStatus.canReserve ? (
                      <>
                        <NumberInput
                          className={styles.quantity}
                          label="Quantity"
                          min={1}
                          max={10}
                          step={1}
                          allowDecimal={false}
                          value={quantity}
                          onChange={(value) => updateQuantity(event.id, value)}
                        />
                        {ticketStatus.type === 'paid' && (
                          <p className={styles.total}>Event total: £{total.toFixed(2)}</p>
                        )}
                        <Button className={styles.button} onClick={() => handleReserve(event, ticketStatus)}>
                          {ticketStatus.actionLabel}
                        </Button>
                        {reservation && (
                          <p className={styles.reserved}>
                            Reserved: {reservation.quantity} {reservation.quantity === 1 ? 'ticket' : 'tickets'}
                          </p>
                        )}
                      </>
                    ) : (
                      <Button disabled className={styles.button}>
                        {ticketStatus.actionLabel}
                      </Button>
                    )}
                    {!event.id.startsWith('custom-') && (
                      <Button component="a" href={`/events/${event.id}`} variant="light" className={styles.secondaryButton}>
                        Event details
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </Stack>
        {message && <p className={styles.message}>{message}</p>}
      </main>
    </PageLayout>
  );
}
