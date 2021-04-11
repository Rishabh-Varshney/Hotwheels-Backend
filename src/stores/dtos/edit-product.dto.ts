import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Product } from '../entities/product.entity';

@InputType()
export class EditProductInput extends PickType(PartialType(Product), [
  'name',
  'options',
  'price',
  'description',
]) {
  @Field(type => Int)
  productId: number;
}

@ObjectType()
export class EditProductOutput extends CoreOutput {}