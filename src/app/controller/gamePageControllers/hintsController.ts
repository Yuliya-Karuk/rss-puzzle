import { type GamePageView } from '../../view/gamePageView/gamePageView';

export class HintsController {
  private view: GamePageView;
  private translation: string;

  constructor(view: GamePageView) {
    this.view = view;
  }

  public setTranslation(translation: string): void {
    this.translation = translation;
  }

  public bindHintsListeners(): void {
    this.view.translationHint.getComponent().addEventListener('click', this.handleTranslation.bind(this));
  }

  public setTranslationRow(showGuessed: boolean): void {
    if (this.view.translationHint.isEnabled || showGuessed) {
      this.view.translationRow.innerText = this.translation;
    } else {
      this.view.translationRow.innerText = '';
    }
  }

  private handleTranslation(): void {
    this.view.translationHint.toggleState();
    this.setTranslationRow(false);
  }
}
