import { wordCollection1 } from '../data/wordCollectionLevel1';
import { wordCollection2 } from '../data/wordCollectionLevel2';
import { wordCollection3 } from '../data/wordCollectionLevel3';
import { wordCollection4 } from '../data/wordCollectionLevel4';
import { wordCollection5 } from '../data/wordCollectionLevel5';
import { wordCollection6 } from '../data/wordCollectionLevel6';
import { LevelData, WordCollection } from '../types/interfaces';
import type { Level } from '../types/types';

const CollectionPerLevel: Record<Level, WordCollection> = {
  1: wordCollection1,
  2: wordCollection2,
  3: wordCollection3,
  4: wordCollection4,
  5: wordCollection5,
  6: wordCollection6,
};

export class DataService {
  public level: Level;
  public round: number;
  private dataOnLevel: WordCollection;
  public roundPerLevel: number;
  public sentence: string;
  public translation: string;
  public audioUrl: string;
  public sentenceNumber: number;
  public roundData: LevelData;
  public correctSentence: string[];
  public sentencePerRound: number;

  constructor() {
    this.sentencePerRound = 9;
    this.level = 1;
    this.round = 0;
    this.sentenceNumber = 0;
    this.dataOnLevel = CollectionPerLevel[this.level];
    this.roundPerLevel = CollectionPerLevel[this.level].roundsCount;
  }

  public setSentence(): void {
    this.sentence = this.dataOnLevel.rounds[this.round].words[this.sentenceNumber].textExample;
    this.translation = this.dataOnLevel.rounds[this.round].words[this.sentenceNumber].textExampleTranslate;
    this.audioUrl = this.dataOnLevel.rounds[this.round].words[this.sentenceNumber].audioExample;
    this.correctSentence = this.sentence.split(' ');
  }

  public setRoundData(): void {
    this.roundData = this.dataOnLevel.rounds[this.round].levelData;
  }

  public setLevel(level: Level): void {
    this.level = level;
    this.dataOnLevel = CollectionPerLevel[this.level];
    this.roundPerLevel = CollectionPerLevel[this.level].roundsCount;
    this.round = 0;
    this.setRoundData();
  }

  public setRound(round: number): void {
    this.round = round - 1;
    this.sentenceNumber = 0;
    this.setRoundData();
  }
}
