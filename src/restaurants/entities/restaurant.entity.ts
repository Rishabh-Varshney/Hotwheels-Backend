import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Category } from 'src/users/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(type=>String)
  @Column()
  @IsString()
  coverImg:string;

  @Field((type) => String, { defaultValue: 'Gangnam-gu' })
  @Column()
  @IsString()
  address: string;

  @Field(type=>Category)
  @ManyToOne(type=>Category,category=>category.restaurants)
  category:Category;
}
