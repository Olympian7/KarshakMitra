// This is a mock service that simulates fetching government scheme data.
// In a real application, you would replace this with a call to a real government API or database.

export type GovScheme = {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  benefits: string;
  link: string;
};

const mockSchemes: GovScheme[] = [
    {
        id: 'pm-kisan',
        title: 'PM-KISAN Scheme',
        description: 'An income support scheme for all landholding farmer families.',
        eligibility: 'All landholding farmer families in the country.',
        benefits: '₹6,000 per year in three equal installments.',
        link: 'https://pmkisan.gov.in/',
    },
    {
        id: 'kcc',
        title: 'Kisan Credit Card (KCC)',
        description: 'Provides farmers with timely access to credit for their cultivation and other needs.',
        eligibility: 'All farmers - individuals/joint borrowers who are owner cultivators.',
        benefits: 'Short-term credit at concessional interest rates.',
        link: 'https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card',
    },
    {
        id: 'pmfby',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'An insurance service for farmers for their yields.',
        eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.',
        benefits: 'Insurance cover and financial support to the farmers in the event of failure of any of the notified crop as a result of natural calamities, pests & diseases.',
        link: 'https://pmfby.gov.in/',
    }
];

export async function getGovSchemes(): Promise<GovScheme[]> {
    // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock data
  return mockSchemes;
}
