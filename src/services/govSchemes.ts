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
    },
    {
        id: 'kcc',
        title: 'Kisan Credit Card (KCC)',
        description: 'Provides farmers with timely access to credit for their cultivation and other needs.',
        eligibility: 'All farmers - individuals/joint borrowers who are owner cultivators.',
        benefits: 'Provides short-term credit at concessional interest rates for crop cultivation, post-harvest expenses, and other consumption requirements of farmer households.',
        link: 'https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card',
        keyBenefits: ['Easy Credit Access', 'Low Interest Rates', 'Flexible Repayment'],

    },
    {
        id: 'pmfby',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'An insurance service for farmers for their yields.',
        eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.',
        benefits: 'Provides comprehensive insurance coverage against failure of the crop, thus helping in stabilizing the income of the farmers.',
        link: 'https://pmfby.gov.in/',
        keyBenefits: ['Crop Insurance', 'Risk Mitigation', 'Yield Protection'],
    }
];

export async function getGovSchemes(): Promise<GovScheme[]> {
    // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock data
  return mockSchemes;
}
