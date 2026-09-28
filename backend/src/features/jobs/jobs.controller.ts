import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { Role } from 'src/infrastructure/enums/role.enum';
// import { AuthenticatedRequest } from 'src/infrastructure/interfaces/request.interface';
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    years_of_experience?: number;
    about?: string;
    resume?: string | null;
    skills: string[];
  };
}
import {
  ChangeApplicationStatusDto,
  CreateJobDto,
  JobQueryDto,
  UpdateJobDto,
} from './jobs.dto';

@Controller()
export class JobsController {
  constructor(private readonly service: JobsService) {}

  @Roles(Role.Admin)
  @Post('jobs')
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateJobDto) {
    return this.service.create(req.user.id, dto);
  }

  @Roles(Role.Admin)
  @Patch('jobs/:id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.service.update(req.user.id, id, dto);
  }

  @Roles(Role.Admin)
  @Patch('jobs/:id/close')
  close(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.close(req.user.id, id);
  }

  @Get('jobs')
  list(@Query() query: JobQueryDto, @Req() req: AuthenticatedRequest) {
    return this.service.list(query, req.user.role === Role.Applicant);
  }

  @Get('jobs/:id')
  detail(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.Applicant)
  @Post('jobs/:id/applications')
  apply(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.apply(req.user.id, id);
  }

  @Get('applications')
  applications(
    @Req() req: AuthenticatedRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
  ) {
    return this.service.applicationsFor(
      req.user.id,
      req.user.role === Role.Admin,
      Number(page),
      Number(limit),
      status as any,
    );
  }

  @Post('applications/:id/status')
  changeStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: ChangeApplicationStatusDto,
  ) {
    return this.service.changeStatus(req.user, id, dto.status);
  }
}
