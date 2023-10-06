import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionsGuard } from './permissions.guard';
import { Permissions } from './permissions.decorator';

// Tokens Examples

// Token 1: (Super Admin) ['PORTAL:*']
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjbGFpbXMiOlsiUE9SVEFMOioiXX0.Sz4JgItWCSi8b30JdVGEL0eMSfeBF7vCOQArcQKn9bM

// Token 2: (Area Reservada access) ['PORTAL:RESERVEDAREA:*']
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjbGFpbXMiOlsiUE9SVEFMOlJFU0VSVkVEQVJFQToqIl19.0vm9rrp8CO4SuGmRq4BHfntQik9BSVtnAjamBUh6FG4

// Token 3: (Commercial Accounts Access) ['PORTAL:COMMERCIAL:ACCOUNTS:*']
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjbGFpbXMiOlsiUE9SVEFMOkNPTU1FUkNJQUw6QUNDT1VOVFM6KiJdfQ.8c19UNyDkhb6jpYmKD6fvLUX7UeSZtzKV2w3m7x1XUQ

@Controller()
@UseGuards(PermissionsGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('portal/comercial/accounts')
  // Only users with Commercial Accounts access
  @Permissions('PORTAL:COMMERCIAL:ACCOUNTS:view')
  getCommercialAccounts() {
    return 'This the commercial accounts page';
  }

  @Get('portal/areareservada')
  // User with basic portal access
  @Permissions('PORTAL:RESERVEDAREA')
  getPortal() {
    return 'Welcome to portal';
  }
}
