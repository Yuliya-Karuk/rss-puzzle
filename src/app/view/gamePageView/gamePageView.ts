import { createElementWithProperties, getDOMElement, shuffleWords } from '../../../utils/utils';
import styles from './gamePageView.module.scss';
import { SentencesPerRound } from '../../../utils/constants';
import { Word } from '../../../components/word/word';
import { ButtonCheck } from '../../../components/buttonCheck/buttonCheck';
import { ButtonAutoComplete } from '../../../components/buttonAutoComplete/buttonAutoComplete';
import { Placeholder } from '../../../components/placeholder/placeholder';
import { ButtonHint } from '../../../components/buttonHint/buttonHint';
import { styleWords } from '../../../utils/wordsStylist';

type SavedDataRound = [Word[], string[], number];

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
  public allLevelData: SavedDataRound[];
  public translationRow: HTMLParagraphElement;
  public translationHint: ButtonHint;
  public audioHint: ButtonHint;
  public playButton: HTMLButtonElement;
  public imageUrl: string;
  public imageHint: ButtonHint;

  constructor() {
    this.element = createElementWithProperties('main', styles.game);
    this.buttonController = new ButtonCheck();
    this.buttonAutoComplete = new ButtonAutoComplete();
    this.createChildren();
  }

  private createChildren(): void {
    this.allLevelData = [];
    const hints = createElementWithProperties('div', styles.gameHints);
    this.translationHint = new ButtonHint('translationHint');
    this.translationRow = createElementWithProperties('p', styles.translationRow);
    this.audioHint = new ButtonHint('audioHint');
    this.playButton = createElementWithProperties('button', styles.buttonSound, { type: 'button' });
    this.imageHint = new ButtonHint('imageHint');
    hints.append(
      this.playButton,
      this.translationHint.getComponent(),
      this.audioHint.getComponent(),
      this.imageHint.getComponent()
    );

    this.resultsElement = createElementWithProperties('div', styles.gameResults);

    for (let i = 0; i < SentencesPerRound; i += 1) {
      const row = createElementWithProperties('div', styles.gameResultsRow);
      this.resultsElement.append(row);
    }

    this.sourceElement = createElementWithProperties('div', styles.words);
    const buttonContainer = createElementWithProperties('div', styles.buttons);

    buttonContainer.append(this.buttonAutoComplete.getComponent(), this.buttonController.getComponent());
    this.element.append(hints, this.translationRow, this.resultsElement, this.sourceElement, buttonContainer);
  }

  public getGamePage(): HTMLElement {
    return this.element;
  }

  public renderSentence(sentence: string[], sentenceNumber: number): void {
    this.sentence = sentence;
    this.sentenceNumber = sentenceNumber;
    this.resultRow = getDOMElement(HTMLDivElement, this.resultsElement.children[this.sentenceNumber]);

    this.createRoundConst();

    for (let i = 0; i < this.sentence.length; i += 1) {
      const word = new Word(`${sentence[i]}`, `${this.sentenceNumber}_${i}`);
      const placeholder = new Placeholder(`p${this.sentenceNumber}_${i}`);

      this.resultRow.append(placeholder.getComponent());

      this.wordsRightOrder.push(word);
      this.resultWords.push(placeholder);
    }

    this.saveRoundData();
    this.setWordsStyle(this.wordsRightOrder, this.sentence, this.sentenceNumber);
    this.words = shuffleWords(this.wordsRightOrder);

    for (let i = 0; i < this.words.length; i += 1) {
      this.sourceElement.append(this.words[i].getComponent());
    }

    this.buttonAutoComplete.enableButton();
  }

  private createRoundConst(): void {
    this.wordsRightOrder = [];
    this.placeholders = [];
    this.resultWords = [];
  }

  public setWordsStyle(wordsRightOrder: Word[], sentence: string[], sentenceNumber: number): void {
    styleWords(wordsRightOrder, sentence, sentenceNumber, this.imageUrl);
  }

  public blockPreviousSentence(): void {
    this.resultsElement.children[this.sentenceNumber].classList.add('game-results-row_guessed');
  }

  public clearLevelConst(): void {
    this.allLevelData = [];
    for (let i = 0; i < this.resultsElement.children.length; i += 1) {
      this.resultsElement.children[i].replaceChildren();
    }
  }

  public setImageUrl(imageUrl: string): void {
    this.imageUrl = imageUrl;
  }

  private saveRoundData(): void {
    this.allLevelData.push([this.wordsRightOrder, this.sentence, this.sentenceNumber]);
  }
}
