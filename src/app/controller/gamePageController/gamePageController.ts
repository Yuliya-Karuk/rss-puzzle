import { wordCollectionLevel1 } from '../../../data/wordCollectionLevel1';
import { WordData } from '../../../types/interfaces';
import { shuffleWords } from '../../../utils/utils';
import { GamePageView } from '../../view/gamePageView/gamePageView';

const firstSentence: WordData = wordCollectionLevel1.rounds[0].words[0];

export class GamePageController {
  public view: GamePageView;
  public correctSentence: string[];
  public shuffleSentence: string[];
  public sentenceNumber: number;
  public wordCounter: number;

  constructor() {
    this.view = new GamePageView();
    this.sentenceNumber = 0;
  }

  public renderOneSentence(): void {
    this.correctSentence = firstSentence.textExample.split(' ');
    this.shuffleSentence = shuffleWords(this.correctSentence);
    this.view.renderSentence(this.shuffleSentence, this.sentenceNumber);
  }

  public createGamePage(): HTMLElement {
    this.renderOneSentence();
    this.bindGameListeners();
    return this.view.getGamePage();
  }

  private bindGameListeners(): void {
    const context = this;
    for (let i = 0; i < this.view.words.length; i += 1) {
      const item = this.view.words[i].getComponent();
      item.addEventListener('click', () => {
        if (item.parentElement === this.view.sourceData) {
          this.view.moveWordToResult(this.view.words[i]);
        } else {
          this.view.moveWordToSource(this.view.words[i]);
          this.view.words[i].removeState();
        }
        this.setStateCheckButton();
      });
    }
    window.addEventListener('resize', () => context.changeWordsSize());
    this.view.checkButton.addEventListener('click', () => this.checkSentence());
  }

  private changeWordsSize(): void {
    this.view.setWordsSize();
  }

  private setStateCheckButton(): void {
    this.view.setCheckButton(this.checkResultIsCompleted());
  }

  private checkResultIsCompleted(): boolean {
    return this.view.sourceData.children.length === 0;
  }

  private checkSentence(): void {
    for (let i = 0; i < this.correctSentence.length; i += 1) {
      const state = this.correctSentence[i] === this.view.resultWords[i].value;
      this.view.resultWords[i].checkState(state);
    }
  }
}
