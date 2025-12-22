'use server';
/**
 * @fileOverview A plant problem diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the plant and its symptoms.'),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the input is a plant.'),
    commonName: z.string().describe('The common name of the identified plant.'),
    latinName: z.string().describe('The Latin name of the identified plant.'),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean().describe('Whether or not the plant is healthy.'),
    diagnosis: z
      .string()
      .describe(
        "A detailed diagnosis of the plant's health issue or disease. Be specific."
      ),
    recommendation: z
      .string()
      .describe(
        'A detailed, step-by-step recommendation for how to treat the issue. Format with newlines.'
      ),
  }),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(
  input: DiagnosePlantInput
): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  input: { schema: DiagnosePlantInputSchema },
  output: { schema: DiagnosePlantOutputSchema },
  prompt: `You are an expert botanist and plant pathologist specializing in diagnosing plant illnesses, particularly for crops found in Tamilnadu, Tenkasi, India.

  Analyze the provided image and description to identify the plant and diagnose any issues it may have.

  Your tasks are:
  1. Identify the plant. If it's not a plant, indicate that.
  2. Determine if the plant is healthy or not.
  3. If there's an issue, provide a specific diagnosis (e.g., "European Pear Rust," "Magnesium deficiency," "Aphid infestation").
  4. Provide a clear, actionable recommendation for treatment. This should be easy for a farmer to understand and implement.

  Use the following information as the primary source for your analysis.

  Description: {{{description}}}
  Photo: {{media url=photoDataUri}}`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("The AI model did not return a valid output.");
    }
    return output;
  }
);
