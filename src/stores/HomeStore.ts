import { observable } from 'mobx';
import { provideSingleton } from '@src/ioc/ioc';

@provideSingleton(HomeStore)
export class HomeStore {
  @observable public params = 1;
}
