
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


const responses = [
  // App Functionality & Greetings
  {
    keywords: ['hello', 'hi', 'നമസ്കാരം', 'hey'],
    malayalamResponse: "നമസ്കാരം! ഇന്ന് നിങ്ങളുടെ കൃഷിയിൽ ഞാൻ എങ്ങനെ സഹായിക്കണം?",
    englishResponse: "Hello! How can I assist you with your farming today?",
  },
  {
    keywords: ['how are you', 'സുഖമാണോ', 'whatsup'],
    malayalamResponse: "എനിക്ക് സുഖമാണ്, ചോദിച്ചതിന് നന്ദി! നിങ്ങളുടെ ഏത് കാർഷിക ചോദ്യങ്ങൾക്കും സഹായിക്കാൻ തയ്യാറാണ്.",
    englishResponse: "I'm doing well, thank you for asking! I'm ready to help with any of your farming questions.",
  },
  {
    keywords: ['log', 'activity', 'diary', 'രേഖപ്പെടുത്തുക'],
    malayalamResponse: "നിങ്ങളുടെ എല്ലാ കാർഷിക പ്രവർത്തനങ്ങളും 'ആക്റ്റിവിറ്റി ട്രാക്കിംഗ്' പേജിൽ രേഖപ്പെടുത്താം. നിങ്ങളുടെ കഠിനാധ്വാനത്തിന്റെ രേഖകൾ സൂക്ഷിക്കാൻ ഇത് ഒരു മികച്ച മാർഗമാണ്!",
    englishResponse: "You can log all your farming activities on the 'Activity Tracking' page. It's a great way to keep a record of your hard work!",
  },
  // Weather
  {
    keywords: ['weather', 'climate', 'കാലാവസ്ഥ', 'മഴ', 'rain'],
    malayalamResponse: "അടുത്ത 24 മണിക്കൂറിനുള്ളിൽ, ഭാഗികമായി മേഘാവൃതമായ ആകാശവും ഉച്ചകഴിഞ്ഞ് നേരിയ മഴയ്ക്ക് സാധ്യതയുമുണ്ട്. താപനില 26°C മുതൽ 32°C വരെ ആയിരിക്കും. കാറ്റ് തെക്ക്-പടിഞ്ഞാറ് ദിശയിൽ നിന്ന് നേരിയ തോതിൽ വീശും. നടീലിന് നല്ല ദിവസമാണ്, എന്നാൽ ചെറിയ മഴയ്ക്ക് തയ്യാറാകുക.",
    englishResponse: "Over the next 24 hours, expect partly cloudy skies with a chance of light showers in the late afternoon. Temperatures will range from 26°C to 32°C. Winds will be light, coming from the southwest. It's a good day for planting, but be prepared for brief rain.",
  },
  // Market Prices
  {
    keywords: ['market', 'price', 'trends', 'വിപണി', 'വില', 'rate'],
    malayalamResponse: "എല്ലാ പ്രധാന വിളകളുടെയും ഏറ്റവും പുതിയ വിപണി വില 'മാർക്കറ്റ് ട്രെൻഡ്സ്' പേജിൽ നിങ്ങൾക്ക് കണ്ടെത്താം. ഞാൻ നിങ്ങളെ അവിടേക്ക് കൊണ്ടുപോകണോ?",
    englishResponse: "You can find the latest market prices for all major crops on the 'Market Trends' page. Would you like me to guide you there?",
  },
  // Government Schemes
  {
    keywords: ['scheme', 'government', 'subsidy', 'പദ്ധതി', 'loan', 'ലോൺ'],
    malayalamResponse: "നിരവധി പ്രയോജനകരമായ സർക്കാർ പദ്ധതികൾ ലഭ്യമാണ്. 'സർക്കാർ പദ്ധതികൾ' പേജിൽ നിങ്ങൾക്ക് വിശദമായ വിവരങ്ങളും അപേക്ഷാ ലിങ്കുകളും കണ്ടെത്താം.",
    englishResponse: "There are several beneficial government schemes available. You can find detailed information and application links on the 'Government Schemes' page.",
  },
  // Crop & Pest Advice
  {
    keywords: ['crop', 'plant', 'disease', 'pest', 'വിള', 'രോഗം', 'കീടം'],
    malayalamResponse: "വിളകളെക്കുറിച്ചോ കീടങ്ങളെക്കുറിച്ചോ പ്രത്യേക ഉപദേശത്തിനായി, നിങ്ങളുടെ ഫാം പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്തിട്ടുണ്ടെന്ന് ഉറപ്പാക്കുക. ഭാവിയിൽ, നിങ്ങളുടെ പ്രൊഫൈലിനെ അടിസ്ഥാനമാക്കി വ്യക്തിഗത ശുപാർശകൾ നൽകാൻ എനിക്ക് കഴിയും!",
    englishResponse: "For specific advice on crops or pests, please ensure your Farm Profile is updated. In the future, I'll be able to provide personalized recommendations based on your profile!",
  },
  // Safety
  {
    keywords: ['safety', 'chemical', 'pesticide', 'സുരക്ഷ', 'കീടനാശിനി', 'വിഷം'],
    malayalamResponse: "രാസവസ്തുക്കളോ കീടനാശിനികളോ കൈകാര്യം ചെയ്യുമ്പോൾ, കയ്യുറകൾ, മാസ്കുകൾ, ഗ്ലാസുകൾ തുടങ്ങിയ സംരക്ഷണ ഉപകരണങ്ങൾ എപ്പോഴും ധരിക്കുക. ശരിയായ വായുസഞ്ചാരം ഉറപ്പാക്കുകയും നിർമ്മാതാവിൻ്റെ നിർദ്ദേശങ്ങൾ ശ്രദ്ധാപൂർവ്വം പാലിക്കുകയും ചെയ്യുക. കുട്ടികളിൽ നിന്നും ഭക്ഷണത്തിൽ നിന്നും അവയെ അകറ്റി നിർത്തുക. ഉപയോഗശേഷം, നിങ്ങളുടെ കൈകളും ചർമ്മത്തിന്റെ മറ്റു ഭാഗങ്ങളും നന്നായി കഴുകുക.",
    englishResponse: "When handling any chemicals or pesticides, always wear protective gear like gloves, masks, and goggles. Ensure proper ventilation and follow the manufacturer's instructions carefully. Keep them away from children and food sources. After use, wash your hands and any exposed skin thoroughly.",
  },
  // Growth Stage
  {
    keywords: ['growth', 'stage', 'crop status', 'വിളയുടെ അവസ്ഥ', 'വളർച്ച'],
    malayalamResponse: "നിങ്ങളുടെ ആക്റ്റിവിറ്റി ലോഗ് അനുസരിച്ച്, നിങ്ങളുടെ പ്രധാന വിളകൾ ഇപ്പോൾ വളർച്ചയുടെ മധ്യഘട്ടത്തിലാണെന്ന് തോന്നുന്നു. ഈ സമയത്ത് ശരിയായ അളവിൽ വളം നൽകുന്നത് വിളവ് വർദ്ധിപ്പിക്കാൻ സഹായിക്കും.",
    englishResponse: "Based on your activity log, your main crops seem to be in the mid-growth stage. Applying the right amount of fertilizer at this time can help boost your yield.",
  },
  // Soil
  {
    keywords: ['soil', 'മണ്ണ്', 'fertilizer', 'വളം'],
    malayalamResponse: "മണ്ണിന്റെ ആരോഗ്യം മെച്ചപ്പെടുത്തുന്നതിന് ജൈവവളങ്ങൾ ഉപയോഗിക്കുന്നത് വളരെ നല്ലതാണ്. നിങ്ങളുടെ മണ്ണിന്റെ തരം 'ഫാം പ്രൊഫൈൽ' പേജിൽ രേഖപ്പെടുത്തുന്നത് വ്യക്തിഗത ഉപദേശം നൽകാൻ സഹായിക്കും.",
    englishResponse: "Using organic manure is excellent for improving soil health. Recording your soil type on the 'Farm Profile' page can help me give you personalized advice.",
  },
  // Irrigation
  {
    keywords: ['water', 'irrigation', 'വെള്ളം', 'ജലസേചനം', 'നനയ്ക്കുക'],
    malayalamResponse: "ജലസേചനത്തിനായി തുള്ളിനന (drip irrigation) പോലുള്ള രീതികൾ ഉപയോഗിക്കുന്നത് വെള്ളം ലാഭിക്കാൻ സഹായിക്കും. വേനൽക്കാലത്ത് രാവിലെയും വൈകുന്നേരവും നനയ്ക്കുന്നതാണ് ഏറ്റവും ഉചിതം.",
    englishResponse: "Using methods like drip irrigation can help save water. During summer, it's best to water your plants in the early morning or late evening.",
  },
  // Paddy (Rice)
  {
    keywords: ['paddy', 'rice', 'നെല്ല്', 'വയൽ'],
    malayalamResponse: "നെൽകൃഷിക്ക്, നിലം നന്നായി തയ്യാറാക്കുകയും വെള്ളം കെട്ടിനിർത്തുകയും ചെയ്യേണ്ടത് അത്യാവശ്യമാണ്. മുണ്ടകൻ, വിരിപ്പ് തുടങ്ങിയ കൃഷിരീതികളെക്കുറിച്ച് കൂടുതൽ അറിയണമെന്നുണ്ടോ?",
    englishResponse: "For paddy cultivation, proper field preparation and water management are crucial. Would you like to know more about cultivation seasons like Mundakan or Virippu?",
  },
  // Coconut
  {
    keywords: ['coconut', 'തെങ്ങ്', 'തേങ്ങ'],
    malayalamResponse: "തെങ്ങുകൾക്ക് നല്ല സൂര്യപ്രകാശവും നീർവാർച്ചയുള്ള മണ്ണും ആവശ്യമാണ്. ആറുമാസത്തിലൊരിക്കൽ തടം തുറന്ന് വളം ചേർക്കുന്നത് വിളവ് വർദ്ധിപ്പിക്കാൻ സഹായിക്കും. കൊമ്പൻചെല്ലി, ചെമ്പൻചെല്ലി എന്നിവയുടെ ആക്രമണം ശ്രദ്ധിക്കുക.",
    englishResponse: "Coconut trees require plenty of sunlight and well-drained soil. Applying fertilizer every six months can increase the yield. Watch out for pests like the Rhinoceros beetle and Red palm weevil.",
  },
  // Banana
  {
    keywords: ['banana', 'വാഴ', 'പഴം'],
    malayalamResponse: "വാഴകൃഷിക്ക് ജൈവാംശം കൂടുതലുള്ള മണ്ണാണ് ഏറ്റവും നല്ലത്. പിണ്ടിപ്പുഴു, മാണവണ്ടിൻ്റെ ആക്രമണം തടയാൻ കൃത്യസമയത്ത് മരുന്ന് തളിക്കുന്നത് നല്ലതാണ്. കാറ്റിൽ നിന്നും സംരക്ഷണം നൽകാൻ ശ്രദ്ധിക്കുക.",
    englishResponse: "Bananas grow best in soil rich in organic matter. Timely application of pesticides can prevent stem borer and corm weevil attacks. Ensure they are protected from strong winds.",
  },
  // Rubber
  {
    keywords: ['rubber', 'റബ്ബർ'],
    malayalamResponse: "റബ്ബർ മരങ്ങൾക്ക് ആദ്യത്തെ കുറച്ച് വർഷങ്ങളിൽ പ്രത്യേക ശ്രദ്ധ ആവശ്യമാണ്. പട്ടമരപ്പ് രോഗം വരാതിരിക്കാൻ ശ്രദ്ധിക്കുക, ടാപ്പിംഗ് ശാസ്ത്രീയമായ രീതിയിൽ ചെയ്യുക.",
    englishResponse: "Rubber trees need special care during their initial years. Be cautious about Bark Rot disease and follow scientific methods for tapping.",
  },
  // Spices
  {
    keywords: ['pepper', 'cardamom', 'കുരുമുളക്', 'ഏലം', 'spices', 'സുഗന്ധവ്യഞ്ജനങ്ങൾ'],
    malayalamResponse: "കുരുമുളക്, ഏലം തുടങ്ങിയ സുഗന്ധവ്യഞ്ജന വിളകൾക്ക് ഭാഗികമായ തണലും നല്ല നീർവാർച്ചയും ആവശ്യമാണ്. ദ്രുതവാട്ടം പോലുള്ള രോഗങ്ങൾക്കെതിരെ ജാഗ്രത പുലർത്തുക.",
    englishResponse: "Spices like pepper and cardamom require partial shade and good drainage. Be vigilant against diseases like Quick Wilt.",
  },
  // Vegetables
  {
    keywords: ['vegetable', 'പച്ചക്കറി', 'തക്കാളി', 'വെണ്ട'],
    malayalamResponse: "വീട്ടുവളപ്പിലെ പച്ചക്കറി കൃഷിക്ക് ജൈവ കീടനാശിനികൾ ഉപയോഗിക്കുന്നതാണ് ഏറ്റവും സുരക്ഷിതം. ഓരോ വിളയ്ക്കും ആവശ്യമായ വളവും വെള്ളവും വ്യത്യസ്തമായിരിക്കും.",
    englishResponse: "For home vegetable gardens, it's safest to use organic pesticides. The fertilizer and water requirements vary for each crop.",
  }
];


export async function assistantFlow(input: AssistantInput): Promise<AssistantOutput> {
  const query = input.query.toLowerCase();
  
  const defaultResponse = {
    malayalamResponse: "ക്ഷമിക്കണം, എനിക്ക് കൃത്യമായി മനസ്സിലായില്ല. കാലാവസ്ഥ, വിപണി വില, സർക്കാർ പദ്ധതികൾ, അല്ലെങ്കിൽ വിളകളെക്കുറിച്ചുള്ള ഉപദേശങ്ങൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാമോ?",
    englishResponse: "Sorry, I didn't quite understand. Could you please ask about weather, market prices, government schemes, or crop advice?",
  };

  for (const res of responses) {
    for (const keyword of res.keywords) {
      if (query.includes(keyword)) {
        // Simulate a short delay to feel more natural
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
          malayalamResponse: res.malayalamResponse,
          englishResponse: res.englishResponse,
        };
      }
    }
  }

  // If no keyword is matched, return the default response
  await new Promise(resolve => setTimeout(resolve, 300));
  return defaultResponse;
}

    
