import Image from 'next/image';
import styles from './Footer.module.css';

const Footer = () => {
  return(
    <footer className={styles.footer}>
      <div className={styles.Credit}>
        <span>Designed &#38; Developed by Tyler Angell.</span>
        {/*<br/>*/}
        {/*<span>Copyright © {new Date().getFullYear()} All rights reserved.</span>*/}
      </div>
    </footer>
  )
}
export default Footer;