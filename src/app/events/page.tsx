'use client';

import PageLayout from '@/app/genericLayout';
import { ReactNode } from 'react';
import { events } from '../data';
import { Badge, Button, Checkbox, Image, List, Stack, Accordion, Card } from '@mantine/core';
import styles from './events.module.css';

export default function Events(): ReactNode {
  const eventsData = events;
  return (
    <PageLayout>
      <Stack justify='flex-start' align='stretch' gap='xl' w='100%'>
        <h2>Events</h2>
        <List type='unordered' w='100%'>
          {eventsData.map((event) => (
            <List.Item
              key={event.title}
              className={styles.event}
            >
              <div className={styles.cardRow}>
                <Card shadow="sm" p="lg" radius="md" withBorder className={styles.card}>
                  <Accordion variant="separated" radius="md">
                    <Accordion.Item value={event.title}>
                      <Accordion.Control className={styles.control}>
                        <div className={styles.controlContent}>
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

              r              <div className={styles.summaryContent}>
                              <h3 className={styles.title}>{event.title}</h3>
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
                            <div
                            
                              className={styles.checkboxWrap}
                              onClick={(event) => event.stopPropagation()}
                              onMouseDown={(event) => event.stopPropagation()}
                            >
                              <span className={styles.checkboxLabel}>Like</span>
                              <Checkbox aria-label="Like" className={styles.checkbox} />
                            </div>
                          </div>
                        </div>
                      </Accordion.Control>

                      <Accordion.Panel className={styles.panel}>
                        <p><strong>Ticket Price: {event.ticketPrice}</strong></p>
                        <p><strong>Date: {event.date}</strong></p>
                        <p>{event.description}</p>
                        <div className={styles.buttonRow}>
                          <Button
                            component='a'
                            className={styles.button}
                            href={event.ticketLink}
                          >
                            Tickets
                          </Button>
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Card>
              </div>
            </List.Item>
          ))}
        </List>
      </Stack>
    </PageLayout>
  );
}
