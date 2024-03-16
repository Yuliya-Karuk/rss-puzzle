import { Word } from '../components/word/word';
import { findPxPerChar } from './utils';
import { PaddingMain, SentencesPerRound } from './constants';

const HeightNotMain: number = 110;
const HelperHeight = 16;
const HelperWidth = 16;

export function styleWords(words: Word[], sentence: string[], sentenceNumber: number, imageUrl: string): void {
  const resultsWidth = (window.innerWidth - PaddingMain * 2) * 0.9;
  const resultsHeight = (window.innerHeight - HeightNotMain - PaddingMain * 2) * 0.6;
  const rowHeight = resultsHeight / SentencesPerRound;

  let startWidth = 0;
  const startedHeight = rowHeight * sentenceNumber;
  const pxPerChar = findPxPerChar(sentence);

  for (let i = 0; i < words.length; i += 1) {
    const wordLength = words[i].value.length * pxPerChar;

    words[i].setElementStyle({
      width: `${wordLength}px`,
      height: `${rowHeight}px`,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: `${resultsWidth}px ${resultsHeight}px`,
      backgroundPosition: `-${startWidth}px ${-startedHeight}px`,
    });

    const helperTopStart = rowHeight / 2 - HelperHeight / 2;
    startWidth += wordLength;

    words[i].setHelperStyle({
      width: `${HelperWidth}px`,
      height: `${HelperHeight}px`,
      top: `${helperTopStart}px`,
      right: `-${HelperWidth / 2}px`,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: `${resultsWidth}px ${resultsHeight}px`,
      backgroundPosition: `-${startWidth - HelperWidth / 2}px ${-startedHeight - helperTopStart}px`,
    });

    if (i === 0) {
      words[i].setFirst();
    } else if (i === sentence.length - 1) {
      words[i].setLast();
    }
  }
}
