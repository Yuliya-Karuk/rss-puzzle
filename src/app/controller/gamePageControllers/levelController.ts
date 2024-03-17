import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { type DataService } from '../../../services/data.service';
import { checkLevel, isNotNullable } from '../../../utils/utils';
import { Callback, Level } from '../../../types/types';
import { StorageService } from '../../../services/storage.service';
import { LevelsNumber } from '../../../utils/constants';

export class LevelController {
  private view: GamePageView;
  private dataController: DataService;
  private setRoundCallback: Callback;

  constructor(view: GamePageView, dataController: DataService, setRoundCallback: Callback) {
    this.view = view;
    this.dataController = dataController;
    this.setRoundCallback = setRoundCallback;
  }

  public setSelects(level: Level, round: number): void {
    this.view.levelSelect.selectHeader.addEventListener('click', () => this.view.levelSelect.toggleActive());
    this.view.roundSelect.selectHeader.addEventListener('click', () => this.view.roundSelect.toggleActive());

    this.setLevelsSelect(level);
    this.setRoundsSelect(round + 1);

    document.addEventListener('click', (e: Event) => this.closeSelect(e));
  }

  private setLevelsSelect(level: Level): void {
    this.view.levelSelect.setSelectHeader(level);
    this.view.levelSelect.setItemsNumber(LevelsNumber, []);
    this.view.levelSelect.selectItems.forEach(lvl => lvl.addEventListener('click', () => this.chooseLevel(lvl)));
  }

  public setRoundsSelect(round: number): void {
    this.view.roundSelect.setSelectHeader(round);
    const completedRounds = isNotNullable(StorageService.getCompletedRounds());
    this.view.roundSelect.setItemsNumber(this.dataController.roundPerLevel, completedRounds[this.dataController.level]);
    this.view.roundSelect.selectItems.forEach(el => el.addEventListener('click', () => this.chooseRound(el)));
  }

  private async chooseLevel(level: HTMLDivElement): Promise<void> {
    const levelNumber = isNotNullable(checkLevel(Number(level.id.split('_')[1])));

    this.view.levelSelect.selectHeader.innerText = level.innerText;
    this.view.levelSelect.toggleActive();

    this.dataController.setLevel(levelNumber);

    this.setRoundsSelect(1);

    await this.setRoundCallback();
  }

  private async chooseRound(round: HTMLDivElement): Promise<void> {
    const roundNumber = Number(round.id.split('_')[1]);

    this.view.roundSelect.selectHeader.innerText = round.innerText;
    this.view.roundSelect.toggleActive();

    this.dataController.setRound(roundNumber);
    await this.setRoundCallback();
  }

  private closeSelect(e: Event): void {
    let closestSelect;
    if (e.target instanceof Element) {
      closestSelect = isNotNullable(e.target).closest('.select');
    }
    if ((this.view.roundSelect.checkIsActive() || this.view.levelSelect.checkIsActive()) && !closestSelect) {
      this.view.roundSelect.removeActive();
      this.view.levelSelect.removeActive();
    }
  }
}
