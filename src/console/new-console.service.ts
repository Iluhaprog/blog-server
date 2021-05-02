import { Command, Console } from 'nestjs-console';
import { UserService } from '../user/user.service';
import { LocaleService } from '../locale/locale.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Console({
  name: 'new',
  description: 'Create new locale, user',
})
export class NewConsoleService {
  constructor(
    private readonly userService: UserService,
    private readonly localeService: LocaleService,
  ) {}

  @Command({
    description: 'Create user for app',
    command: 'user  <login> <password> <email>',
  })
  async createUser(
    login: string,
    password: string,
    email: string,
  ): Promise<void> {
    const locales = await this.localeService.findAll();
    const newUser: CreateUserDto = {
      avatar: '',
      email: email,
      login: login,
      password: password,
      userData: locales?.map((locale) => ({
        firstName: '',
        lastName: '',
        about: '',
        locale: locale,
      })),
    };
    await this.userService.create(newUser);
  }

  @Command({
    command: 'locale <name>',
    description: 'Create locale of the app',
  })
  async createLocale(name: string): Promise<void> {
    try {
      await this.localeService.create({ name });
    } catch (e) {
      console.log(e);
    }
  }
}
