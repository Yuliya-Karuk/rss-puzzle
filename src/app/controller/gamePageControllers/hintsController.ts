import { type GamePageView } from '../../view/gamePageView/gamePageView';
import { LoaderService } from '../../../services/loader.service';

export class HintsController {
  private view: GamePageView;
  private translation: string;
  private audioSource: string;
  private audioContext: AudioContext;
  private audio: AudioBuffer;

  constructor(view: GamePageView) {
    this.view = view;
    this.audioContext = new AudioContext();
  }

  public setHintsConst(translation: string, audioSource: string): void {
    this.translation = translation;
    this.audioSource = audioSource;
    this.getAudio();
  }

  public bindHintsListeners(): void {
    this.view.translationHint.getComponent().addEventListener('click', this.handleTranslationHint.bind(this));
    this.view.audioHint.getComponent().addEventListener('click', this.handleAudioHint.bind(this));
    this.view.playButton.addEventListener('click', this.handlePlayAudio.bind(this));
  }

  public setTranslationRow(showGuessed: boolean): void {
    if (this.view.translationHint.isEnabled || showGuessed) {
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

    this.startAnimationSound();
    source.addEventListener('ended', () => {
      this.finishAnimationSound();
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

  public setPlayButton(showPlayButton: boolean): void {
    if (this.view.audioHint.isEnabled || showPlayButton) {
      this.view.playButton.classList.remove('button-sound_hidden');
    } else {
      this.view.playButton.classList.add('button-sound_hidden');
    }
  }
}
