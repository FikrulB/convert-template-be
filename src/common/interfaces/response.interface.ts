export interface IResponse<T> {
  code: number;
  message: string;
  timestamp: string;
  data: T;
}
