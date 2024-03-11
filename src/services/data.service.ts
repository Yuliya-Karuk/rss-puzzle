import { wordCollection1 } from '../data/wordCollectionLevel1';
import { wordCollection2 } from '../data/wordCollectionLevel2';
import { wordCollection3 } from '../data/wordCollectionLevel3';
import { wordCollection4 } from '../data/wordCollectionLevel4';
import { wordCollection5 } from '../data/wordCollectionLevel5';
import { wordCollection6 } from '../data/wordCollectionLevel6';
import { WordCollection } from '../types/interfaces';

const CollectionPerLevel: { [key: number]: WordCollection } = {
  1: wordCollection1,
  2: wordCollection2,
  3: wordCollection3,
  4: wordCollection4,
  5: wordCollection5,
  6: wordCollection6,
};

export class DataService {
  public level: number;
  public round: number;
  private dataOnLevel: WordCollection;
  public roundPerLevel: number;

  constructor() {
    this.level = 1;
    this.round = 0;
    this.dataOnLevel = CollectionPerLevel[this.level];
    this.roundPerLevel = CollectionPerLevel[this.level].roundsCount;
  }

  public getSentence(sentenceNumber: number): string {
    return this.dataOnLevel.rounds[this.round].words[sentenceNumber].textExample;
  }
}
