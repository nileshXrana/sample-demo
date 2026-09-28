import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './infrastructure/database/data-source';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './infrastructure/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { JobsModule } from './features/jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude(
      {
        path: 'auth/login',
        method: RequestMethod.POST,
      },
      {
        path: 'auth/register',
        method: RequestMethod.POST,
      },
    ).forRoutes('*');
  }
}
