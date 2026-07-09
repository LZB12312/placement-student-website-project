'use client';

import PageLayout from '@/app/genericLayout';
import { ReactNode, useState } from 'react';
import { events } from '../data';
import { Accordion, Badge, Button, Card, Checkbox, Image, Stack } from '@mantine/core';
import Link from 'next/link';
import styles from './events.module.css';

export default function Events(): ReactNode {
  const eventsData = events;
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [likedEventIds, setLikedEventIds] = useState<number[]>([]);
  const selectedCount = likedEventIds.length;

  function handleLikeChange(eventId: number, checked: boolean): void {
    setPdfUrl(null);
    setCopyStatus('');
    setLikedEventIds((currentIds) => {
      if (checked) {
        return currentIds.includes(eventId) ? currentIds : [...currentIds, eventId];
      }

      return currentIds.filter((currentId) => currentId !== eventId);
    });
  }

  function handleGenerateItinerary(): void {
    if (selectedCount === 0) {
      return;
    }

    setIsGenerating(true);
    setCopyStatus('');

    const itineraryUrl = new URL('/api/itinerary', window.location.origin);
    itineraryUrl.searchParams.set('events', likedEventIds.join(','));
    setPdfUrl(itineraryUrl.toString());
    setIsGenerating(false);
  }

  async function handleCopyLink(): Promise<void> {
    if (!pdfUrl) {
      return;
    }

    await navigator.clipboard.writeText(pdfUrl);
    setCopyStatus('Link copied');
  }

  return (
    <PageLayout>
      <div className={styles.eventsPage}>
        <Stack justify='flex-start' align='stretch' gap='xl' w='100%' className={styles.eventsContent}>
          <h2>Events</h2>
          <div className={styles.eventsList}>
            {eventsData.map((event) => (
              <div key={event.id} className={styles.event}>
                <div className={styles.cardRow}>
                  <Card shadow="sm" p="lg" radius="md" withBorder className={styles.card}>
                    <Accordion variant="separated" radius="md">
                      <Accordion.Item value={event.title}>
                        <div className={styles.eventHeader}>
                          <div className={styles.summary}>
                            {event.image && (
                              <Image
                                src={event.image}
                                className={styles.thumbnail}
                                w={120}
                                h={120}
                                radius="md"
                                fit="cover"
                              />
                            )}

                            <div className={styles.summaryContent}>
                              <h3 className={styles.title}>
                                <Link
                                  href={`/events/${event.id}`}
                                  className={styles.titleLink}
                                >
                                  {event.title}
                                </Link>
                              </h3>
                              <div className={styles.badgeRow}>
                                <Badge variant="light" color="yellow" className={styles.badge}>
                                  {event.venue}
                                </Badge>
                                <Badge variant="light" color="gray" className={styles.badge}>
                                  {event.time}
                                </Badge>
                              </div>
                              <p className={styles.date}>{event.date}</p>
                            </div>
                          </div>

                          <div className={styles.rightControls}>
                            <div className={styles.checkboxWrap}>
                              <span className={styles.checkboxLabel}>Like</span>
                              <Checkbox
                                aria-label={`Like ${event.title}`}
                                checked={likedEventIds.includes(event.id)}
                                className={styles.checkbox}
                                onChange={(changeEvent) => handleLikeChange(event.id, changeEvent.currentTarget.checked)}
                              />
                            </div>
                            <Accordion.Control
                              aria-label={`Show details for ${event.title}`}
                              className={styles.control}
                            />
                          </div>
                        </div>

                        <Accordion.Panel className={styles.panel}>
                          <p><strong>Ticket Price: {event.ticketPrice}</strong></p>




                          
                          <p><strong>Date: {event.date}</strong></p>
                          <p>{event.description}</p>
                          <div className={styles.buttonRow}>
                            <Button
                              component={Link}
                              className={styles.button}
                              href={`/tickets#event-${event.id}`}
                            >
                              Tickets
                            </Button>
                          </div>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </Card>
                </div>
              </div>
            ))}
          </div>
          <section className={styles.itinerarySection}>
            <div>
              <h3 className={styles.itineraryTitle}>Create your event PDF</h3>
              <p className={styles.itineraryText}>
                Build your perfect day at Tenterden from the events you have liked.
              </p>
            </div>
            <div className={styles.itineraryActions}>
              <Button
                className={styles.itineraryButton}
                disabled={selectedCount === 0}
                loading={isGenerating}
                onClick={handleGenerateItinerary}
              >
                Generate Your itinerary
              </Button>
              {selectedCount === 0 && (
                <p className={styles.copyStatus}>Like at least one event to generate your itinerary.</p>
              )}
              {pdfUrl && (
                <div className={styles.linkActions}>
                  <Button component="a" href={pdfUrl} target="_blank" variant="light">
                    Open PDF
                  </Button>
                  <Button component="a" href={pdfUrl} download="tenterden-events-itinerary.pdf" variant="light">
                    Download
                  </Button>
                  <Button variant="light" onClick={handleCopyLink}>
                    Copy link
                  </Button>
                </div>
              )}
              {copyStatus && <p className={styles.copyStatus}>{copyStatus}</p>}
            </div>
          </section>
        </Stack>
      </div>
    </PageLayout>
  );
}
