'use server';
/**
 * @fileOverview A simple, non-AI assistant for Karshak Mitra.
 *
 * - assistantFlow - Responds to user queries with pre-defined answers in both Malayalam and English.
 */

import { z } from 'zod';

const AssistantInputSchema = z.object({
  query: z.string().describe("The user's question to the assistant."),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
    malayalamResponse: z.string(),
    englishResponse: z.string(),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;


export async function assistantFlow(input: AssistantInput): Promise<AssistantOutput> {
  const query = input.query.toLowerCase();
  let malayalamResponse = "ക്ഷമിക്കണം, എനിക്ക് കാലാവസ്ഥ, വിപണി വില, സർക്കാർ പദ്ധതികൾ, വിളകളെക്കുറിച്ചുള്ള ഉപദേശങ്ങൾ എന്നിവയെക്കുറിച്ച് മാത്രമേ വിവരം നൽകാൻ കഴിയൂ. ഇവയിലേതിൽ ഞാൻ നിങ്ങളെ സഹായിക്കണം?";
  let englishResponse = "Sorry, I can only provide information on weather, market prices, government schemes, and crop advice. How can I help you with one of these?";

  if (query.includes('weather') || query.includes('climate')) {
    malayalamResponse = "ആകാശം തെളിഞ്ഞതും സൂര്യൻ പ്രകാശിക്കുന്നതുമാണ്! കേരളത്തിലെ കൃഷിക്ക് മനോഹരമായ ഒരു ദിവസമാണിന്ന്. താപനില കൃത്യമാണ്, നിങ്ങളെ തണുപ്പിക്കാൻ ഒരു ഇളം കാറ്റുമുണ്ട്.";
    englishResponse = "The sky is clear and the sun is shining! It's a beautiful day for farming in Kerala. The temperature is just right, and there's a gentle breeze to keep you cool.";
  } else if (query.includes('market') || query.includes('price') || query.includes('trends')) {
    malayalamResponse = "എല്ലാ പ്രധാന വിളകളുടെയും ഏറ്റവും പുതിയ വിപണി വില 'മാർക്കറ്റ് ട്രെൻഡ്സ്' പേജിൽ നിങ്ങൾക്ക് കണ്ടെത്താം. ഞാൻ നിങ്ങളെ അവിടേക്ക് കൊണ്ടുപോകണോ?";
    englishResponse = "You can find the latest market prices for all major crops on the 'Market Trends' page. Would you like me to guide you there?";
  } else if (query.includes('scheme') || query.includes('government') || query.includes('subsidy')) {
    malayalamResponse = "നിരവധി പ്രയോജനകരമായ സർക്കാർ പദ്ധതികൾ ലഭ്യമാണ്. 'സർക്കാർ പദ്ധതികൾ' പേജിൽ നിങ്ങൾക്ക് വിശദമായ വിവരങ്ങളും അപേക്ഷാ ലിങ്കുകളും കണ്ടെത്താം.";
    englishResponse = "There are several beneficial government schemes available. You can find detailed information and application links on the 'Government Schemes' page.";
  } else if (query.includes('crop') || query.includes('plant') || query.includes('disease') || query.includes('pest')) {
    malayalamResponse = "വിളകളെക്കുറിച്ചോ കീടങ്ങളെക്കുറിച്ചോ പ്രത്യേക ഉപദേശത്തിനായി, നിങ്ങളുടെ ഫാം പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്തിട്ടുണ്ടെന്ന് ഉറപ്പാക്കുക. ഭാവിയിൽ, നിങ്ങളുടെ പ്രൊഫൈലിനെ അടിസ്ഥാനമാക്കി വ്യക്തിഗത ശുപാർശകൾ നൽകാൻ എനിക്ക് കഴിയും!";
    englishResponse = "For specific advice on crops or pests, please ensure your Farm Profile is updated. In the future, I'll be able to provide personalized recommendations based on your profile!";
  } else if (query.includes('log') || query.includes('activity') || query.includes('diary')) {
    malayalamResponse = "നിങ്ങളുടെ എല്ലാ കാർഷിക പ്രവർത്തനങ്ങളും 'ആക്റ്റിവിറ്റി ട്രാക്കിംഗ്' പേജിൽ രേഖപ്പെടുത്താം. നിങ്ങളുടെ കഠിനാധ്വാനത്തിന്റെ രേഖകൾ സൂക്ഷിക്കാൻ ഇത് ഒരു മികച്ച മാർഗമാണ്!";
    englishResponse = "You can log all your farming activities on the 'Activity Tracking' page. It's a great way to keep a record of your hard work!";
  } else if (query.includes('hello') || query.includes('hi')) {
    malayalamResponse = "നമസ്കാരം! ഇന്ന് നിങ്ങളുടെ കൃഷിയിൽ ഞാൻ എങ്ങനെ സഹായിക്കണം?";
    englishResponse = "Hello! How can I assist you with your farming today?";
  } else if (query.includes('how are you')) {
    malayalamResponse = "എനിക്ക് സുഖമാണ്, ചോദിച്ചതിന് നന്ദി! നിങ്ങളുടെ ഏത് കാർഷിക ചോദ്യങ്ങൾക്കും സഹായിക്കാൻ തയ്യാറാണ്.";
    englishResponse = "I'm doing well, thank you for asking! I'm ready to help with any of your farming questions.";
  }

  // Simulate a short delay to feel more natural
  await new Promise(resolve => setTimeout(resolve, 300));

  return { malayalamResponse, englishResponse };
}
