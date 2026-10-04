import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { PaginatedResponse, PublicAccount } from '@workspace/types';
import type {
  CreateAccountInput,
  PaginationQuery,
  UpdateAccountInput,
} from '@workspace/validators';
import {
  createAccountSchema,
  idSchema,
  paginationSchema,
  updateAccountSchema,
} from '@workspace/validators';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(paginationSchema)) query: PaginationQuery,
  ): Promise<PaginatedResponse<PublicAccount>> {
    return this.accountsService.list(query);
  }

  @Get(':id')
  get(
    @Param('id', new ZodValidationPipe(idSchema)) id: string,
  ): Promise<PublicAccount> {
    return this.accountsService.get(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createAccountSchema)) body: CreateAccountInput,
  ): Promise<PublicAccount> {
    return this.accountsService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', new ZodValidationPipe(idSchema)) id: string,
    @Body(new ZodValidationPipe(updateAccountSchema)) body: UpdateAccountInput,
  ): Promise<PublicAccount> {
    return this.accountsService.update(id, body);
  }

  @Delete(':id')
  remove(
    @Param('id', new ZodValidationPipe(idSchema)) id: string,
  ): Promise<{ id: string }> {
    return this.accountsService.remove(id);
  }
}
