// This is a mock service that simulates fetching government scheme data.
// In a real application, you would replace this with a call to a real government API or database.

export type GovScheme = {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  benefits: string;
  link: string;
  keyBenefits: string[];
  category: 'Financial Support' | 'Insurance & Security' | 'Resource Support';
};

const mockSchemes: GovScheme[] = [
    {
        id: 'pm-kisan',
        title: 'PM-KISAN Scheme',
        description: 'An income support scheme for all landholding farmer families.',
        eligibility: 'All landholding farmer families in the country.',
        benefits: 'Direct income support of ₹6,000 per year, paid in three equal installments of ₹2,000 directly into the bank accounts of eligible farmers.',
        link: 'https://pmkisan.gov.in/',
        keyBenefits: ['Income Support', 'Financial Stability', 'Direct Transfer'],
        category: 'Financial Support',
    },
    {
        id: 'kcc',
        title: 'Kisan Credit Card (KCC)',
        description: 'Provides farmers with timely access to credit for their cultivation and other needs.',
        eligibility: 'All farmers - individuals/joint borrowers who are owner cultivators.',
        benefits: 'Provides short-term credit at concessional interest rates for crop cultivation, post-harvest expenses, and other consumption requirements of farmer households.',
        link: 'https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card',
        keyBenefits: ['Easy Credit Access', 'Low Interest Rates', 'Flexible Repayment'],
        category: 'Financial Support',
    },
    {
        id: 'pmfby',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'An insurance service for farmers for their yields.',
        eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.',
        benefits: 'Provides comprehensive insurance coverage against failure of the crop, thus helping in stabilizing the income of the farmers.',
        link: 'https://pmfby.gov.in/',
        keyBenefits: ['Crop Insurance', 'Risk Mitigation', 'Yield Protection'],
        category: 'Insurance & Security',
    },
    {
        id: 'soil-health-card',
        title: 'Soil Health Card Scheme',
        description: 'A scheme to provide every farmer with a soil health card, which will help them make informed decisions about fertilizers.',
        eligibility: 'All farmers are eligible to get a soil health card for their land holdings.',
        benefits: 'Helps farmers to improve soil health and increase productivity by providing information on the nutrient status of their soil and recommendation on dosage of nutrients.',
        link: 'https://soilhealth.dac.gov.in/',
        keyBenefits: ['Soil Analysis', 'Improved Yields', 'Efficient Fertilizer Use'],
        category: 'Resource Support',
    },
    {
        id: 'pmksy',
        title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
        description: 'Aims to enhance physical access of water on farm and expand cultivable area under assured irrigation.',
        eligibility: 'Implemented by States, varies based on the specific component of the scheme.',
        benefits: 'Focuses on creating sources for assured irrigation, developing protective irrigation by harnessing rainwater at micro level, and promoting micro-irrigation systems.',
        link: 'https://pmksy.gov.in/',
        keyBenefits: ['Water Conservation', 'Irrigation Access', 'Drought Proofing'],
        category: 'Resource Support',
    },
    {
        id: 'rkvys',
        title: 'Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)',
        description: 'Aims at making farming a remunerative economic activity through strengthening the farmer’s effort, risk mitigation and promoting agri-business entrepreneurship.',
        eligibility: 'State Governments and Union Territories.',
        benefits: 'Provides states with greater autonomy and flexibility in making and implementing plans for their agricultural sectors. Supports infrastructure, value chain development, and innovation.',
        link: 'https://rkvy.nic.in/',
        keyBenefits: ['Infrastructure Dev', 'Innovation', 'Agri-Business'],
        category: 'Financial Support',
    }
];

export async function getGovSchemes(): Promise<GovScheme[]> {
    // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock data
  return mockSchemes;
}
