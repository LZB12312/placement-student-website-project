'use client';

import PageLayout from '@/app/genericLayout';
import { Button, Card, Image } from '@mantine/core';
import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  return (
    <PageLayout>
      <main className={styles.page}>
        <section className={styles.hero}>
          <Image
            src="/images/welcome.jpg"
            alt=""
            className={styles.heroImage}
            fit="cover"
          />
          <div className={styles.heroContent}>
            <h2>Tenterden Folk Day Trust</h2>
            <p>
              Preserving and celebrating folk song, music, dance, traditions, crafts, and folk arts as part of our living heritage.
            </p>
            <div className={styles.actions}>
              <Button component={Link} href="/events" className={styles.primaryButton}>
                View events
              </Button>
              <Button component={Link} href="/about" variant="light" className={styles.secondaryButton}>
                About the trust
              </Button>
            </div>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <Card shadow="sm" radius="md" withBorder className={styles.infoCard}>
            <h3>The Trust</h3>
            <p>
              Tenterden Folk Day Trust is a registered charity formed in May 1994 to preserve and advance public education and appreciation of traditional and contemporary folk song, music, dance, traditions, crafts and folk arts.
            </p>
          </Card>
          <Card shadow="sm" radius="md" withBorder className={styles.infoCard}>
            <h3>Community Support</h3>
            <p>
              The Trust is supported by Tenterden Town Council, Ashford Borough Council, Kent County Council, and a number of local and regional businesses and community organisations.
            </p>
          </Card>
        </section>
      </main>
    </PageLayout>
  );
}
