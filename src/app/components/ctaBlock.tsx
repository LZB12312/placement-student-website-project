import { Flex, Grid, Image, Stack } from '@mantine/core';
import styles from './ctaBlock.module.css';
import Link from 'next/link';

export default function CtaBlock({ title, text, imageSrc, link }: { title?: string; text?: string; imageSrc: string; link: string }) {
  return (
    <Flex
      className={styles.wrapper}
      justify='center'
      align='center'
    >
      <Grid className={styles.grid}>
        <Grid.Col span={6}>
          <Stack
            className={styles.column}
            align='flex start'
            justify='center'
          >
            <h2 className={styles.header}>{title}</h2>
            <p className={styles.text}>{text}</p>
          </Stack>
        </Grid.Col>

        <Grid.Col span={6}>
          <Link href={link}>
            <Stack
              className={styles.column}
              align='flex start'
              justify='center'
            >
              <Image
                src={imageSrc}
                height={100}
                width='auto'
                fit='contain'
              />
            </Stack>
          </Link>
        </Grid.Col>
      </Grid>
    </Flex>
  );
}
