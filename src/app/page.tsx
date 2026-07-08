'use client';

import PageLayout from '@/app/genericLayout';
import { Stack } from '@mantine/core';
import TextAndImageBlock from './components/textAndImageBlock';

export default function Home() {
  return (
    <PageLayout>
      <Stack justify='center'>
        <h2>The Trust</h2>
        <TextAndImageBlock
          text='Tenterden Folk Day Trust is a registered charity formed in May 1994 to preserve and advance public education and appreciation of traditional and contemporary folk song, music, dance, traditions, crafts and folk arts as a part of the living heritage.  The Trust is supported by Tenterden Town Council, Ashford Borough Council and Kent County Council and a number of local and regional businesses and other community organisations.'
          imageSrc='/images/welcome.jpg'
          //uses Grid which assumes 12 columns
          imageWidth={3}
          imageSide='left'
        />
      </Stack>
    </PageLayout>
  );
}
