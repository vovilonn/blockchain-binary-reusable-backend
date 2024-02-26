import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NOT_ACTIVATED_USER_MESSAGE } from "@magnetmlm/common";

@Injectable()
export class ActivatedUser implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.uid) {
      throw new ForbiddenException(NOT_ACTIVATED_USER_MESSAGE);
    }

    return true;
  }
}