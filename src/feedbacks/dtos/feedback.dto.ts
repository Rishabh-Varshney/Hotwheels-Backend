import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class FeedbackInput {
  @Field((type) => Int)
  productId: number;

  @Field((type) => String)
  description: string;
}

@ObjectType()
export class FeedbackOutput extends CoreOutput {}
