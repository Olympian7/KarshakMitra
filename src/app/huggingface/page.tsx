import { LanguageProvider } from '@/context/language-context';
import HuggingFaceContent from './huggingface-content';

export default function HuggingFacePage() {
  return (
    <LanguageProvider>
      <HuggingFaceContent />
    </LanguageProvider>
  );
}
