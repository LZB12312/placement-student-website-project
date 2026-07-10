export type Event = {
  id : number;
  date: string;
  time: string;
  title: string;
  venue: string;
  ticketPrice: string;
  description: string;
  contactDetails?: { email?: string; phone?: string };
  image?: string;
};

export const events: Event[] = [
  {
    id: 1,
    date: 'Saturday 22nd August 2026',
    time: '11:30pm',
    title: 'All Day Song and Music Session',
    venue: 'Tenterden Club',
    ticketPrice: 'No tickets are needed as the day is free but collections will be taken to pay for the use of The Tenterden Club so please give generously.',
    description: 'Come along and take part or you are welcome to just sit and listen.  You do not have to stay all day, so just come along when you can and pop in and out as suits you (but not while someone is performing of course). You can bring food but please do not bring drinks as The Tenterden Club will be proving the bar and hot drinks will also be available.',
    contactDetails: {
      email: 'info@tenterdenfolkfestival.org.uk',
    },
    image: '/images/song-music-session.jpg',
  },
  {
    id: 2,
    date: 'Saturday 22nd August 2026',
    time: '12pm',
    title: 'Fiddle Workshop',
    venue: 'Town Hall',
    ticketPrice: '£5',
    description: "If you've always wanted to have a go at learning the fiddle and never known where to start, this one is for you!  Our tutor will take you through the basics, and there are even some instruments to borrow.",
    contactDetails: { email: 'petecastle42@gmail.com' },
    image: '/images/fiddleworkshop.jpg',
  },
  {
    id: 3,
    date: 'Sunday 23rd August 2026',
    time: '7pm',
    title: 'Evening Ceilidh',
    venue: 'Town Hall',
    ticketPrice: '£5',
    description: 'Come and dance the night away with our Tenterden Folk Festival Ceilidh Band.  Our fabulous caller will take you through the steps so no experience necessary, just enthusiasm!  Suitable for families.',
    contactDetails: { email: 'petecastle42@gmail.com' },
    image: '/images/ceilidh.jpg',
  },
  {
    id: 4,
    date: 'Sunday 23rd August 2026',
    time: '8pm',
    title: 'Mec Lir',
    venue: 'Town Hall Theatre',
    ticketPrice: '£5',
    description: 'The main event!  From their debut gig at one of the largest Celtic music festivals anywhere in the world – Brittany’s famed Festival Interceltique de Lorient – the exhilarating, genre-busting Mec Lir have been frenzying festival audiences for a decade.',
    image: '/images/meclir.jpg',
  },
];
