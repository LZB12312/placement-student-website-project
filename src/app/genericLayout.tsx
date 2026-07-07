import { Flex, Image, Stack } from '@mantine/core';
import NavBar from './components/navBar';
import './styles/global.css';
import Footer from './components/footer';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <Stack>
      <Flex
        justify='space-between'
        align='center'
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
      </Flex>
      <NavBar />
      {children}
      <Footer />
    </Stack>
  );
}
