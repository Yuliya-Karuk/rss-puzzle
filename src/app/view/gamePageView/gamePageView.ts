import { ButtonCheck } from '../../../components/buttonCheck/buttonCheck';
import { ButtonHint } from '../../../components/buttonHint/buttonHint';
import { ButtonSolution } from '../../../components/buttonSolution/buttonSolution';
import { Placeholder } from '../../../components/placeholder/placeholder';
import { CustomSelect } from '../../../components/select/customSelect';
import { Word } from '../../../components/word/word';
import { type DataService } from '../../../services/data.service';
import { SentencesPerRound } from '../../../utils/constants';
import { createElementWithProperties, getDOMElement, shuffleWords } from '../../../utils/utils';
import { removeStyleResults, styleResults, styleWords } from '../../../utils/wordsStylist';
import styles from './gamePageView.module.scss';

type SavedDataRound = [Word[], string[], number];

export class GamePageView {
  public element: HTMLElement;
  public resultsElement: HTMLDivElement;
  public sourceElement: HTMLDivElement;

  public btnCheckController: ButtonCheck;
  public btnSolutionController: ButtonSolution;

  public translationRow: HTMLParagraphElement;
  public translationHint: ButtonHint;
  public audioHint: ButtonHint;
  public playButton: HTMLButtonElement;
  public imageHint: ButtonHint;
  public levelSelect: CustomSelect;
  public roundSelect: CustomSelect;

  public words: (Word | Placeholder)[];
  public resultWords: (Word | Placeholder)[];
  public resultRow: HTMLDivElement;
  public wordsRightOrder: Word[];
  public allLevelData: SavedDataRound[];

  public imageUrl: string;

  private dataController: DataService;

  constructor(dataController: DataService) {
    this.dataController = dataController;
    this.element = createElementWithProperties('main', styles.game);
    this.btnCheckController = new ButtonCheck();
    this.btnSolutionController = new ButtonSolution();
    this.createChildren();
  }

  private createChildren(): void {
    this.allLevelData = [];

    this.createHintsAndSelects();

    this.resultsElement = createElementWithProperties('div', styles.gameResults);
    this.renderRows();

    this.sourceElement = createElementWithProperties('div', styles.words);
    const buttonContainer = createElementWithProperties('div', styles.buttons);

    buttonContainer.append(this.btnSolutionController.getComponent(), this.btnCheckController.getComponent());
    this.element.append(this.resultsElement, this.sourceElement, buttonContainer);
    this.resultsElement.addEventListener('animationend', () => this.setRoundBackground());
  }

  private createHintsAndSelects(): void {
    const hints = createElementWithProperties('div', styles.gameHints);
    this.translationHint = new ButtonHint('translationHint');
    this.translationRow = createElementWithProperties('p', styles.translationRow);
    this.audioHint = new ButtonHint('audioHint');
    this.playButton = createElementWithProperties('button', styles.buttonSound, { type: 'button' });
    this.imageHint = new ButtonHint('imageHint');

    this.levelSelect = new CustomSelect('Level');
    this.roundSelect = new CustomSelect('Round');
    hints.append(
      this.levelSelect.getComponent(),
      this.roundSelect.getComponent(),
      this.playButton,
      this.translationHint.getComponent(),
      this.audioHint.getComponent(),
      this.imageHint.getComponent()
    );

    this.element.append(hints, this.translationRow);
  }

  public getGamePage(): HTMLElement {
    return this.element;
  }

  public renderRows(): void {
    this.resultsElement.replaceChildren();
    for (let i = 0; i < SentencesPerRound; i += 1) {
      const row = createElementWithProperties('div', styles.gameResultsRow);
      this.resultsElement.append(row);
    }
  }

  public renderSentence(): void {
    this.resultRow = getDOMElement(HTMLDivElement, this.resultsElement.children[this.dataController.sentenceNumber]);
    this.createRoundConst();

    for (let i = 0; i < this.dataController.correctSentence.length; i += 1) {
      const word = new Word(`${this.dataController.correctSentence[i]}`, `${this.dataController.sentenceNumber}_${i}`);
      const placeholder = new Placeholder(`p${this.dataController.sentenceNumber}_${i}`);

      this.resultRow.append(placeholder.getComponent());

      this.wordsRightOrder.push(word);
      this.resultWords.push(placeholder);
    }

    this.saveRoundData();
    this.setWordsStyle(this.wordsRightOrder, this.dataController.correctSentence, this.dataController.sentenceNumber);

    this.words = shuffleWords(this.wordsRightOrder);

    for (let i = 0; i < this.words.length; i += 1) {
      this.sourceElement.append(this.words[i].getComponent());
    }
  }

  private createRoundConst(): void {
    this.sourceElement.replaceChildren();
    this.wordsRightOrder = [];
    this.words = [];
    this.resultWords = [];
  }

  public setWordsStyle(wordsRightOrder: Word[], sentence: string[], sentenceNumber: number): void {
    styleWords(wordsRightOrder, sentence, sentenceNumber, this.imageUrl);
  }

  public blockPreviousSentence(): void {
    this.resultRow.classList.add('game-results-row_guessed');
  }

  public clearRoundConst(): void {
    this.allLevelData = [];
    this.sourceElement.replaceChildren();
    for (let i = 0; i < this.resultsElement.children.length; i += 1) {
      this.resultsElement.children[i].replaceChildren();
    }
  }

  public setImageUrl(imageUrl: string): void {
    this.imageUrl = imageUrl;
  }

  private saveRoundData(): void {
    this.allLevelData.push([
      this.wordsRightOrder,
      this.dataController.correctSentence,
      this.dataController.sentenceNumber,
    ]);
  }

  public hideRows(): void {
    this.resultsElement.classList.add('game-results_hidden');
  }

  public showRows(): void {
    this.resultsElement.classList.remove('game-results_hidden');
  }

  public setRoundBackground(): void {
    styleResults(this.resultsElement, this.imageUrl);
  }

  public removeStyleBackground(): void {
    removeStyleResults(this.resultsElement);
  }
}
