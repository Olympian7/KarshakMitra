
interface OfflineResponse {
  keywords: string[];
  en: string;
  ml: string;
}

const offlineResponses: OfflineResponse[] = [
  // General
  {
    keywords: ['hello', 'hi', 'hai', 'good morning', 'good evening'],
    en: 'Hello! I am Karshak Mitra. Please connect to the internet for full functionality.',
    ml: 'നമസ്കാരം! ഞാൻ കർഷക മിത്രയാണ്. പൂർണ്ണമായ പ്രവർത്തനത്തിനായി ദയവായി ഇന്റർനെറ്റുമായി ബന്ധിപ്പിക്കുക.',
  },
  {
    keywords: ['how are you', 'what can you do', 'help'],
    en: 'I can provide information on weather, market prices, and government schemes. For real-time data, please connect to the internet.',
    ml: 'എനിക്ക് കാലാവസ്ഥ, വിപണി വില, സർക്കാർ പദ്ധതികൾ എന്നിവയെക്കുറിച്ചുള്ള വിവരങ്ങൾ നൽകാൻ കഴിയും. തത്സമയ ഡാറ്റയ്ക്കായി, ദയവായി ഇന്റർനെറ്റുമായി ബന്ധിപ്പിക്കുക.',
  },
  {
    keywords: ['thank you', 'thanks'],
    en: "You're welcome! Let me know if you have more questions.",
    ml: 'സ്വാഗതം! കൂടുതൽ ചോദ്യങ്ങളുണ്ടെങ്കിൽ എന്നെ അറിയിക്കൂ.',
  },

  // Weather
  {
    keywords: ['weather', 'rain', 'temperature', 'climate'],
    en: 'General weather in Kerala is typically warm and humid. For a specific forecast for your location, please connect to the internet.',
    ml: 'കേരളത്തിലെ പൊതുവായ കാലാവസ്ഥ സാധാരണയായി ചൂടും ഈർപ്പവും നിറഞ്ഞതാണ്. നിങ്ങളുടെ സ്ഥലത്തിനായുള്ള ഒരു പ്രത്യേക പ്രവചനത്തിനായി, ദയവായി ഇന്റർനെറ്റുമായി ബന്ധിപ്പിക്കുക.',
  },
  {
    keywords: ['monsoon', 'rainy season'],
    en: 'The main monsoon season in Kerala is the South-West monsoon from June to September.',
    ml: 'കേരളത്തിലെ പ്രധാന മൺസൂൺ കാലം ജൂൺ മുതൽ സെപ്റ്റംബർ വരെ നീണ്ടുനിൽക്കുന്ന തെക്കുപടിഞ്ഞാറൻ മൺസൂൺ ആണ്.',
  },

  // Crop Specific
  {
    keywords: ['paddy', 'rice', 'nel'],
    en: 'Paddy is a major crop in Kerala, often planted during the monsoon season. For specific variety recommendations, please go online.',
    ml: 'കേരളത്തിലെ ഒരു പ്രധാന വിളയാണ് നെല്ല്, ഇത് സാധാരണയായി മൺസൂൺ കാലത്താണ് നടുന്നത്. പ്രത്യേക ഇനം ശുപാർശകൾക്കായി, ദയവായി ഓൺലൈനിൽ പോകുക.',
  },
  {
    keywords: ['coconut', 'thenga'],
    en: 'Coconuts require well-drained soil and regular watering. Common pests include the rhinoceros beetle and red palm weevil.',
    ml: 'തെങ്ങിന് നല്ല നീർവാർച്ചയുള്ള മണ്ണും പതിവായ നനയും ആവശ്യമാണ്. കൊമ്പൻചെല്ലി, ചെമ്പൻചെല്ലി എന്നിവയാണ് സാധാരണ കീടങ്ങൾ.',
  },
  {
    keywords: ['banana', 'vazha'],
    en: 'Bananas are heavy feeders and require rich soil and plenty of water. Bunchy top virus is a major disease.',
    ml: 'വാഴകൾക്ക് ധാരാളം പോഷകങ്ങൾ ആവശ്യമാണ്, നല്ല വളക്കൂറുള്ള മണ്ണും ധാരാളം വെള്ളവും വേണം. കുറുനാമ്പ് രോഗം ഒരു പ്രധാന രോഗമാണ്.',
  },
  {
    keywords: ['pepper', 'kurumulaku'],
    en: 'Pepper is grown as a vine, often on support trees. Quick wilt disease is a serious issue; ensure good drainage.',
    ml: 'കുരുമുളക് ഒരു വള്ളിച്ചെടിയായിട്ടാണ് വളർത്തുന്നത്, സാധാരണയായി താങ്ങ് മരങ്ങളിൽ. ദ്രുതവാട്ടം ഒരു ഗുരുതരമായ പ്രശ്നമാണ്; നല്ല നീർവാർച്ച ഉറപ്പാക്കുക.',
  },
  {
    keywords: ['ginger', 'inchi'],
    en: 'Ginger requires fertile, well-drained soil. Soft rot can be a problem in waterlogged conditions.',
    ml: 'ഇഞ്ചിക്ക് വളക്കൂറുള്ള, നല്ല നീർവാർച്ചയുള്ള മണ്ണ് ആവശ്യമാണ്. വെള്ളം കെട്ടിനിൽക്കുന്ന സാഹചര്യങ്ങളിൽ മൃദുവായ അഴുകൽ ഒരു പ്രശ്നമാകും.',
  },
  {
    keywords: ['rubber'],
    en: 'Rubber tapping is usually stopped during the heavy monsoon season to prevent panel diseases.',
    ml: 'പാനൽ രോഗങ്ങൾ തടയുന്നതിനായി കനത്ത മഴക്കാലത്ത് റബ്ബർ ടാപ്പിംഗ് സാധാരണയായി നിർത്താറുണ്ട്.',
  },
  {
    keywords: ['cardamom', 'elam'],
    en: 'Cardamom grows well in the cool, humid conditions of the Western Ghats. "Azhukal" (rot) is a common disease during monsoon.',
    ml: 'ഏലം പശ്ചിമഘട്ടത്തിലെ തണുത്തതും ഈർപ്പമുള്ളതുമായ സാഹചര്യങ്ങളിൽ നന്നായി വളരുന്നു. മൺസൂൺ കാലത്ത് "അഴുകൽ" ഒരു സാധാരണ രോഗമാണ്.',
  },

  // Farming Practices
  {
    keywords: ['fertilizer', 'valam'],
    en: 'Using a mix of organic (compost, manure) and chemical fertilizers (NPK) is often best. Get a soil test for specific recommendations.',
    ml: 'ജൈവ (കമ്പോസ്റ്റ്, ചാണകം), രാസ (NPK) വളങ്ങളുടെ മിശ്രിതം ഉപയോഗിക്കുന്നത് പലപ്പോഴും മികച്ചതാണ്. പ്രത്യേക ശുപാർശകൾക്കായി ഒരു മണ്ണ് പരിശോധന നടത്തുക.',
  },
  {
    keywords: ['pests', 'keedam'],
    en: 'Integrated Pest Management (IPM) is recommended. This includes using resistant varieties, natural predators, and neem oil before chemical pesticides.',
    ml: 'സംയോജിത കീടനിയന്ത്രണം (IPM) ശുപാർശ ചെയ്യുന്നു. രാസകീടനാശിനികൾക്ക് മുമ്പ് പ്രതിരോധശേഷിയുള്ള ഇനങ്ങൾ, സ്വാഭാവിക ശത്രുക്കൾ, വേപ്പെണ്ണ എന്നിവ ഉപയോഗിക്കുന്നത് ഇതിൽ ഉൾപ്പെടുന്നു.',
  },
  {
    keywords: ['soil', 'mannu'],
    en: 'Soil health is key. Rotate crops, use cover crops, and add organic matter like compost to improve your soil.',
    ml: 'മണ്ണിന്റെ ആരോഗ്യം പ്രധാനമാണ്. വിളകൾ മാറ്റി കൃഷി ചെയ്യുക, ആവരണ വിളകൾ ഉപയോഗിക്കുക, നിങ്ങളുടെ മണ്ണിനെ മെച്ചപ്പെടുത്താൻ കമ്പോസ്റ്റ് പോലുള്ള ജൈവവസ്തുക്കൾ ചേർക്കുക.',
  },
  {
    keywords: ['irrigation', 'jalasechanam'],
    en: 'Drip irrigation is an efficient way to save water. For real-time weather-based irrigation advice, please connect to the internet.',
    ml: 'ജലം ലാഭിക്കാനുള്ള കാര്യക്ഷമമായ മാർഗ്ഗമാണ് തുള്ളിനന. തത്സമയ കാലാവസ്ഥ അടിസ്ഥാനമാക്കിയുള്ള ജലസേചന ഉപദേശത്തിനായി, ദയവായി ഇന്റർനെറ്റുമായി ബന്ധിപ്പിക്കുക.',
  },

  // Government Schemes
  {
    keywords: ['pm-kisan', 'kisan scheme'],
    en: 'PM-KISAN is a government scheme that provides income support to farmers. To check eligibility and apply, please visit the official website online.',
    ml: 'PM-KISAN കർഷകർക്ക് വരുമാന പിന്തുണ നൽകുന്ന ഒരു സർക്കാർ പദ്ധതിയാണ്. യോഗ്യത പരിശോധിച്ച് അപേക്ഷിക്കാൻ, ദയവായി ഔദ്യോഗിക വെബ്സൈറ്റ് ഓൺലൈനായി സന്ദർശിക്കുക.',
  },
  {
    keywords: ['crop insurance', 'fasal bima'],
    en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) is the main crop insurance scheme. For details on covered crops and application deadlines, please go online.',
    ml: 'പ്രധാനമന്ത്രി ഫസൽ ബീമാ യോജന (PMFBY) പ്രധാന വിള ഇൻഷുറൻസ് പദ്ധതിയാണ്. പരിരക്ഷയുള്ള വിളകളെയും അപേക്ഷാ തീയതികളെയും കുറിച്ചുള്ള വിവരങ്ങൾക്ക്, ദയവായി ഓൺലൈനിൽ പോകുക.',
  },
  {
    keywords: ['kcc', 'kisan credit card'],
    en: 'Kisan Credit Card (KCC) provides farmers with affordable credit. You can apply for it at your nearest bank.',
    ml: 'കിസാൻ ക്രെഡിറ്റ് കാർഡ് (KCC) കർഷകർക്ക് മിതമായ നിരക്കിൽ വായ്പ നൽകുന്നു. നിങ്ങളുടെ അടുത്തുള്ള ബാങ്കിൽ ഇതിനായി അപേക്ഷിക്കാം.',
  },
  {
    keywords: ['schemes', 'paddhathi'],
    en: 'There are many central and state government schemes for farmers. For a full, updated list, please connect to the internet and check the Schemes page in the app.',
    ml: 'കർഷകർക്കായി കേന്ദ്ര-സംസ്ഥാന സർക്കാരുകളുടെ നിരവധി പദ്ധതികളുണ്ട്. പൂർണ്ണമായ, പുതിയ ലിസ്റ്റിനായി, ദയവായി ഇന്റർനെറ്റുമായി ബന്ധിപ്പിച്ച് ആപ്പിലെ പദ്ധതികൾ പേജ് പരിശോധിക്കുക.',
  },

  // Market
  {
    keywords: ['market', 'price', 'vila'],
    en: 'Market prices for crops change daily. Please connect to the internet to get the latest prices from the Market Trends page.',
    ml: 'വിളകളുടെ വിപണി വില ദിവസവും മാറിക്കൊണ്ടിരിക്കും. ഏറ്റവും പുതിയ വിലകൾ മാർക്കറ്റ് ട്രെൻഡ്സ് പേജിൽ നിന്ന് ലഭിക്കാൻ ദയവായി ഇന്റർനെറ്റുമായി ബന്ധിപ്പിക്കുക.',
  },

  // App Usage
  {
    keywords: ['log activity', 'record'],
    en: 'To log an activity, go to the "Activity Tracking" page and use the microphone or text box to enter your note.',
    ml: 'ഒരു പ്രവർത്തനം രേഖപ്പെടുത്താൻ, "പ്രവർത്തന ട്രാക്കിംഗ്" പേജിലേക്ക് പോയി നിങ്ങളുടെ കുറിപ്പ് നൽകുന്നതിന് മൈക്രോഫോൺ അല്ലെങ്കിൽ ടെക്സ്റ്റ് ബോക്സ് ഉപയോഗിക്കുക.',
  },
  {
    keywords: ['profile', 'farm details'],
    en: 'You can view and edit your farm details on the "Farm Profile" page.',
    ml: '"ഫാം പ്രൊഫൈൽ" പേജിൽ നിങ്ങളുടെ ഫാമിന്റെ വിശദാംശങ്ങൾ കാണാനും എഡിറ്റ് ചെയ്യാനും കഴിയും.',
  },
  {
    keywords: ['diagnose', 'disease', 'pest'],
    en: 'To diagnose a plant issue, go to the "Pest & Disease Diagnosis" page, upload a photo, and describe the symptoms.',
    ml: 'ഒരു സസ്യത്തിന്റെ പ്രശ്നം നിർണ്ണയിക്കാൻ, "കീട-രോഗ നിർണ്ണയം" പേജിലേക്ക് പോകുക, ഒരു ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക, രോഗലക്ഷണങ്ങൾ വിവരിക്കുക.',
  },
  {
    keywords: ['farm viewer', 'digital twin'],
    en: 'The "Farm Viewer" page shows a digital map of your farm based on your profile.',
    ml: 'നിങ്ങളുടെ പ്രൊഫൈലിന്റെ അടിസ്ഥാനത്തിൽ "ഫാം വ്യൂവർ" പേജ് നിങ്ങളുടെ ഫാമിന്റെ ഒരു ഡിജിറ്റൽ മാപ്പ് കാണിക്കുന്നു.',
  },
];

const defaultOfflineResponse = {
  en: "I'm sorry, I can't answer that question while offline. Please connect to the internet for a full response from the AI assistant.",
  ml: 'ക്ഷമിക്കണം, ഓഫ്‌ലൈനിലായിരിക്കുമ്പോൾ എനിക്ക് ആ ചോദ്യത്തിന് ഉത്തരം നൽകാൻ കഴിയില്ല. AI അസിസ്റ്റന്റിൽ നിന്ന് പൂർണ്ണമായ പ്രതികരണത്തിനായി ദയവായി ഇന്റർനെറ്റുമായി ബന്ധിപ്പിക്കുക.',
};

export function getOfflineResponse(query: string): { en: string; ml: string } {
  const lowerCaseQuery = query.toLowerCase();

  for (const response of offlineResponses) {
    for (const keyword of response.keywords) {
      if (lowerCaseQuery.includes(keyword)) {
        return { en: response.en, ml: response.ml };
      }
    }
  }

  return defaultOfflineResponse;
}
