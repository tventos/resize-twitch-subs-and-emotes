import { Container, interfaces } from 'inversify';
import { makeFluentProvideDecorator } from 'inversify-binding-decorators';
import getDecorators from 'inversify-inject-decorators';
import Factory = interfaces.Factory;

export let ioc = new Container();
const fluentProvide = makeFluentProvideDecorator(ioc);

export function provide(identifier: any) {
  return fluentProvide(identifier).done();
}

export function provideSingleton(identifier: any) {
  return fluentProvide(identifier).inSingletonScope().done();
}

export function providePerRequest(identifier: any) {
  return fluentProvide(identifier).inTransientScope().done();
}

export function provideFactory(identifier: any, factory: any) {
  ioc.bind<Factory<typeof identifier>>(factory).toFactory<typeof identifier>(factory);

  return fluentProvide(identifier).done();
}

export const { lazyInject } = getDecorators(ioc);

export function initIOC(localIoc?: Container) {
  localIoc = localIoc || ioc;
  ioc = localIoc;
}
