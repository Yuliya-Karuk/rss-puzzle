import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { ButtonCheckStates, ButtonSolutionStates } from '../../../types/enums';
import { Word } from '../../../components/word/word';
import { type HintsController } from './hintsController';
import { type DataService } from '../../../services/data.service';
import { Callback } from '../../../types/types';

export class ButtonsController {
  private view: GamePageView;
  private hintsController: HintsController;
  private dataController: DataService;

  constructor(view: GamePageView, dataController: DataService, hintsController: HintsController) {
    this.view = view;
    this.dataController = dataController;
    this.hintsController = hintsController;
  }

  public bindButtonsListeners(callbackNext: Callback, callbackResults: Callback): void {
    this.view.btnCheckController.getComponent().addEventListener('click', () => {
      this.view.words.forEach(word => word.removeState());
      if (this.view.btnCheckController.state === ButtonCheckStates.check) {
        this.checkSentence();
      } else {
        this.handleContinue(callbackNext);
      }
    });

    this.view.btnSolutionController.getComponent().addEventListener('click', () => {
      if (this.view.btnSolutionController.state === ButtonSolutionStates.solution) {
        this.handleAutoComplete();
      } else {
        callbackResults();
      }
    });
  }

  public handleContinue(callbackNext: Callback): void {
    this.view.btnSolutionController.enableButton();
    this.view.translationRow.classList.remove('translation-row_info');
    this.view.removeStyleBackground();
    this.view.showRows();
    callbackNext();
  }

  public setStateCheckButton(): void {
    const makeButtonActive = this.checkResultIsCompleted();

    if (makeButtonActive) {
      this.view.btnCheckController.enableButton();
      return;
    }

    this.view.btnCheckController.disableButton();
  }

  private checkResultIsCompleted(): boolean {
    return this.view.resultWords.every(el => el instanceof Word);
  }

  public changeCheckButton(state: boolean): void {
    if (state) {
      this.view.btnCheckController.setContinueState();
    } else {
      this.view.btnCheckController.setCheckState();
    }
  }

  public changeSolutionButton(state: boolean): void {
    if (state) {
      this.view.btnSolutionController.setResultsState();
      this.view.btnSolutionController.enableButton();
    } else {
      this.view.btnSolutionController.setSolutionState();
    }
  }

  private checkSentence(): void {
    let resultBlockState = true;

    for (let i = 0; i < this.dataController.correctSentence.length; i += 1) {
      const wordValue = this.view.resultWords[i];
      if (wordValue instanceof Word) {
        const isValid = this.dataController.correctSentence[i] === wordValue.value;

        if (!isValid) {
          resultBlockState = false;
        }

        wordValue.checkState(isValid);
      }
    }

    if (resultBlockState) {
      this.finishSentence();
    }
  }

  private async finishSentence(): Promise<void> {
    this.view.blockPreviousSentence();
    this.hintsController.setTranslationRow(true);
    this.hintsController.setPlayButton(true);
    this.hintsController.setWordsBackground(true);
    if (this.dataController.sentenceNumber === this.dataController.sentencePerRound) {
      await this.showBackground();
    }
    this.changeCheckButton(true);
  }

  private async showBackground(): Promise<void> {
    console.error(this.dataController.sentenceNumber);
    this.view.hideRows();
    this.view.words.forEach(word => word.removeState());

    const data = this.dataController.roundData;
    const imageInfo = `${data.author} - '${data.name}' (${data.year}yr)`;

    this.view.translationRow.innerText = imageInfo;
    this.view.translationRow.classList.add('translation-row_info');

    this.changeSolutionButton(true);
  }

  private handleAutoComplete(): void {
    this.view.resultRow.replaceChildren();

    for (let i = 0; i < this.view.wordsRightOrder.length; i += 1) {
      this.view.resultRow.append(this.view.wordsRightOrder[i].getComponent());
      this.view.wordsRightOrder[i].removeState();
      this.view.resultWords[i] = this.view.wordsRightOrder[i];
    }

    this.view.btnSolutionController.disableButton();
    console.error('disable');
    this.setStateCheckButton();
    this.view.blockPreviousSentence();
    this.view.btnCheckController.getComponent().click();
  }
}
