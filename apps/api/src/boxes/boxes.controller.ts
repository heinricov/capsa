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
import {
  type CreateBoxInput,
  type PublicBox,
  type UpdateBoxInput,
  createBoxSchema,
  updateBoxSchema,
} from '@workspace/client/box';
import {
  type PaginatedResponse,
  type PaginationQuery,
  idSchema,
  paginationSchema,
} from '@workspace/client/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Public } from '../common/decorators/public';
import { BoxesService } from './boxes.service';

@Public()
@Controller('boxes')
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(paginationSchema)) query: PaginationQuery,
  ): Promise<PaginatedResponse<PublicBox>> {
    return this.boxesService.list(query);
  }

  @Get(':id')
  get(
    @Param('id', new ZodValidationPipe(idSchema)) id: string,
  ): Promise<PublicBox> {
    return this.boxesService.get(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createBoxSchema)) body: CreateBoxInput,
  ): Promise<PublicBox> {
    return this.boxesService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', new ZodValidationPipe(idSchema)) id: string,
    @Body(new ZodValidationPipe(updateBoxSchema)) body: UpdateBoxInput,
  ): Promise<PublicBox> {
    return this.boxesService.update(id, body);
  }

  @Delete(':id')
  remove(
    @Param('id', new ZodValidationPipe(idSchema)) id: string,
  ): Promise<{ id: string }> {
    return this.boxesService.remove(id);
  }
}
