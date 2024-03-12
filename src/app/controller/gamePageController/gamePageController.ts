/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DataService } from '../../../services/data.service';
import { isNotNullable, shuffleWords } from '../../../utils/utils';
import { GamePageView } from '../../view/gamePageView/gamePageView';
import { ButtonState } from '../../../types/enums';

export class GamePageController {
  public view: GamePageView;
  public correctSentence: string[];
  public shuffleSentence: string[];
  public sentenceNumber: number;
  public wordCounter: number;
  public resultBlockState: boolean;
  private dataController: DataService;
  private sentencePerRound: number;

  constructor() {
    this.view = new GamePageView();
    this.sentenceNumber = 0;
    this.sentencePerRound = 9;
    this.dataController = new DataService();
  }

  public setOneSentence(): void {
    this.correctSentence = this.dataController.getSentence(this.sentenceNumber).split(' ');
    this.shuffleSentence = shuffleWords(this.correctSentence);
    this.view.renderSentence(this.shuffleSentence, this.sentenceNumber);
    this.bindWordListeners();
  }

  public createGamePage(): HTMLElement {
    this.setOneSentence();
    this.bindGameListeners();
    return this.view.getGamePage();
  }

  private bindGameListeners(): void {
    const context = this;
    window.addEventListener('resize', () => context.changeWordsSize());
    this.view.buttonController.getComponent().addEventListener('click', () => {
      if (this.view.buttonController.state === ButtonState.check) {
        this.checkSentence();
      } else {
        this.setNextSentence();
      }
    });
    this.view.buttonAutoComplete.getComponent().addEventListener('click', () => this.handleAutoComplete());
  }

  private bindWordListeners(): void {
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
    this.resultBlockState = true;
    for (let i = 0; i < this.correctSentence.length; i += 1) {
      const wordValue = isNotNullable(this.view.resultWords[i]);
      const state = this.correctSentence[i] === wordValue.value;
      if (!state) {
        this.resultBlockState = false;
      }
      wordValue.checkState(state);
    }
    if (this.resultBlockState) {
      this.view.changeButtons(true);
      this.view.blockPreviousSentence();
    }
  }

  private setNextSentence(): void {
    this.sentenceNumber += 1;
    if (this.sentenceNumber > this.sentencePerRound) {
      this.changeRound();
    }
    this.setOneSentence();
    this.view.changeButtons(false);
  }

  private changeRound(): void {
    this.dataController.round += 1;
    if (this.dataController.round < this.dataController.roundPerLevel) {
      this.sentenceNumber = 0;
    }
    this.view.clearResultsRows();
  }

  private handleAutoComplete(): void {
    this.view.completeSentence(this.correctSentence);
  }
}
