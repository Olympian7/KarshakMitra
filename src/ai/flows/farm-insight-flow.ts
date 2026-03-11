
'use server';
/**
 * @fileOverview AI flow for generating personalized farm insights.
 *
 * - getFarmInsights - Generates specific insights based on the farm profile.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { FarmProfile } from '@/services/profile';

const FarmInsightInputSchema = z.object({
  profile: z.any().describe("The farmer's profile data."),
});
export type FarmInsightInput = z.infer<typeof FarmInsightInputSchema>;

const FarmInsightOutputSchema = z.object({
  insights: z.array(z.string()).describe('A list of 3-4 specific, actionable insights for the farmer.'),
});
export type FarmInsightOutput = z.infer<typeof FarmInsightOutputSchema>;

export async function getFarmInsights(profile: FarmProfile): Promise<FarmInsightOutput> {
  return farmInsightFlow({ profile });
}

const farmInsightPrompt = ai.definePrompt({
  name: 'farmInsightPrompt',
  input: { schema: FarmInsightInputSchema },
  output: { schema: FarmInsightOutputSchema },
  prompt: `You are an expert agricultural consultant specializing in farming in Tamil Nadu, India.
    
    Based on the following farm profile, provide 3-4 specific, actionable, and encouraging insights or pieces of advice to help the farmer improve their yield, soil health, or sustainability.
    
    Farm Profile:
    - Farmer Name: {{{profile.farmerName}}}
    - Farm Name: {{{profile.farmName}}}
    - Location: {{{profile.location}}}
    - Size: {{{profile.farmSize}}} acres
    - Soil Type: {{{profile.soilType}}}
    - Main Crops: {{{profile.mainCrops}}}
    
    The insights should be brief and tailored to the region of Tamil Nadu and the specific soil type mentioned. 
    If the soil is Alluvial (like in Thanjavur), mention its benefits. If they grow crops like Paddy or Groundnut, give specific advice for those.
    
    Format the output as a list of clear sentences.`,
});

const farmInsightFlow = ai.defineFlow(
  {
    name: 'farmInsightFlow',
    inputSchema: FarmInsightInputSchema,
    outputSchema: FarmInsightOutputSchema,
  },
  async (input) => {
    const { output } = await farmInsightPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate insights.');
    }
    return output;
  }
);
