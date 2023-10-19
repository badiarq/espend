import { addSpaceAfterPoint } from './addSpaceAfterPoint.js'

export function capitalCase(text) {
    const newText = addSpaceAfterPoint(text)
    const sentences = newText.split('. ');
    const formattedSentences = [];
    for (const sentence of sentences) {
      if (sentence.length > 0) {
        const formattedSentence = sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
        formattedSentences.push(formattedSentence);
      }
    }
    const formattedText = formattedSentences.join('. ');
    return formattedText;
}