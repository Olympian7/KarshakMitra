'use server';
/**
 * @fileOverview A conversational assistant AI flow for Karshak Mitra.
 *
 * - assistantFlow - A function that generates conversational responses.
 * - textToSpeechFlow - A function that converts text to speech.
 * - translateFlow - A function that translates text between languages.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  getWeatherForecastTool,
  getMarketTrendsTool,
  getGovSchemesTool,
} from '@/ai/tools';
import wav from 'wav';

// Input schema for the main assistant flow
const AssistantInputSchema = z.object({
  query: z.string(),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;


// Output schema for the main assistant flow
const AssistantOutputSchema = z.object({
  response: z.string(),
  language: z.enum(['english', 'malayalam']),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;


// Main assistant flow
const assistantPrompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: { schema: AssistantInputSchema },
  output: { schema: AssistantOutputSchema },
  tools: [getWeatherForecastTool, getMarketTrendsTool, getGovSchemesTool],
  prompt: `You are Karshak Mitra, a friendly and helpful AI assistant for farmers in Kerala, India.
  Your responses should be concise, informative, and tailored to a farmer's needs.
  Answer in simple language, avoiding jargon.

  First, detect the language of the user's query. It will be either English or Malayalam (written in English script, i.e., Manglish).
  Respond in the SAME language as the user's query.
  Set the 'language' field in your output to 'english' or 'malayalam' based on the language you are responding in.
  Use the available tools to answer questions about weather, market prices, and government schemes.

  User query: {{{query}}}`,
});

export async function assistantFlow(input: AssistantInput): Promise<AssistantOutput> {
  const llmResponse = await assistantPrompt.generate({
    input,
  });
  
  const output = llmResponse.output();
  if (!output) {
      return { response: 'Sorry, I could not process your request.', language: 'english' };
  }
  return output;
}


// Text-to-speech flow
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

export async function textToSpeechFlow(text: string): Promise<string> {
  const { media } = await ai.generate({
    model: 'googleai/gemini-2.5-flash-preview-tts',
    config: {
      responseModalities: ['AUDIO'],
       speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A suitable voice
          },
        },
    },
    prompt: text,
  });

  if (!media || !media.url) {
    throw new Error('No audio data returned from the TTS model.');
  }

  const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
  const wavBase64 = await toWav(audioBuffer);

  return `data:audio/wav;base64,${wavBase64}`;
}

// Translation flow
const TranslateInputSchema = z.object({
  text: z.string(),
  targetLanguage: z.enum(['english', 'malayalam']),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;


const translatePrompt = ai.definePrompt({
    name: 'translatePrompt',
    input: { schema: TranslateInputSchema },
    output: { schema: z.string() },
    prompt: `Translate the following text to {{{targetLanguage}}}. If the target language is malayalam, provide the translation in English script (Manglish).
    
    Text: {{{text}}}
    
    Translation:`,
});


export async function translateFlow(input: TranslateInput): Promise<string> {
    const llmResponse = await translatePrompt.generate({
        input,
    });
    return llmResponse.output() || 'Translation failed.';
}
