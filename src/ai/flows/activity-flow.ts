'use server';
/**
 * @fileOverview AI flows for managing farm activities.
 *
 * - logActivityFlow - Parses a user's note and logs it as a structured activity.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { addActivity, Activity } from '@/services/activity';

const LogActivityInputSchema = z.object({
  note: z.string().describe("The user's spoken or written note about a farm activity."),
});
export type LogActivityInput = z.infer<typeof LogActivityInputSchema>;

const LogActivityOutputSchema = z.custom<Activity>();
export type LogActivityOutput = z.infer<typeof LogActivityOutputSchema>;


const logActivityPrompt = ai.definePrompt({
    name: 'logActivityPrompt',
    input: { schema: LogActivityInputSchema },
    output: { schema: z.string().describe('A concise, clear summary of the activity to be logged.') },
    prompt: `You are an AI assistant helping a farmer log their daily activities.
    The user will provide a note, and your job is to extract the core activity and summarize it into a clear, concise sentence.
    For example, if the user says "Okay, so this morning I went out and watered the coconut trees in the west field", you should output "Watered the coconut trees in the west field."
    
    User's note: {{{note}}}
    
    Activity summary:`,
});

export const logActivityFlow = ai.defineFlow(
  {
    name: 'logActivityFlow',
    inputSchema: LogActivityInputSchema,
    outputSchema: LogActivityOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
        prompt: logActivityPrompt,
        input,
    });
    
    const summarizedText = llmResponse.output || input.note;

    // In a real app, you might do more processing here, like categorizing the activity.
    // For now, we just save the summarized text.
    const newActivity = await addActivity(summarizedText);
    
    return newActivity;
  }
);
