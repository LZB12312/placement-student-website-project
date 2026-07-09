'use client';

import PageLayout from '@/app/genericLayout';
import { Button, Card, Textarea, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { Event, events } from '../data';
import {
  addCustomEvent,
  getCurrentUser,
  getCustomEvents,
  getRemovedBaseEventIds,
  removeEvent,
  StoredUser,
} from '../lib/localStore';
import styles from './admin.module.css';

const emptyForm = {
  title: '',
  date: '',
  time: '',
  venue: '',
  ticketPrice: '',
  ticketLink: '',
  description: '',
  image: '',
};

type DisplayEvent = Omit<Event, 'id'> & {
  id: string;
};

const baseEvents: DisplayEvent[] = events.map((event) => ({
  ...event,
  id: String(event.id),
}));

export default function Admin(): ReactNode {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [eventsData, setEventsData] = useState<DisplayEvent[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  function loadEvents(): void {
    const removedEventIds = getRemovedBaseEventIds();
    setEventsData([
      ...baseEvents.filter((event) => !removedEventIds.includes(event.id)),
      ...getCustomEvents(),
    ]);
  }

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (!user || user.role !== 'admin') {
      setMessage('You need to login as an admin to add events.');
      return;
    }

    loadEvents();
  }, []);

  function updateField(field: keyof typeof emptyForm, value: string): void {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }

    if (!form.title || !form.date || !form.time || !form.venue || !form.ticketPrice || !form.description) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const newEvent = addCustomEvent({
      ...form,
      ticketLink: form.ticketLink || undefined,
      image: form.image || '/images/ff-singer.jpg',
    });
    setForm(emptyForm);
    setEventsData((currentEvents) => [...currentEvents, newEvent]);
    setMessage('Event added. It will now appear on the Events and Tickets pages in this browser.');
  }

  function handleRemoveEvent(eventToRemove: DisplayEvent): void {
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }

    const confirmed = window.confirm(`Remove "${eventToRemove.title}" from the Events and Tickets pages?`);

    if (!confirmed) {
      return;
    }

    removeEvent(eventToRemove.id);
    setEventsData((currentEvents) => currentEvents.filter((event) => event.id !== eventToRemove.id));
    setMessage(`Removed "${eventToRemove.title}" from the Events and Tickets pages in this browser.`);
  }

  return (
    <PageLayout>
      <main className={styles.page}>
        <section className={styles.header}>
          <h2>Admin</h2>
          <p>Add new events to the local event list or remove existing ones.</p>
        </section>

        {(!currentUser || currentUser.role !== 'admin') ? (
          <Card shadow="sm" radius="md" withBorder className={`${styles.card} ${styles.accessCard}`}>
            <p className={styles.message}>You need to login as an admin to add events.</p>
            <div className={styles.actions}>
              <Button component="a" href="/login" className={styles.button}>
                Login
              </Button>
            </div>
          </Card>
        ) : (
          <div className={styles.adminGrid}>
            <Card shadow="sm" radius="md" withBorder className={styles.card}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <TextInput
                  required
                  label="Band or event name"
                  value={form.title}
                  onChange={(event) => updateField('title', event.currentTarget.value)}
                />
                <div className={styles.grid}>
                  <TextInput
                    required
                    label="Date"
                    placeholder="Saturday 22nd August 2026"
                    value={form.date}
                    onChange={(event) => updateField('date', event.currentTarget.value)}
                  />
                  <TextInput
                    required
                    label="Time"
                    placeholder="7pm"
                    value={form.time}
                    onChange={(event) => updateField('time', event.currentTarget.value)}
                  />
                </div>
                <TextInput
                  required
                  label="Location"
                  value={form.venue}
                  onChange={(event) => updateField('venue', event.currentTarget.value)}
                />
                <div className={styles.grid}>
                  <TextInput
                    required
                    label="Ticket information"
                    placeholder="£5 or No ticket needed"
                    value={form.ticketPrice}
                    onChange={(event) => updateField('ticketPrice', event.currentTarget.value)}
                  />
                  <TextInput
                    label="Ticket link"
                    placeholder="https://..."
                    value={form.ticketLink}
                    onChange={(event) => updateField('ticketLink', event.currentTarget.value)}
                  />
                </div>
                <TextInput
                  label="Image path"
                  placeholder="/images/ff-singer.jpg"
                  value={form.image}
                  onChange={(event) => updateField('image', event.currentTarget.value)}
                />
                <Textarea
                  required
                  minRows={4}
                  label="Description"
                  value={form.description}
                  onChange={(event) => updateField('description', event.currentTarget.value)}
                />
                <div className={styles.actions}>
                  <Button type="submit" className={styles.button}>
                    Add event
                  </Button>
                  <Button component="a" href="/login" variant="light">
                    Login page
                  </Button>
                </div>
              </form>
            </Card>

            <Card shadow="sm" radius="md" withBorder className={styles.card}>
              <div className={styles.manageHeader}>
                <h3>Manage events</h3>
                <p>Remove events from the Events and Tickets pages.</p>
              </div>

              <div className={styles.eventList}>
                {eventsData.length === 0 ? (
                  <p className={styles.emptyState}>There are no events to remove.</p>
                ) : (
                  eventsData.map((event) => (
                    <div key={event.id} className={styles.eventRow}>
                      <div>
                        <h4>{event.title}</h4>
                        <p>{event.date} - {event.venue}</p>
                      </div>
                      <Button color="red" variant="light" onClick={() => handleRemoveEvent(event)}>
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}
        {currentUser?.role === 'admin' && message && <p className={styles.message}>{message}</p>}
      </main>
    </PageLayout>
  );
}
