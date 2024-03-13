import { createElementWithProperties } from '../../utils/utils';
import styles from './placeholder.module.scss';

export class Placeholder {
  public element: HTMLDivElement;
  public id: string;

  constructor(id: string) {
    this.id = id;
    this.element = createElementWithProperties('div', styles.placeholder, { id: this.id });
  }

  public getComponent(): HTMLDivElement {
    return this.element;
  }
}
