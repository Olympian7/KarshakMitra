
import { LanguageProvider } from '@/context/language-context';
import ProfileContent from '@/app/profile-content';
import React from 'react';

// This is a server component that wraps the client component with the necessary provider.
export default function ProfilePage() {
  return (
    <LanguageProvider>
      <ProfileContent />
    </LanguageProvider>
  );
}
