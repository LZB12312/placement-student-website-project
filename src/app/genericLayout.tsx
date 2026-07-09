'use client';

import { Flex, Image, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import NavBar from './components/navBar';
import './styles/global.css';
import Footer from './components/footer';
import { getCurrentUser, StoredUser } from './lib/localStore';
import styles from './layout.module.css';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  return (
    <Stack>
      <Flex
        justify='space-between'
        align='center'
        className={styles.header}
      >
        <Flex
          align='center'
          gap='1rem'
        >
          <Image
            h={50}
            w='auto'
            fit='contain'
            src='/images/logo.jpg'
          />

          <h1>Tenterden Folk Day Trust</h1>
        </Flex>
        {currentUser && (
          <div className={styles.userBadge}>
            Signed in as <strong>{currentUser.username}</strong>
          </div>
        )}
      </Flex>
      <NavBar />
      {children}
      <Footer />
    </Stack>
  );
}
