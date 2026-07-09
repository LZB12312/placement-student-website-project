'use client';

import { Flex, NavLink } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { getCurrentUser, StoredUser } from '../lib/localStore';
import styles from './navBar.module.css';

export default function NavBar(): ReactNode {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const primaryLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Tickets', href: '/tickets' },
  ];
  const accountLinks = [
    ...(currentUser?.role === 'admin' ? [{ label: 'Admin', href: '/admin' }] : []),
    { label: currentUser ? 'Account' : 'Login', href: '/login' },
  ];

  const path = usePathname();

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, [path]);

  return (
    <Flex className={styles.navBar}>
      <Flex className={styles.primaryLinks}>
        {primaryLinks.map((item) => (
          <NavLink
            key={item.label}
            className={styles.navLink}
            href={item.href}
            active={path === item.href}
            label={item.label}
          />
        ))}
      </Flex>
      <Flex className={styles.accountLinks}>
        {accountLinks.map((item) => (
          <NavLink
            key={item.label}
            className={styles.navLink}
            href={item.href}
            active={path === item.href}
            label={item.label}
          />
        ))}
      </Flex>
    </Flex>
  );
}
