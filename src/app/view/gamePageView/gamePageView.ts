import { createElementWithProperties, findPxPerChar } from '../../../utils/utils';
import styles from './gamePageView.module.scss';
import { GameConst } from '../../../utils/constants';
import { Word } from '../../../components/word/word';
import { ButtonCheck } from '../../../components/buttonCheck/buttonCheck';

export class GamePageView {
  public element: HTMLElement;
  public results: HTMLDivElement;
  public sourceData: HTMLDivElement;
  public words: Word[];
  public resultWords: (Word | undefined)[];
  private sentence: string[];
  private sentenceNumber: number;
  public buttonController: ButtonCheck;
  public continueButton: HTMLButtonElement;

  constructor() {
    this.element = createElementWithProperties('main', styles.game);
    this.buttonController = new ButtonCheck();
    this.createChildren();
  }

  private createChildren(): void {
    this.results = createElementWithProperties('div', styles.gameResults);
    for (let i = 0; i < (GameConst.SentencesCount as number); i += 1) {
      const row = createElementWithProperties('div', styles.gameResultsRow);
      this.results.append(row);
    }
    this.sourceData = createElementWithProperties('div', styles.words);
    this.element.append(this.results, this.sourceData, this.buttonController.getComponent());
  }

  public getGamePage(): HTMLElement {
    return this.element;
  }

  public renderSentence(sentence: string[], sentenceNumber: number): void {
    this.words = [];
    this.sentence = sentence;
    this.resultWords = Array.from({ length: sentence.length }, () => undefined);
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
    for (let i = 0; i < this.resultWords.length; i += 1) {
      if (this.resultWords[i]) {
        this.words[i].getComponent().setAttribute('style', `width: ${this.words[i].value.length * pxPerChar}px`);
      }
    }
  }

  public moveWordToResult(word: Word): void {
    const destination = this.results.children[this.sentenceNumber];
    const index = this.findEmptySlot(destination);
    destination.children[index].replaceWith(word.getComponent());
    this.resultWords[index] = word;
  }

  public moveWordToSource(word: Word): void {
    const resultWord = createElementWithProperties('div', styles.gameResultsItem);
    word.getComponent().insertAdjacentElement('beforebegin', resultWord);
    this.sourceData.append(word.getComponent());
    this.resultWords.filter(el => el !== word);
  }

  public findEmptySlot(destination: Element): number {
    const index = Array.from(destination.children).findIndex(el => el.className.includes('game-results-item'));
    return index;
  }

  public setCheckButton(state: boolean): void {
    if (!state && !this.buttonController.isDisable) {
      this.buttonController.disableCheckButton();
    }
    if (state) {
      this.buttonController.enableCheckButton();
    }
  }

  public blockPreviousSentence(): void {
    this.results.children[this.sentenceNumber].classList.add('game-results-row_guessed');
  }

  public changeButtons(state: boolean): void {
    if (state) {
      this.buttonController.setContinueState();
    } else {
      this.buttonController.setCheckState();
    }
  }

  public clearResultsRows(): void {
    for (let i = 0; i < this.results.children.length; i += 1) {
      this.results.children[i].replaceChildren();
    }
  }
}
