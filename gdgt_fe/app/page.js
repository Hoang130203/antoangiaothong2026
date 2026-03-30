'use client';
import Image from "next/image";
import styles from "./page.module.css";
import { Grid, Typography } from "@mui/material";
import Link from "next/link";
import Typical from 'react-typical';
import EmojiRain from "../components/EmojiRain";
export default function Home() {
  // const stepsContent = [`Một phút lầm lỡ, đánh mất tương lai`,
  //   'Tuổi dậy thì có điều gì kì diệu'];
  const stepsContent = [``];
  return (
    <main className={styles.main} style={{ padding: '30px 30px', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', justifyContent: 'center', backgroundImage: 'url("https://huongnghiepaau.edu.vn/wp-content/uploads/2021/03/Lam-sao-de-chon-dung-nghe.png.jpg")', backgroundSize: '1080px 800px' }}>
      <Grid container maxWidth='100%'>
        <EmojiRain />

        <h1>
          <Typical
            steps={[...stepsContent, 3000]}
            className={styles.custom_text}
            loop={Infinity}
          />

        </h1>
      </Grid>
    </main>
  );
}
