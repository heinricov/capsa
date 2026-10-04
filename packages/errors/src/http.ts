import { AppError } from "./base.ts"
import { ErrorCode } from "./codes.ts"

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400, ErrorCode.BAD_REQUEST)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, ErrorCode.UNAUTHORIZED)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, ErrorCode.FORBIDDEN)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404, ErrorCode.NOT_FOUND)
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409, ErrorCode.CONFLICT)
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation Error") {
    super(message, 422, ErrorCode.VALIDATION_ERROR)
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500, ErrorCode.INTERNAL_SERVER_ERROR, false)
  }
}
