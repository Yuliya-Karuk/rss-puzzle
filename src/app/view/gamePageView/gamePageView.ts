import { createElementWithProperties, findPxPerChar } from '../../../utils/utils';
import styles from './gamePageView.module.scss';
import { GameConst } from '../../../utils/constants';
import { Word } from '../../../components/word/word';

export class GamePageView {
  public element: HTMLElement;
  public results: HTMLDivElement;
  public sourceData: HTMLDivElement;
  public words: Word[];
  public resultWords: Word[];
  private sentence: string[];
  private sentenceNumber: number;
  public checkButton: HTMLButtonElement;

  constructor() {
    this.element = createElementWithProperties('main', styles.game);
    this.createChildren();
  }

  private createChildren(): void {
    this.results = createElementWithProperties('div', styles.gameResults);
    for (let i = 0; i < (GameConst.SentencesCount as number); i += 1) {
      const row = createElementWithProperties('div', styles.gameResultsRow);
      this.results.append(row);
    }
    this.sourceData = createElementWithProperties('div', styles.words);
    this.checkButton = createElementWithProperties('button', styles.btn, { type: 'button', disabled: 'disabled' }, [
      { innerText: 'Check' },
    ]);
    this.element.append(this.results, this.sourceData, this.checkButton);
  }

  public getGamePage(): HTMLElement {
    return this.element;
  }

  public renderSentence(sentence: string[], sentenceNumber: number): void {
    this.words = [];
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

  public moveWordToResult(word: Word): void {
    const destination = this.results.children[this.sentenceNumber];
    const index = this.findEmptySlot(destination);
    destination.children[index].replaceWith(word.getComponent());
  }

  public moveWordToSource(word: Word): void {
    const resultWord = createElementWithProperties('div', styles.gameResultsItem);
    word.getComponent().insertAdjacentElement('beforebegin', resultWord);
    this.sourceData.append(word.getComponent());
  }

  public findEmptySlot(destination: Element): number {
    const index = Array.from(destination.children).findIndex(el => el.className.includes('game-results-item'));
    return index;
  }

  public setCheckButton(state: boolean): void {
    if (!state && !this.checkButton.hasAttribute('disabled')) {
      this.checkButton.setAttribute('disabled', 'disabled');
    }
    if (state) {
      this.checkButton.removeAttribute('disabled');
      this.fillResultWords();
    }
  }

  private fillResultWords(): void {
    this.resultWords = [];
    for (let i = 0; i < this.results.children[this.sentenceNumber].children.length; i += 1) {
      const oneWord = this.words.find(
        el => el.value === this.results.children[this.sentenceNumber].children[i].textContent
      ) as Word;
      this.resultWords.push(oneWord);
    }
  }
}
