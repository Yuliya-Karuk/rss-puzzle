import { createElementWithProperties } from '../../utils/utils';
import styles from './customSelect.module.scss';

export class CustomSelect {
  private elementContainer: HTMLDivElement;
  private selectBody: HTMLDivElement;
  public selectHeader: HTMLDivElement;
  private itemsNumber: number;
  public selectItems: HTMLDivElement[];
  private selectText: string;

  constructor(itemsNumber: number, selectText: string) {
    this.itemsNumber = itemsNumber;
    this.selectText = selectText;
    this.selectItems = [];
    this.createNode();
  }

  private createNode(): void {
    this.elementContainer = createElementWithProperties('div', styles.select);
    this.selectHeader = createElementWithProperties('div', styles.selectHeader, undefined, [
      { innerText: `${this.selectText} 1` },
    ]);
    this.selectBody = createElementWithProperties('div', styles.selectBody);
    for (let i = 0; i < this.itemsNumber; i += 1) {
      const selectItem = createElementWithProperties('div', styles.selectItem, { id: `${this.selectText}_${i + 1}` }, [
        { innerText: `${this.selectText} ${i + 1}` },
      ]);
      this.selectBody.append(selectItem);
      this.selectItems.push(selectItem);
    }
    this.elementContainer.append(this.selectHeader, this.selectBody);
  }

  public getComponent(): HTMLDivElement {
    return this.elementContainer;
  }

  public toggleActive(): void {
    this.elementContainer.classList.toggle('select-active');
  }

  public removeActive(): void {
    this.elementContainer.classList.remove('select-active');
  }

  public checkIsActive(): boolean {
    return this.elementContainer.classList.contains('select-active');
  }

  public setItemsNumber(itemsNumber: number): void {
    this.itemsNumber = itemsNumber;
    this.selectBody.replaceChildren();
    this.selectItems = [];
    for (let i = 0; i < this.itemsNumber; i += 1) {
      const selectItem = createElementWithProperties('div', styles.selectItem, { id: `${this.selectText}_${i + 1}` }, [
        { innerText: `${this.selectText} ${i + 1}` },
      ]);
      this.selectBody.append(selectItem);
      this.selectItems.push(selectItem);
    }
  }

  public setSelectHeader(value: number): void {
    this.selectHeader.innerText = `${this.selectText} ${value}`;
  }
}
