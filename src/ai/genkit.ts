
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const ai = genkit({
  plugins: [googleAI()],
  enableTracing: true,
});
