import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Product } from '../entities/product.entity';

@InputType()
export class CreateProductInput extends PickType(Product, [
  'name',
  'price',
  'description',
  'options',
]) {
  @Field(type => Int)
  storeId: number;
}

@ObjectType()
export class CreateProductOutput extends CoreOutput {}