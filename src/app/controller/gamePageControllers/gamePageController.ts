/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DataService } from '../../../services/data.service';
import { isNotNullable, checkLevel } from '../../../utils/utils';
import { GamePageView } from '../../view/gamePageView/gamePageView';
import { ClickController } from './clickController';
import { DragController } from './dragController';
import { ButtonsController } from './buttonsController';
import { HintsController } from './hintsController';
import { LevelController } from './levelController';
import { StorageService } from '../../../services/storage.service';
import { SavedRound } from '../../../types/interfaces';
import { StatsPageController } from '../statsPageController/statsPageController';
import { ButtonSolutionStates } from '../../../types/enums';
import { RoundDataController } from './roundDataController';

export class GamePageController {
  public view: GamePageView;
  private dataController: DataService;
  private clickController: ClickController;
  private dragController: DragController;
  private buttonsController: ButtonsController;
  private hintsController: HintsController;
  private levelController: LevelController;
  private statsPageController: StatsPageController;
  private roundDataController: RoundDataController;

  constructor(parentElement: HTMLBodyElement) {
    this.dataController = new DataService();
    this.roundDataController = new RoundDataController();
    this.view = new GamePageView(this.dataController);
    this.levelController = new LevelController(this.view, this.dataController, this.setNewRound.bind(this));
    this.hintsController = new HintsController(this.view, this.dataController);
    this.buttonsController = new ButtonsController(
      this.view,
      this.dataController,
      this.hintsController,
      this.roundDataController
    );
    this.clickController = new ClickController(this.view, this.buttonsController);
    this.dragController = new DragController(this.view, this.buttonsController);
    this.statsPageController = new StatsPageController(parentElement);
  }

  public createGamePage(): HTMLElement {
    this.statsPageController.insertStatsView();
    this.setStartSetup();
    return this.view.getGamePage();
  }

  public async setStartSetup(): Promise<void> {
    const lastRound = isNotNullable(StorageService.getLastRound());
    const nextRound = this.findNext(lastRound);

    this.dataController.startedSetUp(nextRound.level, nextRound.round);
    this.levelController.setSelects(nextRound.level, nextRound.round);
    await this.hintsController.prepareRoundImage();
    this.hintsController.setHintsState();
    this.bindStaticGameListeners();
    this.setOneSentence();
  }

  private bindStaticGameListeners(): void {
    const context = this;
    window.addEventListener('resize', () => context.changeWordsSize());

    this.buttonsController.bindButtonsListeners(this.setNextSentence.bind(this), this.showResults.bind(this));
    this.dragController.bindStaticListeners();
    this.hintsController.bindHintsListeners();
  }

  private changeWordsSize(): void {
    this.view.allLevelData.forEach(levelData => this.view.setWordsStyle(...levelData));
    this.view.setRoundBackground();
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
    if (this.view.btnSolutionController.state === ButtonSolutionStates.results) {
      this.hideResults();
      this.view.btnSolutionController.setSolutionState();
      this.view.btnSolutionController.enableButton();
    }

    if (this.dataController.checkIsNotNewRound()) {
      this.dataController.sentenceNumber += 1;
    } else {
      await this.setNextRound();
    }

    this.setOneSentence();
    this.buttonsController.changeCheckButton(false);
  }

  private async setNextRound(): Promise<void> {
    this.saveCompletedRound();
    this.roundDataController.clearStats();
    this.view.roundSelect.setRoundCompleted(this.dataController.round);
    this.dataController.sentenceNumber = 0;

    if (this.dataController.checkIsNotNewLevel()) {
      this.dataController.round += 1;
      this.dataController.setRoundData();
      this.view.roundSelect.setSelectHeader(this.dataController.round + 1);
    } else {
      this.setNextLevel();
    }

    await this.hintsController.prepareRoundImage();
    this.view.clearRoundConst();
  }

  private setNextLevel(): void {
    const newLevel = checkLevel(this.dataController.level + 1);
    this.dataController.setLevel(newLevel);
    this.levelController.setSelects(this.dataController.level, this.dataController.round);
  }

  public async setNewRound(): Promise<void> {
    this.roundDataController.clearStats();
    await this.hintsController.prepareRoundImage();
    this.view.clearRoundConst();
    this.setOneSentence();
    this.buttonsController.changeCheckButton(false);
  }

  private saveCompletedRound(): void {
    StorageService.updateCompletedRounds(this.dataController.level, this.dataController.round);
  }

  private findNext(lastRound: SavedRound): SavedRound {
    let { level, round } = lastRound;

    if (level === 1 && round === 0) {
      if (isNotNullable(StorageService.getCompletedRounds())[1].includes(0)) {
        round += 1;
        return { level, round };
      }
      return lastRound;
    }

    if (round + 1 < this.dataController.getRoundsPerLevel(level)) {
      round += 1;
    } else {
      level = checkLevel(level + 1);
      round = 0;
    }
    return { level, round };
  }

  private showResults(): void {
    const data = this.roundDataController.getStats();
    this.statsPageController.renderStatsPage(data);
  }

  private hideResults(): void {
    this.statsPageController.hideStatsPage();
  }
}
