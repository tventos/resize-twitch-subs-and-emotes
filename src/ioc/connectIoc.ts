import { interfaces } from 'inversify';
import * as React from 'react';
import { ioc } from '@src/ioc/ioc';
import ServiceIdentifier = interfaces.ServiceIdentifier;

const hoistStatics: any = require('hoist-non-react-statics');

interface ILifecycle {
  bind?: (container: interfaces.Container) => void;
  unbind?: (container: interfaces.Container) => void;
}

interface IWrappedComponent<P> {
  wrappedComponent: React.ComponentType<P>;
  wrappedInstance: React.ReactElement<P> | void;
}

function createInjector<P>(
  component: React.ComponentType<P>,
  forInject: { [key: string]: ServiceIdentifier<any> },
  container?: interfaces.Container,
  lifecycle?: { [key: string]: ILifecycle }
) {
  const _container = container || ioc;
  const displayName =
    'inject-' + (component.displayName || (component.constructor && component.constructor.name) || 'Unknown');
  const name = component.name || (component.constructor && component.constructor.name) || 'Unknown';

  class Injector extends React.Component<P> implements IWrappedComponent<P> {
    public static displayName = displayName;
    public static constructorName = name;

    public wrappedInstance: React.ReactElement<P> | void;
    public wrappedComponent: React.ComponentType<P> = component;

    private ioc: {};

    constructor(props: P) {
      super(props);
      if (lifecycle) {
        for (const key in forInject) {
          if (forInject.hasOwnProperty(key)) {
            if (lifecycle[key] && lifecycle[key].bind) {
              lifecycle[key].bind!(container!);
            }
          }
        }
      }
    }

    public componentWillUnmount() {
      if (lifecycle) {
        for (const key in forInject) {
          if (forInject.hasOwnProperty(key)) {
            if (lifecycle[key] && lifecycle[key].unbind) {
              lifecycle[key].unbind!(container!);
            }
          }
        }
      }
    }

    public render() {
      if (!this.ioc) {
        this.ioc = Object.create(null);

        for (const key in forInject) {
          if (forInject.hasOwnProperty(key)) {
            if (!this.ioc[key]) {
              this.ioc[key] = _container.get(forInject[key]);
            }
          }
        }
      }

      const props: {} = this.props;

      const newProps: any = { ...this.ioc, ...props };

      if (!(component.prototype && component.prototype.render)) {
        newProps.ref = this.storeRef;
      }

      return React.createElement(component, newProps);
    }

    private storeRef = (instance: React.ReactElement<P> | void) => {
      this.wrappedInstance = instance;
    };
  }

  Object.defineProperty(Injector, 'name', {
    get: function () {
      return Injector.constructorName;
    },
  });

  hoistStatics(Injector, component);

  return Injector as any;
}

export function connectIoc<P>(
  forInject: { [key: string]: ServiceIdentifier<any> },
  container?: interfaces.Container,
  lifecycle?: { [key: string]: ILifecycle }
): any {
  return (target: React.ComponentType<P>) => createInjector<P>(target, forInject, container, lifecycle);
}
