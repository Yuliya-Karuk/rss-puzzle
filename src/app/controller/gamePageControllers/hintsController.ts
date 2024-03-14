import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { LoaderService } from '../../../services/loader.service';
import { LevelData } from '../../../types/interfaces';
import { StorageService } from '../../../services/localStorage.service';
import { isNotNullable } from '../../../utils/utils';

export class HintsController {
  private view: GamePageView;
  private translation: string;
  private audioSource: string;
  private audioContext: AudioContext;
  private audio: AudioBuffer;
  private levelData: LevelData;
  public imageUrl: string;

  constructor(view: GamePageView) {
    this.view = view;
    this.audioContext = new AudioContext();
  }

  public setHints(translation: string, audioSource: string): void {
    this.translation = translation;
    this.audioSource = audioSource;

    this.setTranslationRow(false);
    this.setPlayButton(false);
    this.setWordsBackground(false);

    this.getAudio();
  }

  public setLevelData(levelData: LevelData): void {
    this.levelData = levelData;
  }

  public bindHintsListeners(): void {
    this.view.translationHint.getComponent().addEventListener('click', this.handleTranslationHint.bind(this));
    this.view.audioHint.getComponent().addEventListener('click', this.handleAudioHint.bind(this));
    this.view.playButton.addEventListener('click', this.handlePlayAudio.bind(this));
    this.view.imageHint.getComponent().addEventListener('click', this.handleImageHint.bind(this));
  }

  public setTranslationRow(sentenceIsComplete: boolean): void {
    if (this.view.translationHint.isEnabled || sentenceIsComplete) {
      this.view.translationRow.innerText = this.translation;
    } else {
      this.view.translationRow.innerText = '';
    }
  }

  private handleTranslationHint(): void {
    this.view.translationHint.toggleState();
    this.setTranslationRow(false);
  }

  private async getAudio(): Promise<void> {
    this.audio = await LoaderService.getAudio(this.audioSource, this.audioContext);
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

  public async prepareImage(): Promise<void> {
    this.imageUrl = await LoaderService.getImage(this.levelData.imageSrc);
    this.view.setImageUrl(this.imageUrl);
  }

  private handleImageHint(): void {
    this.view.imageHint.toggleState();
    this.setWordsBackground(false);
  }

  public setWordsBackground(sentenceIsComplete: boolean): void {
    if (this.view.imageHint.isEnabled || sentenceIsComplete) {
      this.view.words.forEach(word => word.showBackground());
    } else {
      this.view.words.forEach(word => word.hideBackground());
    }
  }

  public setHintsState(): void {
    const hints = isNotNullable(StorageService.getHintsState());
    this.view.translationHint.setState(hints.translationHint);
    this.view.audioHint.setState(hints.audioHint);
    this.view.imageHint.setState(hints.imageHint);
  }
}
