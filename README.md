# 1. Подключение

# Установить в основном проекте `passport`

Если сделать установку тут, то стратегии не будут видны в основном модуле

### Файл app.module.ts

```import { CacheModule, Global, Module } from '@nestjs/common';
import { AuthModule as MainAuthModule } from '@magnetmlm/common-backend';

@Global()
@Module({
  imports: [
    CacheModule.register(),
    MainAuthModule,
    ...
    ],
  providers: [
    LoggerService,
    ...
  ],
})
export class AppModule {}
```

### Только в основном проекте (указаны только нужные для этой библиотеки зависимости)

### user.module.ts

```import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EndpointSigStrategy } from '@magnetmlm/common-backend';

@Global()
@Module({
  providers: [
   ...
    { provide: 'UserService', useExisting: UserService },
  ],
  exports: [..., 'UserService'],
})
export class UserModule {}
```

# 2. Роли

Наличие роли проверяется в RolesGuard из `roles.guard.ts`
Чтобы в проекте использовать роли нужно повесить UseGuards декоратор на контроллер, только после этого в ендпоинтах можно будет проверять роль:

### user.controller.ts

```import { Reflector } from '@nestjs/core';
import {
  JwtAuthGuard, RolesGuard
} from '@magnetmlm/common-backend';

@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
export class UserController {...}
```

Чтобы для определенного ендпоинта проверялась роль, надо на него повесить декоратор с нужной ролью:

```
import { SetRoles } from '@magnetmlm/common-backend';
import { UserRole } from '@magnetmlm/common';
  @Post('/grant-role')
  @SetRoles(UserRole.Admin)
  [...other decorators]
  async grantRoles(@Body() body: GrantRoleDto): Promise<void> {
    return this.userService.grantRoles(body);
  }
```

# 3. Обязательная подпись для любого ендпоинта

Чтобы повесить обязательную подпись на ендпоинт, нужно повесить на ендпоинт стратегию `endpointSignature`
(чтобы можно было добавлять подпись в свагере - `@ApiHeader({ name: 'signature' }))`

```
import {
  CommonAuthStrategies,
} from '@magnetmlm/common-backend';

@Controller('user')
@ApiTags('User')
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiBearerAuth()
export class UserController {

  @Post('/grant-role')
  @UseGuards(AuthGuard(CommonAuthStrategies.endpointSignature))
  @ApiHeader({ name: 'signature' })
  async grantRoles(@Body() body: GrantRoleDto): Promise<void> {
    return this.userService.grantRoles(body);
  }
}
```

По дефолту при подключении библиотеки уже есть ендпоинт /sign/endpoint-message (реализация в `auth.service.ts`) который отправляет сообщение для подписи для конкретного ендпоинта.
В данном случае передаваемые параметры будут такими:
`method: MethodType.POST`
`path: 'user/grant-role'`
Сообщение нужно подписать через метамаск и результат передать в хедер `signature`

# 4. Запрос с одного сервиса на другой

Для того чтобы можно было делать такие запросы необходимо чтобы в configService были такие переменные `serviceId` и `jwtSercet`
