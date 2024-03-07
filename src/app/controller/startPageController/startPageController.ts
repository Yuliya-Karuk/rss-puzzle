import { StartPageView } from '../../view/startPageView/startPageView';

export class StartPageController {
  public view: StartPageView;

  constructor() {
    this.view = new StartPageView();
  }

  public createStartPage(): HTMLElement {
    return this.view.getStartPage();
  }

  public setGreeting(value: string): void {
    this.view.greetingText.innerText = value;
  }
}
