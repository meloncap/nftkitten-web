import type { GetStaticPropsContext, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {MyApp} from "../components/MyApp";
import { useStore } from "../store";

const queryClient = new QueryClient();

type PageProps = {
   apiBaseurl: string
};

const Home: NextPage<PageProps> = (props) => {
   useStore.setState({ apiBaseUrl: props.apiBaseurl });
   return (
      <React.StrictMode>
         {/* Provider */}
         <QueryClientProvider client={queryClient}>
            {/* Dev tools */}
            <ReactQueryDevtools initialIsOpen={false} />
            <div className={styles.container}>
               <Head>
                  <title>NFTKitten.io | Analyze, track &amp;amp; discover crypto collectibles and non-fungible tokens (NFTs)</title>
                  <meta
                     name="description"
                     content="Analyze, track &amp;amp; discover crypto collectibles and non-fungible tokens (NFTs)"
                  />
                  <link rel="icon" href="/favicon.ico" />
               </Head>

               <MyApp >

               <footer className={styles.footer}>
                  <a
                     href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Powered by{" "}
                     <span className={styles.logo}>
                        <Image
                           src="/vercel.svg"
                           alt="Vercel Logo"
                           width={72}
                           height={16}
                        />
                     </span>
                  </a>
               </footer>
            </div>
         </QueryClientProvider>
      </React.StrictMode>
   );
};

export default Home;
