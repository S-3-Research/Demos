import Ticker from './_components/Ticker'
import HeroSection from './_components/HeroSection'
import ProofBar from './_components/ProofBar'
import EmotionalSection from './_components/EmotionalSection'
import AutonomySection from './_components/AutonomySection'
import WhatYouGetSection from './_components/WhatYouGetSection'
import WhoQualifiesSection from './_components/WhoQualifiesSection'
import ScarcitySection from './_components/ScarcitySection'
import StepsSection from './_components/StepsSection'
import BottomCTA from './_components/BottomCTA'
import LandingFooter from './_components/LandingFooter'
import ScrollReveal from './_components/ScrollReveal'

export default function LandingPage() {
  return (
    <>
      <Ticker />
      <HeroSection />
      <ProofBar />
      <ScrollReveal>
        <EmotionalSection />
      </ScrollReveal>
      <ScrollReveal>
        <AutonomySection />
      </ScrollReveal>
      <ScrollReveal>
        <WhatYouGetSection />
      </ScrollReveal>
      <ScrollReveal>
        <WhoQualifiesSection />
      </ScrollReveal>
      <ScrollReveal>
        <ScarcitySection />
      </ScrollReveal>
      <ScrollReveal>
        <StepsSection />
      </ScrollReveal>
      <ScrollReveal>
        <BottomCTA />
      </ScrollReveal>
      <LandingFooter />
    </>
  )
}
