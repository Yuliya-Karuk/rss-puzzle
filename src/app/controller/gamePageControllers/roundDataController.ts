import { cloneDeep } from 'lodash';
import { SavedRoundSentence, SavedRoundStats } from '../../../types/interfaces';
import { defaultStats } from '../../../utils/constants';

export class RoundDataController {
  private stats: SavedRoundStats;

  constructor() {
    this.stats = cloneDeep(defaultStats);
  }

  public saveImageInfo(imageUrl: string, imageInfo: string): void {
    this.stats.imageUrl = imageUrl;
    this.stats.imageInfo = imageInfo;
  }

  public saveAudioContext(audioContext: AudioContext): void {
    this.stats.audioContext = audioContext;
  }

  public saveOneSentence(statsItem: SavedRoundSentence, isKnown: boolean): void {
    if (isKnown) {
      this.stats.known.push(statsItem);
    } else {
      this.stats.unknown.push(statsItem);
    }
  }

  public getStats(): SavedRoundStats {
    return this.stats;
  }

  public clearStats(): void {
    this.stats = cloneDeep(defaultStats);
  }
}
