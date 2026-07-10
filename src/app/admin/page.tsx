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
import { sortEventsByDate } from '../lib/eventSorting';
import styles from './admin.module.css';

const emptyForm = {
  title: '',
  date: '',
  time: '',
  venue: '',
  ticketPrice: '',
  description: '',
  image: '',
};

type DisplayEvent = Omit<Event, 'id'> & {
  id: string;
};

type FormErrors = Partial<Record<keyof typeof emptyForm, string>>;

const baseEvents: DisplayEvent[] = sortEventsByDate(events.map((event) => ({
  ...event,
  id: String(event.id),
})));

const ordinalRules = new Intl.PluralRules('en-GB', { type: 'ordinal' });
const ordinalSuffixes = new Map<Intl.LDMLPluralRule, string>([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);

function formatEventDate(dateValue: string): string {
  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
  const monthName = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
  const suffix = ordinalSuffixes.get(ordinalRules.select(day)) ?? 'th';

  return `${weekday} ${day}${suffix} ${monthName} ${year}`;
}

function formatEventTime(timeValue: string): string {
  const [hourValue, minuteValue] = timeValue.split(':').map(Number);
  const suffix = hourValue >= 12 ? 'pm' : 'am';
  const hour = hourValue % 12 || 12;

  return minuteValue === 0 ? `${hour}${suffix}` : `${hour}:${String(minuteValue).padStart(2, '0')}${suffix}`;
}

function isValidDateValue(dateValue: string): boolean {
  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);

  if (!dateParts) {
    return false;
  }

  const [, yearValue, monthValue, dayValue] = dateParts;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day
  );
}

function isValidTimeValue(timeValue: string): boolean {
  const timeParts = /^(\d{2}):(\d{2})$/.exec(timeValue);

  if (!timeParts) {
    return false;
  }

  const [, hourValue, minuteValue] = timeParts;
  const hour = Number(hourValue);
  const minute = Number(minuteValue);

  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function normalizeTicketPrice(ticketPrice: string): string | null {
  const trimmedTicketPrice = ticketPrice.trim();
  const lowerTicketPrice = trimmedTicketPrice.toLowerCase();

  if (lowerTicketPrice === 'free') {
    return 'Free';
  }

  if (
    lowerTicketPrice === 'no ticket needed'
    || lowerTicketPrice === 'no tickets needed'
    || lowerTicketPrice === 'no ticket required'
    || lowerTicketPrice === 'no tickets required'
  ) {
    return 'No ticket needed';
  }

  const priceMatch = /^£?\s*(\d+(?:\.\d{1,2})?)$/.exec(trimmedTicketPrice);

  if (!priceMatch) {
    return null;
  }

  const price = Number(priceMatch[1]);

  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }

  return `£${priceMatch[1]}`;
}

export default function Admin(): ReactNode {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [eventsData, setEventsData] = useState<DisplayEvent[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState('');

  function loadEvents(): void {
    const removedEventIds = getRemovedBaseEventIds();
    setEventsData(sortEventsByDate([
      ...baseEvents.filter((event) => !removedEventIds.includes(event.id)),
      ...getCustomEvents(),
    ]));
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
    setFormErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }

    const nextErrors: FormErrors = {};

    if (!form.title || !form.date || !form.time || !form.venue || !form.ticketPrice || !form.description) {
      setMessage('Please fill in all required fields.');
      setFormErrors(nextErrors);
      return;
    }

    if (!isValidDateValue(form.date)) {
      nextErrors.date = 'Choose a real calendar date.';
    }

    if (!isValidTimeValue(form.time)) {
      nextErrors.time = 'Choose a real time.';
    }

    const ticketPrice = normalizeTicketPrice(form.ticketPrice);

    if (!ticketPrice) {
      nextErrors.ticketPrice = 'Enter a price like £5, or use Free / No ticket needed.';
    }

    if (Object.keys(nextErrors).length > 0 || !ticketPrice) {
      setFormErrors(nextErrors);
      setMessage('Please fix the highlighted fields.');
      return;
    }

    const newEvent = addCustomEvent({
      ...form,
      date: formatEventDate(form.date),
      time: formatEventTime(form.time),
      ticketPrice,
      image: form.image || '/images/ff-singer.jpg',
    });
    setForm(emptyForm);
    setFormErrors({});
    setEventsData((currentEvents) => sortEventsByDate([...currentEvents, newEvent]));
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
                    type="date"
                    value={form.date}
                    error={formErrors.date}
                    onChange={(event) => updateField('date', event.currentTarget.value)}
                  />
                  <TextInput
                    required
                    label="Time"
                    type="time"
                    value={form.time}
                    error={formErrors.time}
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
                    placeholder="£5, Free, or No ticket needed"
                    value={form.ticketPrice}
                    error={formErrors.ticketPrice}
                    onChange={(event) => updateField('ticketPrice', event.currentTarget.value)}
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
