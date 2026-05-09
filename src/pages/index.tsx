import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { StatsSection } from '../components/StatsSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { CodeDemoSection } from '../components/CodeDemoSection';
import { UseCasesSection } from '../components/UseCasesSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';

interface HomeProps {
  buildTime: string;
}

const Home: NextPage<HomeProps> = ({ buildTime }) => {
  return (
    <>
      <Head>
        <title>AgentScope - A Multi-Agent Platform for Everyone</title>
        <meta
          name="description"
          content="AgentScope is a cutting-edge multi-agent platform designed to empower developers to build LLM-empowered multi-agent applications with ease, robustness, and efficiency."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AgentScope - A Multi-Agent Platform for Everyone" />
        <meta
          property="og:description"
          content="Build, deploy, and manage AI agents with ease using AgentScope."
        />
        <meta property="og:type" content="website" />
      </Head>

      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CodeDemoSection />
        <UseCasesSection />
        <CTASection />
      </main>
      <Footer />

      <div className="hidden text-xs text-gray-700 fixed bottom-2 right-2">
        Built: {buildTime}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return {
    props: {
      buildTime: new Date().toISOString(),
    },
  };
};

export default Home;
