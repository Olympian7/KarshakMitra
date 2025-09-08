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


// Main assistant flow (now with more fixed responses)
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


  // We default to English for the fixed responses.
  return Promise.resolve({ response, language: 'english' });
}


export { assistantFlow };


// Text-to-speech flow
const TextToSpeechInputSchema = z.object({
    text: z.string(),
    voice: z.enum(['english', 'malayalam']).default('english'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

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

export async function textToSpeechFlow(input: TextToSpeechInput): Promise<string> {
  const voiceName = input.voice === 'malayalam' ? 'Sayna' : 'Algenib'; // Sayna for Malayalam, Algenib for English

  const { media } = await ai.generate({
    model: 'googleai/gemini-2.5-flash-preview-tts',
    config: {
      responseModalities: ['AUDIO'],
       speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
    },
    prompt: input.text,
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
    const llmResponse = await ai.generate({
        prompt: translatePrompt,
        input,
    });
    return llmResponse.output || 'Translation failed.';
}
