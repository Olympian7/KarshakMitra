import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const ai = genkit({
  plugins: [googleAI()],
  enableTracing: true,
});
