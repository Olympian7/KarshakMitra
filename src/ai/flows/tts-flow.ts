
'use server';
/**
 * @fileOverview A text-to-speech (TTS) flow using Genkit.
 *
 * - generateSpeech - Converts text to speech for a given language.
 * - TtsInput - The input type for the generateSpeech function.
 * - TtsOutput - The return type for the generateSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

const TtsInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  language: z.enum(['en', 'ta']).describe('The language of the text.'),
});
export type TtsInput = z.infer<typeof TtsInputSchema>;

const TtsOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."
    ),
});
export type TtsOutput = z.infer<typeof TtsOutputSchema>;

// This function is the main export that the UI will call.
export async function generateSpeech(input: TtsInput): Promise<TtsOutput> {
  return generateSpeechFlow(input);
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: TtsInputSchema,
    outputSchema: TtsOutputSchema,
  },
  async ({ text, language }) => {
    // Select a voice based on the language
    // Note: Voice availability may change. These are examples.
    const voiceName = language === 'ta' ? 'Nallan' : 'Algenib'; // Using a plausible name for Tamil

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
      prompt: text,
    });

    if (!media || !media.url) {
      throw new Error('No audio media was returned from the TTS model.');
    }

    // The model returns raw PCM data in a base64 data URI. We need to convert it to a WAV file.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

/**
 * Converts raw PCM audio data into a WAV format encoded in base64.
 * @param pcmData Buffer containing the raw PCM audio data.
 * @param channels Number of audio channels.
 * @param rate Sample rate of the audio.
 * @param sampleWidth Bytes per sample.
 * @returns A promise that resolves with the base64-encoded WAV data.
 */
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
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
