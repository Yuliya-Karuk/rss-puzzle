import { createElementWithProperties } from '../../utils/utils';
import styles from './header.module.scss';
import logoPath from '../../img/logo.png';

export class Header {
  private gameName: string;
  public element: HTMLElement;
  public logoutButton: HTMLButtonElement;

  constructor() {
    this.gameName = 'English Puzzles';
    this.element = createElementWithProperties('header', styles.header);
    this.createChildren();
  }

  private createChildren(): void {
    const headerWrapper = createElementWithProperties('div', styles.headerWrapper);
    const headerLogo = createElementWithProperties('div', styles.headerLogo);
    const img = createElementWithProperties('img', styles.headerImg, {
      alt: 'logo image',
      src: `${logoPath}`,
    });
    const title = createElementWithProperties('h1', styles.headerTitle, undefined, [{ innerText: `${this.gameName}` }]);
    this.logoutButton = createElementWithProperties('button', 'btn', { type: 'button' }, [{ innerText: `Logout` }]);
    headerLogo.append(img, title);
    headerWrapper.append(headerLogo, this.logoutButton);
    this.element.append(headerWrapper);
  }

  public getComponent(): HTMLElement {
    return this.element;
  }
}
