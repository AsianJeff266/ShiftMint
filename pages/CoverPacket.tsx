import React from 'react';
import { CoverPage } from '@/components/cover-packet/CoverPage';
import { MissionPage } from '@/components/cover-packet/MissionPage';
import { WhatIsShiftMintPage } from '@/components/cover-packet/WhatIsShiftMintPage';
import { FeaturesPage } from '@/components/cover-packet/FeaturesPage';
import { ContactPage } from '@/components/cover-packet/ContactPage';
import { LegalFooter } from '@/components/cover-packet/LegalFooter';

export const CoverPacket: React.FC = () => {
  return (
    <div className="min-h-screen bg-background font-sans print:bg-white">
      <div className="max-w-4xl mx-auto">
        <CoverPage />
        <MissionPage />
        <WhatIsShiftMintPage />
        <FeaturesPage />
        <ContactPage />
        <LegalFooter />
      </div>
    </div>
  );
};