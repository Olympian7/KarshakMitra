'use server';
/**
 * @fileOverview A conversational assistant AI flow for Karshak Mitra.
 *
 * - assistantFlow - A function that generates conversational responses.
 */
import { z } from 'zod';

// Input schema for the main assistant flow
const AssistantInputSchema = z.object({
  query: z.string(),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;


// Output schema for the main assistant flow
const AssistantOutputSchema = z.object({
  response: z.string(),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;


// Main assistant flow with fixed responses
async function assistantFlow(input: AssistantInput): Promise<AssistantOutput> {
  const query = input.query.toLowerCase();
  let response = "I'm sorry, I'm not sure how to help with that. You can ask me about the weather, market prices, or government schemes.";
  
  if (query.includes('weather') || query.includes('climate')) {
    response = "The skies are clear and the sun is smiling down on the paddy fields! It's a perfect day for farming, with a gentle breeze coming from the coast.";
  } else if (query.includes('market') || query.includes('price') || query.includes('trends')) {
    response = "You can find the latest market prices for all major crops in Kerala on the 'Market Trends' page. It's a great tool to help you decide the best time to sell.";
  } else if (query.includes('scheme') || query.includes('government') || query.includes('subsidy')) {
    response = "The 'Government Schemes' page has a detailed list of all available programs, their benefits, and eligibility. I highly recommend checking it out!";
  } else if (query.includes('crop') || query.includes('plant') || query.includes('disease') || query.includes('pest')) {
    response = "For specific crop advice, please make sure your Farm Profile is up to date. The more details you provide, the better I can assist you in the future when my AI capabilities are fully enabled.";
  } else if (query.includes('log') || query.includes('activity') || query.includes('diary')) {
    response = "You can log your daily farm activities using the microphone on the 'Activity Tracking' page. It's a great way to keep a digital diary of your hard work.";
  } else if (query.includes('hello') || query.includes('hi') || query.includes('namaste')) {
    response = "Hello! How can I assist you with your farming needs today?";
  } else if (query.includes('how are you')) {
    response = "I am doing well, thank you for asking! I'm ready to help you with any farm-related questions you have.";
  }

  return Promise.resolve({ response });
}


export { assistantFlow };
