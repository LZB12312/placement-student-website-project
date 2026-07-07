'use client';

import { Flex, NavLink } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import styles from './navBar.module.css';

export default function NavBar(): ReactNode {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
  ];

  const path = usePathname();

  return (
    <Flex className={styles.navBar}>
      {navLinks.map((item) => (
        <NavLink
          key={item.label}
          className={styles.navLink}
          href={item.href}
          active={path === item.href}
          label={item.label}
        />
      ))}
    </Flex>
  );
}
