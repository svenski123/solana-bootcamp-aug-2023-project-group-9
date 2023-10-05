import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div className="h-full w-full">
      <Head>
        <title>Solana Blackjack</title>
        <meta name="description" content="Solana Blackjack" />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
