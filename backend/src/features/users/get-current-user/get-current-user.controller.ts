import { Controller, Get, Req } from '@nestjs/common';
import { GetCurrentUserHandler } from './get-current-user.handler';
import { type AuthenticatedRequest } from 'src/infrastructure/interfaces/request.interface';
import { Role } from 'src/infrastructure/enums/role.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';

@Controller('users')
export class GetCurrentUserController {
  constructor(private readonly getCurrentUserHandler: GetCurrentUserHandler) {}

  // @Roles(Role.Admin, Role.Applicant)
  @Get('me')
  getCurrentUser(@Req() req: AuthenticatedRequest) {
    return this.getCurrentUserHandler.execute(req.user.id);
  }
}
