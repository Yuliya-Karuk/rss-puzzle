import { createElementWithProperties, findPxPerChar, getDOMElement, shuffleWords } from '../../../utils/utils';
import styles from './gamePageView.module.scss';
import { SentencesPerRound } from '../../../utils/constants';
import { Word } from '../../../components/word/word';
import { ButtonCheck } from '../../../components/buttonCheck/buttonCheck';
import { ButtonAutoComplete } from '../../../components/buttonAutoComplete/buttonAutoComplete';
import { Placeholder } from '../../../components/placeholder/placeholder';

export class GamePageView {
  public element: HTMLElement;
  public resultsElement: HTMLDivElement;
  public sourceElement: HTMLDivElement;
  public words: Word[];
  public resultWords: (Word | Placeholder)[];
  private sentence: string[];
  public sentenceNumber: number;
  public buttonController: ButtonCheck;
  public buttonAutoComplete: ButtonAutoComplete;
  public placeholders: Placeholder[];
  public resultRow: HTMLDivElement;
  public wordsRightOrder: Word[];

  constructor() {
    this.element = createElementWithProperties('main', styles.game);
    this.buttonController = new ButtonCheck();
    this.buttonAutoComplete = new ButtonAutoComplete();
    this.createChildren();
  }

  private createChildren(): void {
    this.resultsElement = createElementWithProperties('div', styles.gameResults);

    for (let i = 0; i < SentencesPerRound; i += 1) {
      const row = createElementWithProperties('div', styles.gameResultsRow);
      this.resultsElement.append(row);
    }

    this.sourceElement = createElementWithProperties('div', styles.words);
    const buttonContainer = createElementWithProperties('div', styles.buttons);

    buttonContainer.append(this.buttonAutoComplete.getComponent(), this.buttonController.getComponent());
    this.element.append(this.resultsElement, this.sourceElement, buttonContainer);
  }

  public getGamePage(): HTMLElement {
    return this.element;
  }

  public renderSentence(sentence: string[], sentenceNumber: number): void {
    this.sentence = sentence;
    this.sentenceNumber = sentenceNumber;
    this.resultRow = getDOMElement(HTMLDivElement, this.resultsElement.children[this.sentenceNumber]);

    this.createRoundConst();

    // this.wordsRightOrder = [];
    // this.placeholders = [];
    // this.resultWords = [];

    for (let i = 0; i < sentence.length; i += 1) {
      const word = new Word(`${sentence[i]}`, `${this.sentenceNumber}_${i}`);
      const placeholder = new Placeholder(`p${this.sentenceNumber}_${i}`);

      // const resultWord = createElementWithProperties('div', styles.gameResultsItem, {
      //   id: `b${this.sentenceNumber}_${i}`,
      // });
      // this.sourceElement.append(word.getComponent());
      this.resultRow.append(placeholder.getComponent());

      this.wordsRightOrder.push(word);
      this.resultWords.push(placeholder);
    }

    this.words = shuffleWords(this.wordsRightOrder);

    for (let i = 0; i < this.wordsRightOrder.length; i += 1) {
      this.sourceElement.append(this.words[i].getComponent());
    }

    this.setWordsSize();
    this.buttonAutoComplete.enableButton();
  }

  private createRoundConst(): void {
    this.wordsRightOrder = [];
    this.placeholders = [];
    this.resultWords = [];
  }

  public setWordsSize(): void {
    const pxPerChar = findPxPerChar(this.sentence);

    for (let i = 0; i < this.words.length; i += 1) {
      this.words[i].getComponent().setAttribute('style', `width: ${this.words[i].value.length * pxPerChar}px`);
    }
  }

  public blockPreviousSentence(): void {
    this.resultsElement.children[this.sentenceNumber].classList.add('game-results-row_guessed');
  }

  public clearResultsRows(): void {
    for (let i = 0; i < this.resultsElement.children.length; i += 1) {
      this.resultsElement.children[i].replaceChildren();
    }
  }
}
