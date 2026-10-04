import type { PipeTransform } from '@nestjs/common';
import { BadRequestError } from '@workspace/errors';
import type { ZodType } from 'zod';

/** Validasi input (body/query/param) dengan skema Zod dari @workspace/validators. */
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown): unknown {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const issue = result.error.issues[0];
      const path =
        issue && issue.path.length > 0 ? issue.path.join('.') : 'value';
      throw new BadRequestError(
        `${path}: ${issue?.message ?? 'Invalid value'}`,
      );
    }
    return result.data;
  }
}
