'use client';

import PageLayout from '@/app/genericLayout';
import { ReactNode } from 'react';
import { events } from '../data';
import { Button, Image, List, Stack } from '@mantine/core';
import styles from './events.module.css';

export default function Events(): ReactNode {
  const eventsData = events;
  return (
    <PageLayout>
      <Stack justify='center'>
        <h2>Events</h2>
        <List type='unordered'>
          {eventsData.map((event) => (
            <List.Item
              key={event.title}
              className={styles.event}
            >
              <h3>{event.title}</h3>
              <p>{event.date}</p>
              <p>{event.description}</p>

              <Button
                component='a'
                className={styles.button}
                href={event.ticketLink}
              >
                Tickets
              </Button>
              {event.image && (
                <Image
                  className={styles.image}
                  src={event.image}
                  h={300}
                  width={'auto'}
                  fit='contain'
                />
              )}
            </List.Item>
          ))}
        </List>
      </Stack>
    </PageLayout>
  );
}
