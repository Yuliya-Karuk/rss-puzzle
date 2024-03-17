import { SavedRoundStats } from '../../../types/interfaces';
import { createElementWithProperties } from '../../../utils/utils';
import styles from './statsPageView.module.scss';

const ModalConst = {
  showModal: 'modal_active',
};

// const this.data = {
//   imageUrl:
//     'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-this.data/main/images/level1/cut/giuseppe.jpg',
//   imageInfo: 'ALBOTTO, Francesco- San Giuseppe di Castello (1745 yr)',
//   known: [
//     {
//       sentenceId: 's_0',
//       sentence: 'He spent all his money. There is none left',
//       audio: 'audio',
//     },
//     {
//       sentenceId: 's_1',
//       sentence: 'He spent all his money. There is none left',
//       audio: 'audio',
//     },
//     {
//       sentenceId: 's_2',
//       sentence: 'He spent all his money. There is none left',
//       audio: 'audio',
//     },
//     {
//       sentenceId: 's_3',
//       sentence: 'He spent all his money. There is none left',
//       audio: 'audio',
//     },
//     {
//       sentenceId: 's_4',
//       sentence: 'He spent all his money. There is none left',
//       audio: 'audio',
//     },
//   ],
//   unknown: [
//     {
//       sentenceId: 's_5',
//       sentence: 'He spent all his money. There is none left',
//       audio: 'audio',
//     },
//     {
//       sentenceId: 's_6',
//       sentence: 'He spent all his money. There is none left',
//       audio: 'audio',
//     },
//     {
//       sentenceId: 's_7',
//       sentence: 'He spent all his money. There is none left',
//       audio: 'audio',
//     },
//     {
//       sentenceId: 's_8',
//       sentence: 'He spent all his money. There is none left',
//       audio: 'audio',
//     },
//     {
//       sentenceId: 's_9',
//       sentence: 'He spent all his money. There is none left',
//       audio: 'audio',
//     },
//   ],
// };

export class StatsPageView {
  public element: HTMLDivElement;
  public container: HTMLDivElement;
  public imageBlock: HTMLDivElement;
  public results: HTMLDivElement;
  public buttons: HTMLButtonElement[];
  private data: SavedRoundStats;

  constructor() {
    this.element = createElementWithProperties('div', 'modal');
    this.renderContent();
  }

  private renderContent(): void {
    this.container = createElementWithProperties('div', styles.modalContent);
    const title = createElementWithProperties('h2', styles.modalTitle, undefined, [{ innerText: 'Results' }]);
    this.imageBlock = createElementWithProperties('div', styles.modalImageBlock);
    this.results = createElementWithProperties('div', styles.modalResults);
    this.container.append(title, this.imageBlock, this.results);
    this.element.append(this.container);
  }

  public getComponent(): HTMLDivElement {
    return this.element;
  }

  public renderRoundData(data: SavedRoundStats): void {
    this.data = data;
    this.buttons = [];
    this.imageBlock.replaceChildren();
    this.results.replaceChildren();
    this.renderImageBlock();
    this.renderKnownSentences();
    this.renderUnknownSentences();
  }

  private renderImageBlock(): void {
    const img = createElementWithProperties('img', styles.modalImg, {
      alt: 'round image',
      src: `${this.data.imageUrl}`,
    });
    const imgInfo = createElementWithProperties('p', styles.modalImgInfo, undefined, [
      { innerText: this.data.imageInfo },
    ]);
    this.imageBlock.append(img, imgInfo);
  }

  private renderKnownSentences(): void {
    const knownSentences = createElementWithProperties('div', styles.modalResult);
    const knownTitle = createElementWithProperties('h2', styles.modalResultsTitle, undefined, [
      { innerHTML: `I know <b>${this.data.known.length}</b>` },
    ]);
    knownSentences.append(knownTitle);
    for (let i = 0; i < this.data.known.length; i += 1) {
      const item = this.createOneItem(this.data.known[i].sentenceId, this.data.known[i].sentence);
      knownSentences.append(item);
    }
    this.results.append(knownSentences);
  }

  public renderUnknownSentences(): void {
    const unknownSentences = createElementWithProperties('div', styles.modalResult);
    const unknownTitle = createElementWithProperties('h2', styles.modalResultsTitle, undefined, [
      { innerHTML: `I don't know <b>${this.data.unknown.length}</b>` },
    ]);
    unknownSentences.append(unknownTitle);
    for (let i = 0; i < this.data.unknown.length; i += 1) {
      const item = this.createOneItem(this.data.unknown[i].sentenceId, this.data.unknown[i].sentence);
      unknownSentences.append(item);
    }
    this.results.append(unknownSentences);
  }

  private createOneItem(buttonId: string, text: string): HTMLDivElement {
    const item = createElementWithProperties('div', styles.modalItem);
    const btn = createElementWithProperties('button', styles.modalItemAudio, {
      type: 'button',
      id: buttonId,
    });
    const itemText = createElementWithProperties('p', styles.modalItemText, undefined, [{ innerText: text }]);
    item.append(btn, itemText);
    this.buttons.push(btn);
    return item;
  }

  public showPage(): void {
    this.element.classList.add(ModalConst.showModal);
  }

  public hidePage(): void {
    this.element.classList.remove(ModalConst.showModal);
  }
}
