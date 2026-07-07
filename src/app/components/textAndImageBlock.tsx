'use client';

import { Grid, Image, Stack } from '@mantine/core';
import { ReactNode } from 'react';
import styles from './textAndImageBlock.module.css';

export default function TextAndImageBlock({ title, text, imageSrc, imageWidth, imageSide }: { title?: string; text: string; imageSrc: string; imageWidth: number; imageSide?: 'left' | 'right' }): ReactNode {
  return (
    <Stack className={styles.container}>
      {title && <h3>{title}</h3>}
      {imageSide !== 'right' ? (
        <Grid>
          <Grid.Col span={imageWidth}>
            <Image src={imageSrc} />
          </Grid.Col>
          <Grid.Col span={12 - imageWidth}>
            <p>{text}</p>
          </Grid.Col>
        </Grid>
      ) : (
        <Grid>
          <Grid.Col span={12 - imageWidth}>
            <p>{text}</p>
          </Grid.Col>
          <Grid.Col span={imageWidth}>
            <Image src={imageSrc} />
          </Grid.Col>
        </Grid>
      )}
    </Stack>
  );
}
