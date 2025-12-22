
interface OfflineResponse {
  keywords: string[];
  en: string;
  ml: string;
}

const offlineResponses: OfflineResponse[] = [
  // General
  {
    keywords: ['hello', 'hi', 'hai', 'good morning', 'good evening'],
    en: 'Hello! I am உழவர் நண்பன். Please connect to the internet for full functionality.',
    ml: 'வணக்கம்! நான் உங்கள் உழவர் நண்பன். முழுமையான செயல்பாட்டிற்கு இணையத்துடன் இணைக்கவும்.',
  },
  {
    keywords: ['how are you', 'what can you do', 'help'],
    en: 'I can provide information on weather, market prices, and government schemes. For real-time data, please connect to the internet.',
    ml: 'வானிலை, சந்தை விலைகள் மற்றும் அரசாங்க திட்டங்கள் பற்றிய தகவல்களை நான் வழங்க முடியும். நிகழ்நேர தரவுகளுக்கு, இணையத்துடன் இணைக்கவும்.',
  },
  {
    keywords: ['thank you', 'thanks'],
    en: "You're welcome! Let me know if you have more questions.",
    ml: 'வரவேற்கிறேன்! மேலும் கேள்விகள் இருந்தால் எனக்குத் தெரியப்படுத்துங்கள்.',
  },

  // Weather
  {
    keywords: ['weather', 'rain', 'temperature', 'climate'],
    en: 'General weather in Tamilnadu, Tenkasi is typically warm and humid. For a specific forecast for your location, please connect to the internet.',
    ml: 'தென்காசி, தமிழ்நாட்டில் பொதுவான வானிலை பொதுவாக வெப்பமாகவும் ஈரப்பதமாகவும் இருக்கும். உங்கள் இருப்பிடத்திற்கான குறிப்பிட்ட முன்னறிவிப்புக்கு, இணையத்துடன் இணைக்கவும்.',
  },
  {
    keywords: ['monsoon', 'rainy season'],
    en: 'The main monsoon season in Tamilnadu, Tenkasi is the North-East monsoon from October to December.',
    ml: 'தென்காசி, தமிழ்நாட்டில் முக்கிய மழைக்காலம் அக்டோபர் முதல் டிசம்பர் வரை வடகிழக்கு பருவமழை ஆகும்.',
  },

  // Crop Specific
  {
    keywords: ['paddy', 'rice', 'nel'],
    en: 'Paddy is a major crop in Tamilnadu, Tenkasi, often planted during the monsoon season. For specific variety recommendations, please go online.',
    ml: 'தென்காசி, தமிழ்நாட்டில் நெல் ஒரு முக்கிய பயிர், இது பெரும்பாலும் பருவமழை காலத்தில் நடப்படுகிறது. குறிப்பிட்ட வகை பரிந்துரைகளுக்கு, ஆன்லைனில் செல்லவும்.',
  },
  {
    keywords: ['coconut', 'thenga'],
    en: 'Coconuts require well-drained soil and regular watering. Common pests include the rhinoceros beetle and red palm weevil.',
    ml: 'தென்னைக்கு நன்கு வடிகட்டிய மண் மற்றும் வழக்கமான நீர்ப்பாசனம் தேவை. காண்டாமிருக வண்டு மற்றும் சிவப்பு பனை அந்துப்பூச்சி ஆகியவை பொதுவான பூச்சிகளாகும்.',
  },
  {
    keywords: ['banana', 'vazha'],
    en: 'Bananas are heavy feeders and require rich soil and plenty of water. Bunchy top virus is a major disease.',
    ml: 'வாழைப்பழம் அதிக ஊட்டச்சத்துக்களை எடுத்துக்கொள்ளும் మరియు வளமான மண் மற்றும் நிறைய தண்ணீர் தேவை. கொத்து நோய் ஒரு பெரிய நோயாகும்.',
  },
  {
    keywords: ['pepper', 'kurumulaku'],
    en: 'Pepper is grown as a vine, often on support trees. Quick wilt disease is a serious issue; ensure good drainage.',
    ml: 'மிளகு ஒரு கொடியாக வளர்க்கப்படுகிறது, பெரும்பாலும் ஆதரவு மரங்களில். விரைவான வாடல் நோய் ஒரு தீவிரமான பிரச்சினை; நல்ல வடிகால் வசதியை உறுதி செய்யவும்.',
  },
  {
    keywords: ['ginger', 'inchi'],
    en: 'Ginger requires fertile, well-drained soil. Soft rot can be a problem in waterlogged conditions.',
    ml: 'இஞ்சிக்கு வளமான, நன்கு வடிகட்டிய மண் தேவை. நீர் தேங்கிய நிலையில் மென்மையான அழுகல் ஒரு பிரச்சினையாக இருக்கலாம்.',
  },
  {
    keywords: ['rubber'],
    en: 'Rubber tapping is usually stopped during the heavy monsoon season to prevent panel diseases.',
    ml: 'கனமழைக்காலத்தில் மரப்பட்டை நோய்களைத் தடுக்க ரப்பர் பால் எடுப்பது பொதுவாக நிறுத்தப்படுகிறது.',
  },
  {
    keywords: ['cardamom', 'elam'],
    en: 'Cardamom grows well in the cool, humid conditions of the Western Ghats. "Azhukal" (rot) is a common disease during monsoon.',
    ml: 'ஏலக்காய் மேற்குத் தொடர்ச்சி மலையின் குளிர்ச்சியான, ஈரப்பதமான சூழ்நிலையில் நன்கு வளரும். "அழுகல்" நோய் பருவமழை காலத்தில் பொதுவானது.',
  },

  // Farming Practices
  {
    keywords: ['fertilizer', 'valam'],
    en: 'Using a mix of organic (compost, manure) and chemical fertilizers (NPK) is often best. Get a soil test for specific recommendations.',
    ml: 'கரிம (கலவை உரம், சாணம்) மற்றும் இரசாயன உரங்களின் (NPK) கலவையைப் பயன்படுத்துவது பெரும்பாலும் சிறந்தது. குறிப்பிட்ட பரிந்துரைகளுக்கு மண் பரிசோதனை செய்யுங்கள்.',
  },
  {
    keywords: ['pests', 'keedam'],
    en: 'Integrated Pest Management (IPM) is recommended. This includes using resistant varieties, natural predators, and neem oil before chemical pesticides.',
    ml: 'ஒருங்கிணைந்த பூச்சி மேலாண்மை (IPM) பரிந்துரைக்கப்படுகிறது. இதில் இரசாயன பூச்சிக்கொல்லிகளுக்கு முன் எதிர்ப்பு வகைகள், இயற்கை எதிரிகள் மற்றும் வேப்பெண்ணெய் ஆகியவற்றைப் பயன்படுத்துவது அடங்கும்.',
  },
  {
    keywords: ['soil', 'mannu'],
    en: 'Soil health is key. Rotate crops, use cover crops, and add organic matter like compost to improve your soil.',
    ml: 'மண் ஆரோக்கியம் முக்கியம். பயிர்களை சுழற்சி முறையில் பயிரிடுங்கள், மூடு பயிர்களைப் பயன்படுத்துங்கள், மேலும் உங்கள் மண்ணை மேம்படுத்த உரம் போன்ற கரிமப் பொருட்களைச் சேர்க்கவும்.',
  },
  {
    keywords: ['irrigation', 'jalasechanam'],
    en: 'Drip irrigation is an efficient way to save water. For real-time weather-based irrigation advice, please connect to the internet.',
    ml: 'சொட்டு நீர் பாசனம் தண்ணீரைச் சேமிக்க ஒரு திறமையான வழியாகும். நிகழ்நேர வானிலை அடிப்படையிலான நீர்ப்பாசன ஆலோசனைக்கு, இணையத்துடன் இணைக்கவும்.',
  },

  // Government Schemes
  {
    keywords: ['pm-kisan', 'kisan scheme'],
    en: 'PM-KISAN is a government scheme that provides income support to farmers. To check eligibility and apply, please visit the official website online.',
    ml: 'PM-KISAN என்பது விவசாயிகளுக்கு வருமான ஆதரவை வழங்கும் ஒரு அரசாங்கத் திட்டமாகும். தகுதியைச் சரிபார்த்து விண்ணப்பிக்க, ஆன்லைனில் அதிகாரப்பூர்வ வலைத்தளத்தைப் பார்வையிடவும்.',
  },
  {
    keywords: ['crop insurance', 'fasal bima'],
    en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) is the main crop insurance scheme. For details on covered crops and application deadlines, please go online.',
    ml: 'பிரதான் மந்திரி ஃபசல் பீமா யோஜனா (PMFBY) முக்கிய பயிர் காப்பீட்டுத் திட்டமாகும். காப்பீடு செய்யப்பட்ட பயிர்கள் மற்றும் விண்ணப்ப காலக்கெடு பற்றிய விவரங்களுக்கு, ஆன்லைனில் செல்லவும்.',
  },
  {
    keywords: ['kcc', 'kisan credit card'],
    en: 'Kisan Credit Card (KCC) provides farmers with affordable credit. You can apply for it at your nearest bank.',
    ml: 'கிசான் கிரெடிட் கார்டு (KCC) விவசாயிகளுக்கு மலிவு விலையில் கடன் வழங்குகிறது. உங்கள் அருகிலுள்ள வங்கியில் இதற்கு விண்ணப்பிக்கலாம்.',
  },
  {
    keywords: ['schemes', 'paddhathi'],
    en: 'There are many central and state government schemes for farmers. For a full, updated list, please connect to the internet and check the Schemes page in the app.',
    ml: 'விவசாயிகளுக்காக மத்திய மற்றும் மாநில அரசுகளின் பல திட்டங்கள் உள்ளன. முழுமையான, புதுப்பிக்கப்பட்ட பட்டியலுக்கு, இணையத்துடன் இணைத்து பயன்பாட்டில் உள்ள திட்டங்கள் பக்கத்தைப் பார்க்கவும்.',
  },

  // Market
  {
    keywords: ['market', 'price', 'vila'],
    en: 'Market prices for crops change daily. Please connect to the internet to get the latest prices from the Market Trends page.',
    ml: 'பயிர்களுக்கான சந்தை விலைகள் தினசரி மாறுகின்றன. சந்தைப் போக்குகள் பக்கத்திலிருந்து சமீபத்திய விலைகளைப் பெற இணையத்துடன் இணைக்கவும்.',
  },

  // App Usage
  {
    keywords: ['log activity', 'record'],
    en: 'To log an activity, go to the "Activity Tracking" page and use the microphone or text box to enter your note.',
    ml: 'ஒரு செயல்பாட்டைப் பதிவுசெய்ய, "செயல்பாட்டைக் கண்காணித்தல்" பக்கத்திற்குச் சென்று, உங்கள் குறிப்பை உள்ளிட மைக்ரோஃபோன் அல்லது உரைப்பெட்டியைப் பயன்படுத்தவும்.',
  },
  {
    keywords: ['profile', 'farm details'],
    en: 'You can view and edit your farm details on the "Farm Profile" page.',
    ml: '"பண்ணை சுயவிவரம்" பக்கத்தில் உங்கள் பண்ணை விவரங்களைக் காணலாம் மற்றும் திருத்தலாம்.',
  },
  {
    keywords: ['diagnose', 'disease', 'pest'],
    en: 'To diagnose a plant issue, go to the "Pest & Disease Diagnosis" page, upload a photo, and describe the symptoms.',
    ml: 'ஒரு தாவரப் பிரச்சினையைக் கண்டறிய, "பூச்சி மற்றும் நோய் கண்டறிதல்" பக்கத்திற்குச் சென்று, ஒரு புகைப்படத்தைப் பதிவேற்றி, அறிகுறிகளை விவரிக்கவும்.',
  },
  {
    keywords: ['farm viewer', 'digital twin'],
    en: 'The "Farm Viewer" page shows a digital map of your farm based on your profile.',
    ml: '"பண்ணை பார்வையாளர்" பக்கம் உங்கள் சுயவிவரத்தின் அடிப்படையில் உங்கள் பண்ணையின் டிஜிட்டல் வரைபடத்தைக் காட்டுகிறது.',
  },
];

const defaultOfflineResponse = {
  en: "I'm sorry, I can't answer that question while offline. Please connect to the internet for a full response from the AI assistant.",
  ml: 'மன்னிக்கவும், ஆஃப்லைனில் இருக்கும்போது அந்தக் கேள்விக்கு என்னால் பதிலளிக்க முடியாது. AI உதவியாளரிடமிருந்து முழுமையான பதிலைப் பெற இணையத்துடன் இணைக்கவும்.',
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
