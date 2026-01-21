
'use server';
/**
 * @fileOverview An AI-powered assistant for Uzhavan Nanban.
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
  tamilResponse: z
    .string()
    .describe('The response to the user in the Tamil language.'),
  englishResponse: z
    .string()
    .describe('The response to the user in the English language.'),
  link: z.optional(z.string().url().describe('A relevant URL for more information, if applicable.')),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

const assistantPrompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: { schema: AssistantInputSchema },
  output: { schema: AssistantOutputSchema },
  tools: [getWeatherForecastTool, getMarketTrendsTool, getGovSchemesTool],
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are Uzhavan Nanban, a friendly and knowledgeable AI assistant for farmers in Tamil Nadu, India.

  Your primary goal is to provide helpful, concise, and accurate information.
  
  IMPORTANT: You MUST provide a response in BOTH English and Tamil.
  
  - Analyze the user's query: {{{query}}}
  - If the query is about weather, market prices, or government schemes, you MUST use the provided tools to get the most up-to-date information before answering.
  - When providing information about a specific scheme, market, or official source, ALWAYS include a relevant URL in the 'link' output field if one is available from the tool output.
  - If the query is a general greeting or question, provide a warm and helpful response.
  - If you cannot answer the question, politely say so in both languages.
  - Keep your answers brief and to the point.
  
  Here are some persona guidelines:
  - Your tone should be encouraging and supportive.
  - You are an expert, but you explain things simply.
  - Always assume you are speaking to a farmer in Tamil Nadu.
  `,
});

const assistantFlowInternal = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    const llmResponse = await assistantPrompt(input);
    const output = llmResponse.output;

    if (!output) {
      // This case handles if the model truly returns nothing.
      throw new Error('The AI model did not return a valid output.');
    }
    
    // The model's structured output is directly available in the 'output' field.
    // We return this object, which matches the AssistantOutputSchema.
    return output;
  }
);


export async function assistantFlow(
  input: AssistantInput
): Promise<AssistantOutput> {
  return await assistantFlowInternal(input);
}
