'use server';

// This is a service that simulates calling a deployed Hugging Face model.
// In a real application, you would replace the placeholder URL and token with your actual model's details.

export type HuggingFaceResponse = {
  generated_text: string;
};

/**
 * Queries a deployed Hugging Face model.
 * @param text The input text to send to the model.
 * @returns The generated text from the model.
 */
export async function queryHuggingFaceModel(text: string): Promise<string> {
  // IMPORTANT: Replace this with the actual API URL of your deployed model
  const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/gpt2';
  const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

  if (!HUGGING_FACE_TOKEN) {
    throw new Error('Hugging Face API token is not configured in environment variables.');
  }

  try {
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Hugging Face API Error:', errorBody);
      throw new Error(`Failed to query Hugging Face model. Status: ${response.status}`);
    }

    const result = await response.json();
    
    // The response structure can vary. For a standard text-generation pipeline, it's often an array.
    if (Array.isArray(result) && result[0] && result[0].generated_text) {
        return result[0].generated_text;
    }

    // Handle other possible response formats if necessary
    console.warn('Unexpected response format from Hugging Face:', result);
    return JSON.stringify(result);

  } catch (error) {
    console.error('Error calling Hugging Face service:', error);
    throw new Error('An error occurred while communicating with the Hugging Face model.');
  }
}
