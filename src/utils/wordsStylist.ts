/* eslint-disable max-lines-per-function */
import { Word } from '../components/word/word';
import { PaddingMain, SentencesPerRound } from './constants';

const HeightNotMain: number = 110;
const HelperHeight = 16;
const HelperWidth = 16;
const resultsWidthFromMain = 0.6;
const resultsHeightFromMain = 0.6;
const sourceHeightFromMain = 0.06;

export function findPxPerChar(sentence: string[]): number {
  const length = sentence.reduce((acc: number, el: string) => acc + el.length, 0);
  const pxPerChar =
    Math.floor((window.innerWidth - PaddingMain * 2) * resultsWidthFromMain - (sentence.length - 1)) / length;
  return pxPerChar;
}

export function styleWords(words: Word[], sentence: string[], sentenceNumber: number, imageUrl: string): void {
  const resultsWidth = (window.innerWidth - PaddingMain * 2) * resultsWidthFromMain;
  const resultsHeight =
    (window.innerHeight - HeightNotMain - PaddingMain * 2) * resultsHeightFromMain + (SentencesPerRound - 1);
  const rowHeight = (window.innerHeight - HeightNotMain - PaddingMain * 2) * sourceHeightFromMain;

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

export function styleResults(element: HTMLDivElement, imageUrl: string): void {
  const resultsWidth = (window.innerWidth - PaddingMain * 2) * 0.6;
  const resultsHeight = (window.innerHeight - HeightNotMain - PaddingMain * 2) * 0.6 + (SentencesPerRound - 1);

  const background = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${resultsWidth}px ${resultsHeight}px`,
  };
  Object.assign(element.style, background);
}

export function removeStyleResults(element: HTMLDivElement): void {
  element.removeAttribute('style');
}
