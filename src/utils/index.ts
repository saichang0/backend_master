import { IManyResponse, IOneResponse } from "../types/base";

export const handleSuccessManyResponse = ({
  code,
  message,
  total,
  data,
  status_code = 200,
}: {
  code: string;
  message: string;
  total: number;
  data: Object;
  status_code?: number;
}): IManyResponse => {
  return {
    is_error: false,
    code: code,
    message: message,
    total: total,
    data: data,
    error: null,
    status_code,
  };
};

export const handleSuccessOneResponse = ({
  code,
  message,
  data,
  status_code = 200,
}: {
  code: string;
  message: string;
  data: Object;
  status_code?: number;
}): IOneResponse => {
  return {
    is_error: false,
    code,
    message,
    data,
    error: null,
    status_code,
  };
};

export const handleErrorManyResponse = ({
  code,
  message,
  error,
  status_code = 200,
}: {
  code: string;
  message: string;
  error: Object;
  status_code?: number;
}): IManyResponse => {
  return {
    is_error: true,
    code: code,
    message: message,
    total: 0,
    data: null,
    error: error,
    status_code,
  };
};

export const handleErrorOneResponse = ({
  code,
  message,
  error,
  status_code = 200,
}: {
  code: string;
  message: string;
  error: Object;
  status_code?: number;
}): IOneResponse => {
  return {
    is_error: true,
    code: code,
    message: message,
    data: null,
    error: error,
    status_code,
  };
};
