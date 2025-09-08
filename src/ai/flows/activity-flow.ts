'use server';
/**
 * @fileOverview AI flows for managing farm activities.
 *
 * - logActivityFlow - Parses a user's note and logs it as a structured activity.
 */

import { z } from 'zod';
import { addActivity, Activity } from '@/services/activity';

const LogActivityInputSchema = z.object({
  note: z.string().describe("The user's spoken or written note about a farm activity."),
});
export type LogActivityInput = z.infer<typeof LogActivityInputSchema>;

const LogActivityOutputSchema = z.custom<Activity>();
export type LogActivityOutput = z.infer<typeof LogActivityOutputSchema>;

// This flow now logs the user's note directly without AI summarization.
export async function logActivityFlow(input: LogActivityInput): Promise<Activity> {
    const newActivity = await addActivity(input.note);
    return newActivity;
}
