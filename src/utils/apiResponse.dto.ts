import { ApiResponseStatusEnum } from "./enums.utils";

export class ApiResponseDto<T> {
  status: ApiResponseStatusEnum;
  message: string;
  data: T;

  constructor(status: ApiResponseStatusEnum, message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
