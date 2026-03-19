import { redirect } from 'next/navigation';

export default function HuggingFacePage() {
  // This route previously contained duplicated layout code.
  // Redirect to the main assistant experience for now.
  redirect('/assistant');
}