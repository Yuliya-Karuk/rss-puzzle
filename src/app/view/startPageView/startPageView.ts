import { createElementWithProperties } from '../../../utils/utils';
import styles from './startPageView.module.scss';
import startImgPath from '../../../img/start_image.png';
import greetingPath from '../../../img/greeting13.png';
import { startGameRules, startPageText } from '../../../utils/constants';

export class StartPageView {
  public element: HTMLElement;
  public greetingText: HTMLSpanElement;

  constructor() {
    this.element = createElementWithProperties('main', styles.start);
    this.createChildren();
  }

  private createChildren(): void {
    const rules = createElementWithProperties('div', styles.startRules);
    const greeting = createElementWithProperties('img', styles.startGreeting, {
      alt: 'login image',
      src: `${greetingPath}`,
    });
    this.greetingText = createElementWithProperties('span', styles.startGreetingText);
    const descriptionText = createElementWithProperties('p', styles.startText, undefined, [
      { innerHTML: `${startPageText}` },
    ]);
    const rulesText = createElementWithProperties('p', styles.startText, undefined, [
      { innerHTML: `${startGameRules}` },
    ]);
    const startImageContainer = createElementWithProperties('div', styles.startImageContainer);
    const startImage = createElementWithProperties('img', styles.startImage, {
      alt: 'login image',
      src: `${startImgPath}`,
    });
    rules.append(descriptionText, rulesText);
    startImageContainer.append(startImage, greeting, this.greetingText);
    this.element.append(startImageContainer, rules);
  }

  public getStartPage(): HTMLElement {
    return this.element;
  }
}
