'use client';

import { Burger, Flex, Group, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import styles from './burgerMenu.module.css';

export default function BurgerMenu(): ReactNode {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
  ];

  const path = usePathname();
  const [opened, { toggle }] = useDisclosure();

  return (
    <Group className={styles.wrapper}>
      <Flex className={styles.navBar}>
        <Burger
          lineSize={2}
          size='xl'
          opened={opened}
          onClick={toggle}
          aria-label='Toggle navigation'
        />
      </Flex>
      {opened && (
        <div className={styles.dropdown}>
          {navLinks.map((item, index) => (
            <NavLink
              key={item.label}
              className={styles.navLink}
              href={item.href}
              active={path === item.href}
              label={item.label}
            />
          ))}
        </div>
      )}
    </Group>
  );
}
