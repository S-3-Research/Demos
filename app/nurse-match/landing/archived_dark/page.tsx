import Ticker from './_components/Ticker'
import HeroSection from './_components/HeroSection'
import ProofBar from './_components/ProofBar'
import EmotionalSection from './_components/EmotionalSection'
import WhatYouGetSection from './_components/WhatYouGetSection'
import AutonomySection from './_components/AutonomySection'
import WhoQualifiesSection from './_components/WhoQualifiesSection'
import ScarcitySection from './_components/ScarcitySection'
import StepsSection from './_components/StepsSection'
import LandingFooter from './_components/LandingFooter'
import BottomCTA from './_components/BottomCTA'

export default function LandingPage() {
  return (
    <>
      <Ticker />
      <HeroSection />
      <ProofBar />
      <EmotionalSection />
      <WhatYouGetSection />
      <AutonomySection />
      <WhoQualifiesSection />
      <ScarcitySection />
      <StepsSection />
      <LandingFooter />
      <BottomCTA />
    </>
  )
}

