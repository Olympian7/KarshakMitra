
interface OfflineResponse {
  keywords: string[];
  en: string;
  ta: string;
}

const offlineResponses: OfflineResponse[] = [
  // General
  {
    keywords: ['hello', 'hi', 'hai', 'good morning', 'good evening', 'vanakkam'],
    en: 'Hello! I am KarshakMitra. Please connect to the internet for full functionality.',
    ta: 'வணக்கம்! நான் கர்ஷக் மித்ரா. முழுமையான செயல்பாட்டிற்கு இணையத்துடன் இணைக்கவும்.',
  },
  {
    keywords: ['how are you', 'what can you do', 'help', 'uthavi'],
    en: 'I can provide information on weather, market prices, and government schemes. For real-time data, please connect to the internet.',
    ta: 'நான் வானிலை, சந்தை விலைகள் மற்றும் அரசாங்க திட்டங்கள் பற்றிய தகவல்களை வழங்க முடியும். நிகழ்நேர தரவுகளுக்கு, இணையத்துடன் இணைக்கவும்.',
  },
  {
    keywords: ['thank you', 'thanks', 'nandri'],
    en: "You're welcome! Let me know if you have more questions.",
    ta: 'நன்றி! உங்களுக்கு மேலும் கேள்விகள் இருந்தால் எனக்குத் தெரியப்படுத்துங்கள்.',
  },

  // Weather
  {
    keywords: ['weather', 'rain', 'temperature', 'climate', 'vaanilai', 'mazhai'],
    en: 'General weather in Tamil Nadu is typically hot and humid. For a specific forecast for your location, please connect to the internet.',
    ta: 'தமிழ்நாட்டின் பொதுவான வானிலை பொதுவாக வெப்பமாகவும் ஈரப்பதமாகவும் இருக்கும். உங்கள் இருப்பிடத்திற்கான குறிப்பிட்ட முன்னறிவிப்பிற்கு, இணையத்துடன் இணைக்கவும்.',
  },
  {
    keywords: ['monsoon', 'rainy season'],
    en: 'The main monsoon season in Tamil Nadu is the North-East monsoon from October to December.',
    ta: 'தமிழ்நாட்டின் பிரதான பருவமழை காலம் அக்டோபர் முதல் டிசம்பர் வரை வடகிழக்கு பருவமழை ஆகும்.',
  },

  // Crop Specific
  {
    keywords: ['paddy', 'rice', 'nellu', 'arisi'],
    en: 'Paddy is a major crop in Tamil Nadu, especially in the Cauvery delta region. For specific variety recommendations, please go online.',
    ta: 'நெல் தமிழ்நாட்டின் ஒரு முக்கிய பயிர், குறிப்பாக காவிரி டெல்டா பகுதியில். குறிப்பிட்ட ரக பரிந்துரைகளுக்கு, ஆன்லைனில் செல்லவும்.',
  },
  {
    keywords: ['sugarcane', 'karumbu'],
    en: 'Sugarcane requires plenty of water and sunlight. Red rot is a common disease.',
    ta: 'கரும்புக்கு প্রচুর தண்ணீர் மற்றும் சூரிய ஒளி தேவை. சிவப்பு அழுகல் ஒரு பொதுவான நோயாகும்.',
  },
  {
    keywords: ['banana', 'vazhai'],
    en: 'Bananas are heavy feeders and require rich soil and plenty of water. Bunchy top virus is a major disease.',
    ta: 'வாழைக்கு அதிக ஊட்டச்சத்து தேவை, வளமான மண் மற்றும் ஏராளமான தண்ணீர் தேவை. குலை நோய் ஒரு முக்கிய நோயாகும்.',
  },
  {
    keywords: ['turmeric', 'manjal'],
    en: 'Turmeric grows well in well-drained loamy soil. Rhizome rot is a serious issue; ensure good drainage.',
    ta: 'மஞ்சள் நன்கு வடிகட்டிய வண்டல் மண்ணில் நன்றாக வளரும். கிழங்கு அழுகல் ஒரு தீவிரமான பிரச்சினை; நல்ல வடிகால் வசதியை உறுதி செய்யவும்.',
  },
  {
    keywords: ['cotton', 'paruthi'],
    en: 'Cotton is a major cash crop. Bollworm is a common pest that affects yield.',
    ta: 'பருத்தி ஒரு முக்கிய பணப்பயிர். காய்ப்புழு விளைச்சலைப் பாதிக்கும் ஒரு பொதுவான பூச்சியாகும்.',
  },
  {
    keywords: ['groundnut', 'nilakadalai'],
    en: 'Groundnut is an important oilseed crop. Tikka leaf spot is a common fungal disease.',
    ta: 'நிலக்கடலை ஒரு முக்கியமான எண்ணெய் வித்து பயிர். டிக்கா இலைப்புள்ளி ஒரு பொதுவான பூஞ்சை நோயாகும்.',
  },

  // Farming Practices
  {
    keywords: ['fertilizer', 'uram'],
    en: 'Using a mix of organic (compost, manure) and chemical fertilizers (NPK) is often best. Get a soil test for specific recommendations.',
    ta: 'கரிம (கம்போஸ்ட், உரம்) மற்றும் ரசாயன (NPK) உரங்களின் கலவையைப் பயன்படுத்துவது பெரும்பாலும் சிறந்தது. குறிப்பிட்ட பரிந்துரைகளுக்கு மண் பரிசோதனை செய்யுங்கள்.',
  },
  {
    keywords: ['pests', 'poochi'],
    en: 'Integrated Pest Management (IPM) is recommended. This includes using resistant varieties, natural predators, and neem oil before chemical pesticides.',
    ta: 'ஒருங்கிணைந்த பூச்சி மேலாண்மை (IPM) பரிந்துரைக்கப்படுகிறது. இதில் எதிர்ப்பு சக்தி கொண்ட ரகங்கள், இயற்கை எதிரிகள் மற்றும் வேப்பெண்ணெய் ஆகியவற்றை ரசாயன பூச்சிக்கொல்லிகளுக்கு முன் பயன்படுத்துவது அடங்கும்.',
  },
  {
    keywords: ['soil', 'mann'],
    en: 'Soil health is key. Rotate crops, use cover crops, and add organic matter like compost to improve your soil.',
    ta: 'மண் ஆரோக்கியம் முக்கியம். பயிர்களை சுழற்சி முறையில் பயிரிடவும், மூடு பயிர்களைப் பயன்படுத்தவும், உங்கள் மண்ணை மேம்படுத்த கம்போஸ்ட் போன்ற கரிமப் பொருட்களைச் சேர்க்கவும்.',
  },
  {
    keywords: ['irrigation', 'neerpasanam'],
    en: 'Drip irrigation is an efficient way to save water. For real-time weather-based irrigation advice, please connect to the internet.',
    ta: 'சொட்டு நீர் பாசனம் தண்ணீரைச் சேமிக்க ஒரு திறமையான வழியாகும். நிகழ்நேர வானிலை அடிப்படையிலான நீர்ப்பாசன ஆலோசனைக்கு, இணையத்துடன் இணைக்கவும்.',
  },

  // Government Schemes
  {
    keywords: ['pm-kisan', 'kisan scheme'],
    en: 'PM-KISAN is a government scheme that provides income support to farmers. To check eligibility and apply, please visit the official website online.',
    ta: 'பிஎம்-கிசான் என்பது விவசாயிகளுக்கு வருமான ஆதரவை வழங்கும் ஒரு அரசாங்கத் திட்டமாகும். தகுதியைச் சரிபார்த்து விண்ணப்பிக்க, அதிகாரப்பூர்வ இணையதளத்தைப் பார்க்கவும்.',
  },
  {
    keywords: ['crop insurance', 'payir kaapீடு'],
    en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) is the main crop insurance scheme. For details on covered crops and application deadlines, please go online.',
    ta: 'பிரதம மந்திரி ஃபசல் பீமா யோஜனா (PMFBY) முக்கிய பயிர் காப்பீட்டுத் திட்டமாகும். காப்பீடு செய்யப்பட்ட பயிர்கள் மற்றும் விண்ணப்ப காலக்கெடு பற்றிய விவரங்களுக்கு, ஆன்லைனில் செல்லவும்.',
  },
  {
    keywords: ['schemes', 'thittam'],
    en: 'There are many central and state government schemes for farmers. For a full, updated list, please connect to the internet and check the Schemes page in the app.',
    ta: 'விவசாயிகளுக்காக மத்திய மற்றும் மாநில அரசுகளின் பல திட்டங்கள் உள்ளன. முழுமையான, புதுப்பிக்கப்பட்ட பட்டியலுக்கு, இணையத்துடன் இணைத்து, பயன்பாட்டில் உள்ள திட்டங்கள் பக்கத்தைப் பார்க்கவும்.',
  },

  // Market
  {
    keywords: ['market', 'price', 'vilai', 'sandhai'],
    en: 'Market prices for crops change daily. Please connect to the internet to get the latest prices from the Market Trends page.',
    ta: 'பயிர்களுக்கான சந்தை விலைகள் தினசரி மாறுகின்றன. சந்தை நிலவரங்கள் பக்கத்திலிருந்து சமீபத்திய விலைகளைப் பெற இணையத்துடன் இணைக்கவும்.',
  },
];

const defaultOfflineResponse = {
  en: "I'm sorry, I can't provide a detailed answer for that while offline. You can ask me general questions about common Tamil Nadu crops (like paddy, sugarcane), farming practices, or major government schemes. For live data on weather or market prices, please connect to the internet.",
  ta: 'மன்னிக்கவும், ஆஃப்லைனில் இருக்கும்போது அதற்கு விரிவான பதிலை வழங்க முடியாது. தமிழ்நாடு பயிர்கள் (நெல், கரும்பு போன்றவை), விவசாய முறைகள் அல்லது முக்கிய அரசாங்கத் திட்டங்கள் பற்றி பொதுவான கேள்விகளைக் கேட்கலாம். வானிலை அல்லது சந்தை விலைகள் குறித்த நேரடித் தரவுகளுக்கு, இணையத்துடன் இணைக்கவும்.',
};

export function getOfflineResponse(query: string): { en: string; ta: string } {
  const lowerCaseQuery = query.toLowerCase();

  for (const response of offlineResponses) {
    for (const keyword of response.keywords) {
      if (lowerCaseQuery.includes(keyword)) {
        return { en: response.en, ta: response.ta };
      }
    }
  }

  return defaultOfflineResponse;
}
