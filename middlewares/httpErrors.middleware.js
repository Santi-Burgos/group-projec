export class HttpError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError{
  constructor(message = 'BadRequest'){
    super(message, 400);
  }
}

export class UnauthorizedError extends HttpError{
  constructor(message = 'Unauthorized'){
    super(message, 401);
  }
}

export class EntityNotFound extends HttpError{
  constructor(message = 'EntityNotFound'){
    super(message, 404);
  }
}

export class InternalServerError extends HttpError{
  constructor(message = 'InternalServerError'){
    super(message, 500);
  }
}



