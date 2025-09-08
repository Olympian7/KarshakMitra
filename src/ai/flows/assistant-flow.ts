'use server';
/**
 * @fileOverview A simple, non-AI assistant for Karshak Mitra.
 *
 * - assistantFlow - Responds to user queries with pre-defined answers.
 */

import { z } from 'zod';

const AssistantInputSchema = z.object({
  query: z.string().describe("The user's question to the assistant."),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
    response: z.string(),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;


export async function assistantFlow(input: AssistantInput): Promise<AssistantOutput> {
  const query = input.query.toLowerCase();
  let response = "I'm sorry, I can only provide information about weather, market prices, government schemes, and crop advice. How can I help you with one of those topics?";

  if (query.includes('weather') || query.includes('climate')) {
    response = "The skies are clear and the sun is shining! It's a beautiful day for farming in Kerala. The temperature is just right, with a gentle breeze to keep you cool.";
  } else if (query.includes('market') || query.includes('price') || query.includes('trends')) {
    response = "You can find the latest market prices for all major crops on the 'Market Trends' page. Would you like me to take you there?";
  } else if (query.includes('scheme') || query.includes('government') || query.includes('subsidy')) {
    response = "There are several beneficial government schemes available. You can find detailed information and application links on the 'Government Schemes' page.";
  } else if (query.includes('crop') || query.includes('plant') || query.includes('disease') || query.includes('pest')) {
    response = "For specific advice on crops or pests, please make sure your Farm Profile is up to date. In the future, I'll be able to provide personalized recommendations based on your profile!";
  } else if (query.includes('log') || query.includes('activity') || query.includes('diary')) {
    response = "You can log all your farming activities on the 'Activity Tracking' page. It's a great way to keep records of your hard work!";
  } else if (query.includes('hello') || query.includes('hi')) {
    response = "Hello there! How can I assist you with your farming today?";
  } else if (query.includes('how are you')) {
    response = "I'm doing great, thank you for asking! Ready to help you with any farming questions you have.";
  }

  // Simulate a short delay to feel more natural
  await new Promise(resolve => setTimeout(resolve, 300));

  return { response };
}
