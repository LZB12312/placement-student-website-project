import { Stack } from '@mantine/core';
import { ReactNode } from 'react';
import styles from './simpleTextBlock.module.css';

export default function SimpleTextBlock({ title, text }: { title?: string; text: string }): ReactNode {
  return (
    <Stack className={styles.container}>
      {title && <h3>{title}</h3>}
      <p>{text}</p>
    </Stack>
  );
}
