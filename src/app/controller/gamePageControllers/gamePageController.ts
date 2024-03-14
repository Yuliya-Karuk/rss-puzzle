/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DataService } from '../../../services/data.service';
import { isNotNullable } from '../../../utils/utils';
import { GamePageView } from '../../view/gamePageView/gamePageView';
import { ClickController } from './clickController';
import { DragController } from './dragController';
import { ButtonsController } from './buttonsController';
import { HintsController } from './hintsController';
import { LevelData } from '../../../types/interfaces';

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
  private hintsController: HintsController;
  public translation: string;
  public audioSource: string;
  public levelData: LevelData;

  constructor() {
    this.view = new GamePageView();
    this.sentenceNumber = 0;
    this.sentencePerRound = 9;
    this.dataController = new DataService();
    this.hintsController = new HintsController(this.view);
    this.buttonsController = new ButtonsController(this.view, this.hintsController);
    this.clickController = new ClickController(this.view, this.buttonsController);
    this.dragController = new DragController(this.view, this.buttonsController);
  }

  public async setStartSetup(): Promise<void> {
    this.getLevelData();
    await this.hintsController.prepareImage();
    this.hintsController.setHintsState();
    this.setOneSentence();
    this.bindGameListeners();
  }

  public createGamePage(): HTMLElement {
    this.setStartSetup();
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
    this.hintsController.bindHintsListeners();
  }

  private changeWordsSize(): void {
    this.view.allLevelData.forEach(levelData => this.view.setWordsStyle(...levelData));
  }

  public setOneSentence(): void {
    this.correctSentence = this.dataController.getSentence(this.sentenceNumber).split(' ');
    this.translation = this.dataController.getTranslation(this.sentenceNumber);
    this.audioSource = this.dataController.getAudioSource(this.sentenceNumber);

    this.view.renderSentence(this.correctSentence, this.sentenceNumber);
    this.setControllersForOneSentence();
  }

  private setControllersForOneSentence(): void {
    this.buttonsController.setCorrectSentence(this.correctSentence);
    this.clickController.bindWordListeners();
    this.dragController.bindDragListeners();
    this.hintsController.setHints(this.translation, this.audioSource);
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
    this.getLevelData();
    if (this.dataController.round < this.dataController.roundPerLevel) {
      this.sentenceNumber = 0;
    }
    this.view.clearLevelConst();
  }

  private handleForbiddenDrag(e: DragEvent): void {
    const wordId = isNotNullable(e.dataTransfer).getData('text');
    const word = isNotNullable(this.view.words.find(el => el.id === wordId));
    word.removeDragStyle();
  }

  private getLevelData(): void {
    this.levelData = this.dataController.getRoundData();
    this.hintsController.setLevelData(this.levelData);
  }
}
