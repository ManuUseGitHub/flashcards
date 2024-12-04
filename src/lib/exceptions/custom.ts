class ValidationError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class MissmatchError extends ValidationError {
  constructor(message: string) {
    super(message);
    this.name = 'MissmatchError';
  }
}

export { MissmatchError };
