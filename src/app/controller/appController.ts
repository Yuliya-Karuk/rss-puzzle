import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { StartPageController } from './startPageController/startPageController';

export class AppController {
  public header: Header;
  public footer: Footer;
  public startPageController: StartPageController;

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
}
