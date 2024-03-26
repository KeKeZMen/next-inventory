export class ApiError extends Error {
  constructor(message: string) {
    super(message);
  }

  static unauthorized() {
    return new ApiError("Вы не авторизованы");
  }

  static noEnoughRights() {
    return new ApiError("Недостаточно прав");
  }

  static badRequest(message: string) {
    return new ApiError(message);
  }
}
