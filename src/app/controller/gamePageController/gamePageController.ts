import { wordCollectionLevel1 } from '../../../data/wordCollectionLevel1';
import { WordData } from '../../../types/interfaces';
import { shuffleWords } from '../../../utils/utils';
import { GamePageView } from '../../view/gamePageView/gamePageView';

const firstSentence: WordData = wordCollectionLevel1.rounds[0].words[0];

export class GamePageController {
  public view: GamePageView;
  public correctSentence: string[];
  public shuffleSentence: string[];
  public sentenceNumber: number;
  public wordCounter: number;

  constructor() {
    this.view = new GamePageView();
    this.sentenceNumber = 0;
    this.wordCounter = 0;
  }

  public renderOneSentence(): void {
    this.correctSentence = firstSentence.textExample.split(' ');
    this.shuffleSentence = shuffleWords(this.correctSentence);
    this.view.renderSentence(this.shuffleSentence, this.sentenceNumber);
  }

  public createGamePage(): HTMLElement {
    this.renderOneSentence();
    this.bindGameListeners();
    return this.view.getGamePage();
  }

  private bindGameListeners(): void {
    const context = this;
    for (let i = 0; i < this.view.sourceData.children.length; i += 1) {
      const item = this.view.sourceData.children[i];
      item.addEventListener('click', () => {
        if (item.parentElement === this.view.sourceData) {
          this.moveWordToResult(item, this.view.results.children[this.sentenceNumber], 1);
        }
      });
    }
    window.addEventListener('resize', () => context.changeWordsSize());
  }

  private moveWordToResult(word: Element, destination: Element, num: number): void {
    destination.children[this.wordCounter].replaceWith(word);
    this.wordCounter += num;
  }

  private changeWordsSize(): void {
    this.view.setWordsSize();
  }
}
