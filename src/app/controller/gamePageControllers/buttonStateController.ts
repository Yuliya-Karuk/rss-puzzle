import { ButtonCheck } from '../../../components/buttonCheck/buttonCheck';
import { ButtonSolution } from '../../../components/buttonSolution/buttonSolution';

export class ButtonsStateController {
  public btnCheckController: ButtonCheck;
  public btnSolutionController: ButtonSolution;

  constructor(btnCheckController: ButtonCheck, btnSolutionController: ButtonSolution) {
    this.btnCheckController = btnCheckController;
    this.btnSolutionController = btnSolutionController;
  }

  public setStartState(): void {
    this.btnCheckController.disableButton();
    this.btnCheckController.setCheckState();
    this.btnSolutionController.setSolutionState();
    this.btnSolutionController.enableButton();
  }

  public setStateBeforeFill(): void {
    this.btnCheckController.disableButton();
  }

  public setStateAfterFill(): void {
    this.btnCheckController.enableButton();
  }

  public setStateRightCompletedSentence(): void {
    this.btnSolutionController.disableButton();
    this.btnCheckController.setContinueState();
  }

  public setStateRoundCompleted(): void {
    this.btnSolutionController.setResultsState();
    this.btnSolutionController.enableButton();
  }

  public setStateInStatsPage(): void {
    this.btnSolutionController.disableButton();
  }
}
