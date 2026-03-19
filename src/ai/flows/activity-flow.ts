'use server';
/**
 * @fileOverview AI flows for managing farm activities.
 *
 * - logActivityFlow - Parses a user's note and logs it as a structured activity.
 * - LogActivityInput - The input type for the logActivityFlow function.
 * - LogActivityOutput - The return type for the logActivityFlow function.
 */

import { z } from 'zod';
import type { Activity } from '@/services/activity';
import { ai } from '@/ai/genkit';

const LogActivityInputSchema = z.object({
  note: z
    .string()
    .describe("The user's spoken or written note about a farm activity."),
});
export type LogActivityInput = z.infer<typeof LogActivityInputSchema>;

const LogActivityOutputSchema = z.custom<Activity>();
export type LogActivityOutput = z.infer<typeof LogActivityOutputSchema>;

const activityCategorizationPrompt = ai.definePrompt({
  name: 'activityCategorizationPrompt',
  input: { schema: z.object({ note: z.string() }) },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise, one-sentence summary of the activity.'),
    }),
  },
  prompt: `Summarize the following farm activity note into a single, clear sentence.
  
  Note: {{{note}}}
  
  Example:
  Note: "I went out to the back field this morning and finished pulling all the weeds from the okra patch. The plants are looking pretty good."
  Summary: "Finished weeding the okra patch."
  `,
});


const logActivityFlowInternal = ai.defineFlow(
  {
    name: 'logActivityFlow',
    inputSchema: LogActivityInputSchema,
    outputSchema: LogActivityOutputSchema,
  },
  async ({ note }) => {
    const llmResponse = await activityCategorizationPrompt({ note });
    const structuredNote = llmResponse.output?.summary;

    if (!structuredNote) {
      // Fallback: If the model fails to return a structured summary, log the original note.
      // This makes the system more robust.
      console.warn("AI summarization failed. Logging the original note.");
      return { id: 'ai', text: note, date: new Date().toISOString() };
    }
    
    return { id: 'ai', text: structuredNote, date: new Date().toISOString() };
  }
);


export async function logActivityFlow(input: LogActivityInput): Promise<Activity> {
    return await logActivityFlowInternal(input);
}
