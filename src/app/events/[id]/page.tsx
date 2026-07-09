import PageLayout from '@/app/genericLayout';
import { Badge, Button, Card, Group, Image, Stack } from '@mantine/core';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { events } from '../../data';
import styles from './eventDetail.module.css';

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

  const emailLink = event.contactDetails?.email ? `mailto:${event.contactDetails.email}` : undefined;
  const phoneLink = event.contactDetails?.phone ? `tel:${event.contactDetails.phone}` : undefined;

  return (
    <PageLayout>
      <main className={styles.page}>
        <Link href="/events" className={styles.backLink}>
          Back to events
        </Link>

        <Card shadow="sm" radius="md" withBorder className={styles.heroCard}>
          {event.image && (
            <Image
              src={event.image}
              alt=""
              className={styles.heroImage}
              radius="md"
              fit="cover"
            />
          )}

          <Stack gap="md" className={styles.heroContent}>
            <div>
              <Group gap="sm" className={styles.badgeRow}>
                <Badge variant="light" color="yellow" className={styles.badge}>
                  {event.venue}
                </Badge>
                <Badge variant="light" color="gray" className={styles.badge}>
                  {event.time}
                </Badge>
              </Group>
              <h2 className={styles.title}>{event.title}</h2>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Date</span>
                <strong>{event.date}</strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tickets</span>
                <strong>{event.ticketPrice}</strong>
              </div>
            </div>

            <p className={styles.description}>{event.description}</p>

            <Group gap="sm" className={styles.actions}>
              <Button component="a" href={`/tickets#event-${event.id}`} className={styles.button}>
                Tickets
              </Button>
              {emailLink && (
                <Button component="a" href={emailLink} variant="light" className={styles.secondaryButton}>
                  Email
                </Button>
              )}
              {phoneLink && (
                <Button component="a" href={phoneLink} variant="light" className={styles.secondaryButton}>
                  Call
                </Button>
              )}
            </Group>
          </Stack>
        </Card>
      </main>
    </PageLayout>
  );
}
