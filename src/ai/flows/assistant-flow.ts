'use server';
/**
 * @fileOverview A conversational assistant AI flow for Karshak Mitra.
 *
 * - assistantFlow - A function that generates conversational responses.
 * - textToSpeechFlow - A function that converts text to speech.
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

// Main assistant flow
const assistantPrompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: { schema: AssistantInputSchema },
  output: { schema: z.string() },
  tools: [getWeatherForecastTool, getMarketTrendsTool, getGovSchemesTool],
  prompt: `You are Karshak Mitra, a friendly and helpful AI assistant for farmers in Kerala, India.
  Your responses should be concise, informative, and tailored to a farmer's needs.
  Answer in simple language, avoiding jargon. You can converse in English or Malayalam (Manglish).
  Use the available tools to answer questions about weather, market prices, and government schemes.

  User query: {{{query}}}`,
});

export async function assistantFlow(input: z.infer<typeof AssistantInputSchema>): Promise<string> {
  const llmResponse = await assistantPrompt.generate({
    input,
  });
  return llmResponse.output() || 'Sorry, I could not process your request.';
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
