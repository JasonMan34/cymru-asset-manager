export class NamedError extends Error {
  public readonly internalError?: Error;

  public readonly properties?: Record<any, any>;

  constructor(name: string, properties?: Record<any, any>, internalError?: Error) {
    super();
    this.name = name;
    this.properties = properties;
    this.internalError = internalError;
  }
}
