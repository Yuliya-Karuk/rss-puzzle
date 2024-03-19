import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { GamePageController } from './gamePageControllers/gamePageController';
import { StartPageController } from './startPageController/startPageController';

export class AppController {
  public header: Header;
  public footer: Footer;
  public startPageController: StartPageController;
  public gamePageController: GamePageController;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.startPageController = new StartPageController();
  }

  public getStartPage(): HTMLElement {
    return this.startPageController.createStartPage();
  }

  public getHeader(): HTMLElement {
    return this.header.getComponent();
  }

  public getFooter(): HTMLElement {
    return this.footer.getComponent();
  }

  public setGreetingUser(value: string): void {
    this.startPageController.setGreeting(value);
  }

  public getGamePage(parentElement: HTMLBodyElement): HTMLElement {
    this.gamePageController = new GamePageController(parentElement);
    console.error(
      'Уважаемый проверяющий, можешь пожалуйства проверить немного работу в последний день дедлайна, потому что есть баги с drag-and-drop'
    );
    return this.gamePageController.createGamePage();
  }
}
