/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DataService } from '../../../services/data.service';
import { isNotNullable } from '../../../utils/utils';
import { GamePageView } from '../../view/gamePageView/gamePageView';
import { ClickController } from './clickController';
import { DragController } from './dragController';
import { ButtonsController } from './buttonsController';

export class GamePageController {
  public view: GamePageView;
  public correctSentence: string[];
  public shuffleSentence: string[];
  public sentenceNumber: number;
  private dataController: DataService;
  private sentencePerRound: number;
  private clickController: ClickController;
  private dragController: DragController;
  private buttonsController: ButtonsController;

  constructor() {
    this.view = new GamePageView();
    this.sentenceNumber = 0;
    this.sentencePerRound = 9;
    this.dataController = new DataService();
    this.buttonsController = new ButtonsController(this.view);
    this.clickController = new ClickController(this.view, this.buttonsController);
    this.dragController = new DragController(this.view, this.buttonsController);
  }

  public createGamePage(): HTMLElement {
    this.setOneSentence();
    this.bindGameListeners();
    return this.view.getGamePage();
  }

  private bindGameListeners(): void {
    const context = this;
    window.addEventListener('resize', () => context.changeWordsSize());

    this.buttonsController.bindButtonsListeners(this.setNextSentence.bind(this));
    this.view.getGamePage().addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
    });

    this.view.getGamePage().addEventListener('drop', (e: DragEvent) => this.handleForbiddenDrag(e));
  }

  private changeWordsSize(): void {
    this.view.setWordsSize();
  }

  public setOneSentence(): void {
    this.correctSentence = this.dataController.getSentence(this.sentenceNumber).split(' ');

    this.view.renderSentence(this.correctSentence, this.sentenceNumber);
    this.setControllersForOneSentence();
  }

  private setControllersForOneSentence(): void {
    this.buttonsController.setCorrectSentence(this.correctSentence);
    this.clickController.bindWordListeners();
    this.dragController.bindDragListeners();
  }

  private setNextSentence(): void {
    this.sentenceNumber += 1;
    if (this.sentenceNumber > this.sentencePerRound) {
      this.changeRound();
    }
    this.setOneSentence();
    this.buttonsController.changeButtons(false);
  }

  private changeRound(): void {
    this.dataController.round += 1;
    if (this.dataController.round < this.dataController.roundPerLevel) {
      this.sentenceNumber = 0;
    }
    this.view.clearResultsRows();
  }

  private handleForbiddenDrag(e: DragEvent): void {
    const wordId = isNotNullable(e.dataTransfer).getData('text');
    const word = isNotNullable(this.view.words.find(el => el.id === wordId));
    word.removeDragStyle();
  }
}