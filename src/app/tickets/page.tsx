'use client';

import PageLayout from '@/app/genericLayout';
import { Badge, Button, Card, Image, Stack } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import { Event, events } from '../data';
import { getCustomEvents } from '../lib/localStore';
import styles from './tickets.module.css';

type DisplayEvent = Omit<Event, 'id'> & {
  id: string;
};

const baseEvents: DisplayEvent[] = events.map((event) => ({
  ...event,
  id: String(event.id),
}));

function normaliseTicketLink(link?: string): string | undefined {
  if (!link) {
    return undefined;
  }

  return link.startsWith('http') ? link : `https://${link}`;
}

export default function Tickets(): ReactNode {
  const [eventsData, setEventsData] = useState<DisplayEvent[]>(baseEvents);

  useEffect(() => {
    setEventsData([...baseEvents, ...getCustomEvents()]);
  }, []);

  return (
    <PageLayout>
      <main className={styles.page}>
        <section className={styles.header}>
          <div>
            <h2>Tickets</h2>
            <p>
              Find ticket details for each event and book paid events from one place.
            </p>
          </div>
          <Button component="a" href="/events" variant="light" className={styles.backButton}>
            Back to events
          </Button>
        </section>

        <Stack gap="lg">
          {eventsData.map((event) => {
            const ticketLink = normaliseTicketLink(event.ticketLink);

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
                  </div>

                  <div className={styles.actions}>
                    {ticketLink ? (
                      <Button component="a" href={ticketLink} target="_blank" rel="noreferrer" className={styles.button}>
                        Book tickets
                      </Button>
                    ) : (
                      <Button disabled className={styles.button}>
                        No ticket needed
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
      </main>
    </PageLayout>
  );
}
