import { createElementWithProperties } from '../../../utils/utils';
import styles from './gamePageView.module.scss';
import { GameConst } from '../../../utils/constants';

export class GamePageView {
  public element: HTMLElement;
  public results: HTMLDivElement;
  public sourceData: HTMLDivElement;
  public words: HTMLDivElement[];

  constructor() {
    this.element = createElementWithProperties('main', styles.game);
    this.words = [];
    this.createChildren();
  }

  private createChildren(): void {
    this.results = createElementWithProperties('div', styles.gameResults);
    for (let i = 0; i < (GameConst.SentencesCount as number); i += 1) {
      const row = createElementWithProperties('div', styles.gameResultsRow);
      this.results.append(row);
    }
    this.sourceData = createElementWithProperties('div', styles.words);
    this.element.append(this.results, this.sourceData);
  }

  public getGamePage(): HTMLElement {
    return this.element;
  }

  public renderSentence(sentence: string[], sentenceNumber: number): void {
    for (let i = 0; i < sentence.length; i += 1) {
      const word = createElementWithProperties('div', styles.wordItem, undefined, [{ innerHTML: `${sentence[i]}` }]);
      const resultWord = createElementWithProperties('div', styles.gameResultsItem);
      this.sourceData.append(word);
      this.results.children[sentenceNumber].append(resultWord);
      this.words.push(word);
    }
  }
}