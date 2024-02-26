import { HttpException } from '@nestjs/common';
export function isHttpException(payload: any): payload is HttpException {
  const _payload = payload as HttpException;
  return (
    _payload.getResponse !== undefined &&
    _payload.getStatus !== undefined &&
    _payload.initMessage !== undefined &&
    _payload.initName !== undefined &&
    _payload.message !== undefined &&
    _payload.name !== undefined
  );
}
