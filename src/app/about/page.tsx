'use client';

import PageLayout from '@/app/genericLayout';
import { ReactNode } from 'react';
import { Card, Image } from '@mantine/core';
import styles from './about.module.css';

export default function Events(): ReactNode {
  return (
    <PageLayout>
      <main className={styles.page}>
        <section className={styles.header}>
          <div>
            <h2>Who we are and what we do</h2>
            <p>
              We preserve, share, and celebrate folk traditions through education, events, publications, and community projects.
            </p>
          </div>
          <Image
            src="/images/ff-singer.jpg"
            alt=""
            className={styles.headerImage}
            radius="md"
            fit="cover"
          />
        </section>

        <section className={styles.sectionGrid}>
          <Card shadow="sm" radius="md" withBorder className={styles.card}>
            <h3>The Trust</h3>
            <p>
              Tenterden Folk Day Trust is a registered charity formed in May 1994 to preserve and advance public education and appreciation of traditional and contemporary folk song, music, dance, traditions, crafts and folk arts as a part of the living heritage.
            </p>
            <p>
              The Trust is supported by Tenterden Town Council, Ashford Borough Council and Kent County Council and a number of local and regional businesses and other community organisations.
            </p>
          </Card>

          <Card shadow="sm" radius="md" withBorder className={styles.card}>
            <h3>Musical and Heritage Policy</h3>
            <p>
              The emphasis of our musical policy remains very much on traditional English folk song, music, and dance. This is complemented by traditional crafts, folklore and traditions.
            </p>
            <p>
              Traditional folk music develops and changes, so we do not exclude contemporary material in a traditional style or performers who bring in experience of other musical styles or influences.
            </p>
            <p>
              We draw many of our guests from South East England, particularly Kent and Sussex, and also include guests well known on the national folk scene.
            </p>
          </Card>
        </section>

        <section className={styles.affiliation}>
          <p>
            The Trust is affiliated to the English Folk Dance and Song Society and a member of The Ashford Federation of the Arts, The Association of Festival Organisers, and Produced in Kent. It is registered with The Fundraising Regulator.
          </p>
        </section>

        <section className={styles.projects}>
          <h2>Projects We're Involved With</h2>
          <div className={styles.projectGrid}>
            <Card shadow="sm" radius="md" withBorder className={styles.card}>
              <h3>Educational Projects</h3>
              <p>
                The Trust organises various educational projects in local schools. Most recently the Trust has been working with the students at Wyvern School in Ashford but has worked in many schools across the South East.
              </p>
            </Card>

            <Card shadow="sm" radius="md" withBorder className={styles.card}>
              <h3>Around Kent Folk</h3>
              <p>
                The Trust publishes Around Kent Folk magazine, a bi-monthly free guide to folk events in Kent, Surrey, Sussex and beyond.
              </p>
            </Card>

            <Card shadow="sm" radius="md" withBorder className={styles.card}>
              <h3>Tenterden Folk Festival</h3>
              <p>
                The annual Tenterden Folk Festival ran for over 30 years, with concerts, dances, storytelling, craft fairs, exhibitions, workshops, processions, street theatre, music sessions, and other folk events.
              </p>
            </Card>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
