/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DataService } from '../../../services/data.service';
import { isNotNullable, checkLevel } from '../../../utils/utils';
import { GamePageView } from '../../view/gamePageView/gamePageView';
import { ClickController } from './clickController';
import { DragController } from './dragController';
import { ButtonsController } from './buttonsController';
import { HintsController } from './hintsController';
import { LevelController } from './levelController';

export class GamePageController {
  public view: GamePageView;
  private dataController: DataService;
  private clickController: ClickController;
  private dragController: DragController;
  private buttonsController: ButtonsController;
  private hintsController: HintsController;
  private levelController: LevelController;

  constructor() {
    this.dataController = new DataService();
    this.view = new GamePageView(this.dataController);
    this.levelController = new LevelController(this.view, this.dataController, this.setNewRound.bind(this));
    this.hintsController = new HintsController(this.view, this.dataController);
    this.buttonsController = new ButtonsController(this.view, this.dataController, this.hintsController);
    this.clickController = new ClickController(this.view, this.buttonsController);
    this.dragController = new DragController(this.view, this.buttonsController);
  }

  public async setStartSetup(): Promise<void> {
    this.dataController.setRoundData();
    await this.hintsController.prepareRoundImage();
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
    this.dataController.setSentence();
    this.view.renderSentence();
    this.setControllersForOneSentence();
  }

  private setControllersForOneSentence(): void {
    this.clickController.bindWordListeners();
    this.dragController.bindDragListeners();
    this.hintsController.setHints();
  }

  private async setNextSentence(): Promise<void> {
    this.dataController.sentenceNumber += 1;

    if (this.dataController.sentenceNumber > this.dataController.sentencePerRound) {
      this.dataController.round += 1;
      this.dataController.sentenceNumber = 0;

      if (this.dataController.round > this.dataController.roundPerLevel - 1) {
        const newLevel = checkLevel(this.dataController.level + 1);

        if (newLevel) {
          this.dataController.setLevel(newLevel);
          this.view.levelSelect.setSelectHeader(this.dataController.level);
        } else {
          this.winGame();
          return;
        }
      } else {
        this.dataController.setRoundData();
        this.view.roundSelect.setSelectHeader(this.dataController.round);
      }

      await this.hintsController.prepareRoundImage();
      this.view.clearLevelConst();
    }

    this.setOneSentence();
    this.buttonsController.changeButtons(false);
  }

  private handleForbiddenDrag(e: DragEvent): void {
    const wordId = isNotNullable(e.dataTransfer).getData('text');
    const word = isNotNullable(this.view.words.find(el => el.id === wordId));
    word.removeDragStyle();
  }

  public async setNewRound(): Promise<void> {
    await this.hintsController.prepareRoundImage();
    this.view.clearLevelConst();
    this.setOneSentence();
    this.buttonsController.changeButtons(false);
  }

  private winGame(): void {
    console.error('win');
  }
}
