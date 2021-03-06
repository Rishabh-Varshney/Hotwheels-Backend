import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Store } from './store.entity';

@InputType('ProductChoiceInputType', { isAbstract: true })
@ObjectType()
class ProductChoice {
  @Field(type => String)
  name: string;
  @Field(type => Int, { nullable: true })
  extra?: number;
}

@InputType('ProductOptionInputType', { isAbstract: true })
@ObjectType()
export class ProductOption {
  @Field(type => String)
  name: string;
  @Field(type => [ProductChoice], { nullable: true })
  choices?: ProductChoice[];
  @Field(type => Int, { nullable: true })
  extra?: number;
}

@InputType('ProductInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Product extends CoreEntity {
  @Field(type => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(type => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field(type => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  photo: string;

  @Field(type => String)
  @Column()
  @Length(5, 140)
  description: string;

  @Field(type => Store)
  @ManyToOne(
    type => Store,
    store => store.menu,
    { onDelete: 'CASCADE' },
  )
  store: Store;

  @RelationId((product: Product) => product.store)
  storeId: number;

  @Field(type => [ProductOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: ProductOption[];
}