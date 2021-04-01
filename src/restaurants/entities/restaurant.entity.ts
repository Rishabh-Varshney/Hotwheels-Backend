import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Category } from 'src/users/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@InputType('RestaurantInputType',{ isAbstract: true })
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
  @ManyToOne(type=>Category,category=>category.restaurants,{nullable: true,onDelete:"SET NULL"})
  category:Category;

  @Field(type=>User,{nullable: true})
  @ManyToOne(type=>User,user=>user.restaurants)
  owner:User;
}
