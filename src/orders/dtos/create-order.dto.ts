import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

import { OrderItemOption } from '../entities/order-item.entity';

@InputType()
class CreateOrderItemInput {
  @Field((type) => Int)
  productId: number;

  @Field((type) => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];

  @Field((type) => Int)
  quantity?: number;
}

@InputType()
export class CreateOrderInput {
  @Field((type) => Int)
  storeId: number;

  @Field((type) => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  orderId?: number;
}
