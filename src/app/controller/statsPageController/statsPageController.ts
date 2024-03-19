import { SavedRoundStats } from '../../../types/interfaces';
import { isNotNullable } from '../../../utils/utils';
import { StatsPageView } from '../../view/statsPageView/statsPageView';

export class StatsPageController {
  private view: StatsPageView;
  private parentElement: HTMLBodyElement;
  private data: SavedRoundStats;

  constructor(parentElement: HTMLBodyElement) {
    this.parentElement = parentElement;
    this.view = new StatsPageView();
  }

  public insertStatsView(): void {
    this.parentElement.insertAdjacentElement('beforeend', this.view.getComponent());
  }

  public renderStatsPage(data: SavedRoundStats): void {
    this.data = data;
    this.view.renderRoundData(this.data);
    this.bindStatsListeners();
    this.view.showPage();
  }

  public hideStatsPage(): void {
    this.view.hidePage();
  }

  private bindStatsListeners(): void {
    this.view.buttons.forEach(btn => btn.addEventListener('pointerup', this.playAudio.bind(this, btn)));
  }

  private playAudio(button: HTMLButtonElement): void {
    const audioContext = isNotNullable(this.data.audioContext);
    const sentenceData = [...this.data.known, ...this.data.unknown].filter(el => el.sentenceId === button.id)[0];
    const source = audioContext.createBufferSource();
    source.buffer = sentenceData.audio;
    source.connect(audioContext.destination);
    source.start(audioContext.currentTime);

    button.setAttribute('disabled', 'disabled');

    source.addEventListener('ended', () => {
      button.removeAttribute('disabled');
    });
  }
}
