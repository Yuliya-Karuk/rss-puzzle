import { createElementWithProperties, findPxPerChar } from '../../../utils/utils';
import styles from './gamePageView.module.scss';
import { GameConst } from '../../../utils/constants';
import { Word } from '../../../components/word/word';

export class GamePageView {
  public element: HTMLElement;
  public results: HTMLDivElement;
  public sourceData: HTMLDivElement;
  public words: Word[];
  private sentence: string[];
  private sentenceNumber: number;
  private wordCounter: number;

  constructor() {
    this.element = createElementWithProperties('main', styles.game);
    this.words = [];
    this.createChildren();
  }

  private createChildren(): void {
    this.results = createElementWithProperties('div', styles.gameResults);
    for (let i = 0; i < (GameConst.SentencesCount as number); i += 1) {
      const row = createElementWithProperties('div', styles.gameResultsRow);
      this.results.append(row);
    }
    this.sourceData = createElementWithProperties('div', styles.words);
    this.element.append(this.results, this.sourceData);
  }

  public getGamePage(): HTMLElement {
    return this.element;
  }

  public renderSentence(sentence: string[], sentenceNumber: number): void {
    this.wordCounter = 0;
    this.sentence = sentence;
    this.sentenceNumber = sentenceNumber;
    for (let i = 0; i < sentence.length; i += 1) {
      const word = new Word(`${sentence[i]}`);
      const resultWord = createElementWithProperties('div', styles.gameResultsItem);
      this.sourceData.append(word.getComponent());
      this.results.children[sentenceNumber].append(resultWord);
      this.words.push(word);
    }
    this.setWordsSize();
  }

  public setWordsSize(): void {
    const pxPerChar = findPxPerChar(this.sentence);
    for (let i = 0; i < this.words.length; i += 1) {
      this.words[i].getComponent().setAttribute('style', `width: ${this.words[i].value.length * pxPerChar}px`);
    }
  }

  public moveWordToResult(word: Word, sentenceNumber: number, num: number): void {
    const destination = this.results.children[sentenceNumber];
    destination.children[this.wordCounter].replaceWith(word.getComponent());
    this.wordCounter += num;
  }

  public moveWordToSource(word: Word, num: number): void {
    console.error(this.sourceData);
    this.sourceData.append(word.getComponent());
    const resultWord = createElementWithProperties('div', styles.gameResultsItem);
    this.results.children[this.sentenceNumber].append(resultWord);
    this.wordCounter += num;
  }
}
