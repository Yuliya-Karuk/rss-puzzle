import { type DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';
import { StorageService } from '../../../services/storage.service';
import { isNotNullable } from '../../../utils/utils';
import { type GamePageView } from '../../view/gamePageView/gamePageView';

export class HintsController {
  private view: GamePageView;
  private audioContext: AudioContext;
  private audio: AudioBuffer;
  public imageUrl: string;
  private dataController: DataService;

  constructor(view: GamePageView, dataController: DataService) {
    this.view = view;
    this.dataController = dataController;
    this.audioContext = new AudioContext();
  }

  public setHints(): void {
    this.setTranslationRow(false);
    this.setPlayButton(false);
    this.setWordsBackground(false);

    this.getAudio();
  }

  public bindHintsListeners(): void {
    this.view.translationHint.getComponent().addEventListener('pointerup', this.handleTranslationHint.bind(this));

    this.view.audioHint.getComponent().addEventListener('pointerup', this.handleAudioHint.bind(this));

    this.view.playButton.addEventListener('pointerup', this.handlePlayAudio.bind(this));

    this.view.imageHint.getComponent().addEventListener('pointerup', this.handleImageHint.bind(this));
  }

  public setTranslationRow(sentenceIsComplete: boolean): void {
    if (this.view.translationHint.isEnabled || sentenceIsComplete) {
      this.view.translationRow.innerText = this.dataController.translation;
    } else {
      this.view.translationRow.innerText = '';
    }
  }

  private handleTranslationHint(): void {
    this.view.translationHint.toggleState();
    this.setTranslationRow(false);
  }

  private async getAudio(): Promise<void> {
    this.audio = await LoaderService.getAudio(this.dataController.audioUrl, this.audioContext);
  }

  public getAudioBuffer(): AudioBuffer {
    return this.audio;
  }

  public getAudioContext(): AudioContext {
    return this.audioContext;
  }

  private handlePlayAudio(): void {
    const source = this.audioContext.createBufferSource();
    source.buffer = this.audio;
    source.connect(this.audioContext.destination);
    source.start(this.audioContext.currentTime);

    this.view.playButton.setAttribute('disabled', 'disabled');

    this.startAnimationSound();

    source.addEventListener('ended', () => {
      this.finishAnimationSound();
      this.view.playButton.removeAttribute('disabled');
    });
  }

  private startAnimationSound(): void {
    this.view.playButton.classList.add('button-sound_shaking');
  }

  private finishAnimationSound(): void {
    this.view.playButton.classList.remove('button-sound_shaking');
  }

  private handleAudioHint(): void {
    this.view.audioHint.toggleState();
    this.setPlayButton(false);
  }

  public setPlayButton(sentenceIsComplete: boolean): void {
    if (this.view.audioHint.isEnabled || sentenceIsComplete) {
      this.view.playButton.classList.remove('button-sound_hidden');
    } else {
      this.view.playButton.classList.add('button-sound_hidden');
    }
  }

  public async prepareRoundImage(): Promise<void> {
    this.imageUrl = await LoaderService.getImage(this.dataController.roundData.imageSrc);
    this.view.setImageUrl(this.imageUrl);
  }

  private handleImageHint(): void {
    this.view.imageHint.toggleState();
    this.setWordsBackground(false);
  }

  public setWordsBackground(sentenceIsComplete: boolean): void {
    if (this.view.imageHint.isEnabled || sentenceIsComplete) {
      this.view.wordsRightOrder.forEach(word => word.showBackground());
    } else {
      this.view.wordsRightOrder.forEach(word => word.hideBackground());
    }
  }

  public setHintsState(): void {
    const hints = isNotNullable(StorageService.getHintsState());

    this.view.translationHint.setState(hints.translationHint);
    this.view.audioHint.setState(hints.audioHint);
    this.view.imageHint.setState(hints.imageHint);
  }
}
