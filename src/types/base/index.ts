export interface IOneResponse {
  is_error: boolean;
  code: string;
  message: string;
  data: Object | null | undefined;
  error: Object | null | undefined;
  status_code: number;
}

export interface IManyResponse {
  is_error: boolean;
  code: string;
  message: string;
  total: number;
  data: Object | null;
  error: Object | null;
  status_code: number;
}
