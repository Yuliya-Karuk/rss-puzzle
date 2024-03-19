import { Word } from '../../../components/word/word';
import { type DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';
import { ButtonCheckStates, ButtonSolutionStates } from '../../../types/enums';
import { Callback } from '../../../types/types';
import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { ButtonsStateController } from './buttonStateController';
import { type HintsController } from './hintsController';
import { RoundDataController } from './roundDataController';

export class ButtonsController {
  private view: GamePageView;
  private hintsController: HintsController;
  private dataController: DataService;
  private roundDataController: RoundDataController;
  private buttonsStateController: ButtonsStateController;

  constructor(
    view: GamePageView,
    dataController: DataService,
    hintsController: HintsController,
    roundDataController: RoundDataController,
    buttonsStateController: ButtonsStateController
  ) {
    this.view = view;
    this.dataController = dataController;
    this.hintsController = hintsController;
    this.roundDataController = roundDataController;
    this.buttonsStateController = buttonsStateController;
  }

  public bindButtonsListeners(callbackNext: Callback, callbackResults: Callback): void {
    this.view.btnCheckController
      .getComponent()
      .addEventListener('pointerup', (e: Event) => this.handleBtnCheck(callbackNext, e));
    this.view.btnCheckController.getComponent().addEventListener('touchend', (e: Event) => e.preventDefault());

    this.view.btnSolutionController
      .getComponent()
      .addEventListener('pointerup', this.handleBtnSolution.bind(this, callbackResults));
    this.view.btnSolutionController.getComponent().addEventListener('touchend', (e: Event) => e.preventDefault());
  }

  private handleBtnCheck(callbackNext: Callback, e: Event): void {
    this.view.wordsRightOrder.forEach(word => word.removeState());
    if (this.view.btnCheckController.state === ButtonCheckStates.check) {
      this.checkSentence(e);
    } else {
      this.handleContinue(callbackNext);
    }
  }

  private handleBtnSolution(callbackResults: Callback): void {
    if (this.view.btnSolutionController.state === ButtonSolutionStates.solution) {
      this.handleAutoComplete();
    } else {
      this.handleResults(callbackResults);
    }
  }

  public handleContinue(callbackNext: Callback): void {
    this.view.translationRow.classList.remove('translation-row_info');
    this.view.removeStyleBackground();
    this.view.showRows();
    callbackNext();
  }

  private async handleResults(callbackResults: Callback): Promise<void> {
    const cutImageUrl = await LoaderService.getImage(this.dataController.roundData.cutSrc);
    const data = this.dataController.roundData;
    const imageInfo = `${data.author} - '${data.name}' (${data.year})`;
    this.roundDataController.saveImageInfo(cutImageUrl, imageInfo);
    const audioContext = this.hintsController.getAudioContext();
    this.roundDataController.saveAudioContext(audioContext);

    callbackResults();
  }

  public setStateCheckButton(): void {
    const makeButtonActive = this.checkResultIsCompleted();
    if (makeButtonActive) {
      this.buttonsStateController.setStateAfterFill();
    } else {
      this.buttonsStateController.setStateBeforeFill();
    }
  }

  private checkResultIsCompleted(): boolean {
    return this.view.resultWords.every(el => el instanceof Word);
  }

  private checkSentence(e: Event): void {
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
      this.finishSentence(e);
    }
  }

  private async finishSentence(e: Event): Promise<void> {
    this.updateStats(e.isTrusted);
    this.view.blockPreviousSentence();
    this.buttonsStateController.setStateRightCompletedSentence();
    this.hintsController.setTranslationRow(true);
    this.hintsController.setPlayButton(true);
    this.hintsController.setWordsBackground(true);

    if (this.dataController.sentenceNumber === this.dataController.sentencePerRound) {
      await this.showBackground();
    }
  }

  private updateStats(isKnown: boolean): void {
    const stats = {
      sentenceId: `s_${this.dataController.sentenceNumber}`,
      sentence: this.dataController.sentence,
      audio: this.hintsController.getAudioBuffer(),
    };
    this.roundDataController.saveOneSentence(stats, isKnown);
  }

  private async showBackground(): Promise<void> {
    this.view.hideRows();
    this.view.wordsRightOrder.forEach(word => word.removeState());

    const data = this.dataController.roundData;
    const imageInfo = `${data.author} - '${data.name}' (${data.year})`;

    this.view.translationRow.innerText = imageInfo;
    this.view.translationRow.classList.add('translation-row_info');

    this.buttonsStateController.setStateRoundCompleted();
  }

  private handleAutoComplete(): void {
    this.view.resultRow.replaceChildren();
    this.view.sourceElement.replaceChildren();

    for (let i = 0; i < this.view.wordsRightOrder.length; i += 1) {
      this.view.resultRow.append(this.view.wordsRightOrder[i].getComponent());
      this.view.wordsRightOrder[i].removeState();
      this.view.resultWords[i] = this.view.wordsRightOrder[i];
    }

    this.buttonsStateController.setStateAfterFill();
    this.view.blockPreviousSentence();
    const pointerEvent = new Event('pointerup');
    this.view.btnCheckController.getComponent().dispatchEvent(pointerEvent);
  }
}
