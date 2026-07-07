'use client';

import PageLayout from '@/app/genericLayout';
import { ReactNode } from 'react';
import { Stack } from '@mantine/core';
import SimpleTextBlock from '../components/simpleTextBlock';
import styles from './about.module.css';

export default function Events(): ReactNode {
  return (
    <PageLayout>
      <Stack justify='center'>
        <h2>Who we are and what we do</h2>
        <SimpleTextBlock
          title='The Trust'
          text='Tenterden Folk Day Trust is a registered charity formed in May 1994 to preserve and advance public education and appreciation of traditional and contemporary folk song, music, dance, traditions, crafts and folk arts as a part of the living heritage.  The Trust is supported by Tenterden Town Council, Ashford Borough Council and Kent County Council and a number of local and regional businesses and other community organisations.'
        />
        <SimpleTextBlock
          title='Musical and Heritage Policy'
          text="The emphasis of our musical policy remains very much on traditional English folk song, music, and dance.  This is complemented by traditional crafts, folklore and traditions.  By it's very nature traditional folk music develops and changes, so we do not exclude contemporary material in a traditional style or performers who bring in experience of other musical styles or musical influences.  We draw many of our guests from South East England, particularly Kent and Sussex, and also include guests well known on the national folk scene.  We also feature world music, song and dance particularly where this has a connection with the local area through the material or performers."
        />
        <SimpleTextBlock text='The Trust is affiliated to the English Folk Dance and Song Society and a member of The Ashford Federation of the Arts, The Association of Festival Organisers, and Produced in Kent and registered with the The Fundraising Regulator.' />
        <h2 className={styles.subheading}>Projects We're Involved With</h2>
        <SimpleTextBlock
          title='Educational Projects'
          text='The Trust organises various educational projects in local schools. Most recently the Trust has been working with the students at Wyvern School in Ashford but has worked in many schools across the South East.'
        />
        <SimpleTextBlock
          title='Around Kent Folk'
          text='The Trust also publishes Around Kent Folk magazine, a bi-monthly free guide to folk events in Kent, Surrey, Sussex and beyond.'
        />
        <SimpleTextBlock
          title='Tenterden Folk Festival'
          text='The annual Tenterden Folk Festival took place over the weekend of the first Saturday of October and ran for over 30 years.  The festival starts on Thursday with a special fundraising concert.  On Friday, Saturday and Sunday there are  over 50 events including an English barn dance, storytelling for adults and children, concerts, craft fair, artisans, music and other stalls, exhibitions, shows, dance displays, folk clubs, Morris dancers, Appalachian dancers, Slovakian Dancers, sing-a-rounds and music sessions, a procession, street theatre, West Gallery music, workshops, Showcases and other folk events.'
        />
      </Stack>
    </PageLayout>
  );
}
