import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as shiroTrie from 'shiro-trie';
import jwt_decode from 'jwt-decode';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException(
        'You need to be authenticated to access this resource',
      );
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt_decode<any>(token);

    const permissions = shiroTrie.newTrie();
    permissions.add(decodedToken?.claims);

    if (permissions.check(requiredPermissions)) {
      return true;
    } else {
      throw new ForbiddenException('Forbidden: Insufficient Permissions');
    }
  }
}
