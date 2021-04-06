import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector:Reflector){}
  canActivate(context: ExecutionContext) {
    const roles=this.reflector.get<AllowedRoles>('roles',context.getHandler());
    //No metadata----User Is Public
    if(!roles){
      return true;
    }
    //if there is metadata----then this means that we have a user
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user:User = gqlContext['user'];
    //if we don't find a user
    if (!user) {
      return false;
    }
    //we have a user and the resolver is allowed for any user to continue.
    if(roles.includes("Any")){
      return true;
    }
    return roles.includes(user.role);
  }
}
