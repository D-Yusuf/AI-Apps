import {openai} from '@ai-sdk/openai'
import { generateId, createDataStreamResponse, streamText } from 'ai';

export const runtime = 'edge';



export async function POST(req: Request) {
  const { messages } = await req.json();

  // immediately start streaming (solves RAG issues with status, etc.)
  return createDataStreamResponse({
    execute: dataStream => {
      dataStream.writeData('initialized call');
      const result = streamText({
        model: openai('gpt-4o-mini'),
    messages: [
      {
        role: 'system',
        content: `ROLE: You are an expert at analyzing text and answering questions.
        -------
        TASK:
        1. The user will provide a text from a PDF. Take the personality of the character that
        would be the most fiting to be an expert on the material of the text.
        (e.g. if you get a text about chemistry, your personality should be that of a chemistry teacher.)
        2. Answer to the user's questions based on it. Your replies are short (less than 150 characters) and to the point, unless
        specified otherwise.
        3. You always reply in markdown format and use markdown formatting to make your replies more readable, and add html tags if provided code add styles to the markdown and separate code from text with seperators to make it more readable.
        `
      },
      ...messages
    ],
    temperature: 0.5,
        onChunk() {
          dataStream.writeMessageAnnotation({ chunk: '123' });
        },
        onFinish() {
          // message annotation:
          dataStream.writeMessageAnnotation({
            id: generateId(), // e.g. id from saved DB record
            other: 'information',
          });

          // call annotation:
          dataStream.writeData('call completed');
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: error => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });
}