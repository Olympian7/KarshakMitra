
'use server';
/**
 * @fileOverview An AI-powered assistant for Karshak Mitra.
 *
 * - assistantFlow - Responds to user queries using an AI model and a set of tools.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  getWeatherForecastTool,
  getMarketTrendsTool,
  getGovSchemesTool,
} from '@/ai/tools';

const AssistantInputSchema = z.object({
  query: z.string().describe("The user's question to the assistant."),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  malayalamResponse: z
    .string()
    .describe('The response to the user in the Malayalam language.'),
  englishResponse: z
    .string()
    .describe('The response to the user in the English language.'),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

const assistantPrompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: { schema: AssistantInputSchema },
  output: { schema: AssistantOutputSchema },
  tools: [getWeatherForecastTool, getMarketTrendsTool, getGovSchemesTool],
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are Karshak Mitra, a friendly and knowledgeable AI assistant for farmers in Kerala, India.

  Your primary goal is to provide helpful, concise, and accurate information.
  
  IMPORTANT: You MUST provide a response in BOTH English and Malayalam.
  
  - Analyze the user's query: {{{query}}}
  - If the query is about weather, market prices, or government schemes, use the provided tools to get the most up-to-date information.
  - If the query is a general greeting or question, provide a warm and helpful response.
  - If you cannot answer the question, politely say so in both languages.
  - Keep your answers brief and to the point.
  
  Here are some persona guidelines:
  - Your tone should be encouraging and supportive.
  - You are an expert, but you explain things simply.
  - Always assume you are speaking to a farmer in Kerala.
  `,
});

const assistantFlowInternal = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    const { output } = await assistantPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid output.');
    }
    return output;
  }
);


export async function assistantFlow(
  input: AssistantInput
): Promise<AssistantOutput> {
  return await assistantFlowInternal(input);
}
