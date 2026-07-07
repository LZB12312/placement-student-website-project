import { Container, Flex } from '@mantine/core';
import CtaBlock from './ctaBlock';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <Container className={styles.footerWrapper}>
      <Flex
        className={styles.footer}
        justify='center'
        align='center'
        gap='xl'
      >
        <CtaBlock
          title='Donate Now'
          text='to support our activities'
          imageSrc='/images/qrcode.jpg'
          link='https://www.paypal.com/donate/?hosted_button_id=BY9WY7XRSPGZQ'
        />
        <CtaBlock
          title='Support us'
          text='through the Ashford Community Lottery'
          imageSrc='/images/lottery.jpg'
          link='https://www.ashfordcommunitylottery.co.uk/support/tenterden-folk-festival'
        />
      </Flex>
    </Container>
  );
}
