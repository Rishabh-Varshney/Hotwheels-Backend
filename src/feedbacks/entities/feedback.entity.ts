import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/stores/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToOne, RelationId } from 'typeorm';

@InputType('feedbackInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Feedback extends CoreEntity {
  @Field((type) => User, { nullable: true })
  @OneToOne((type) => User, (user) => user.feedback, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  customer?: User;

  @Field((type) => Product, { nullable: true })
  @ManyToOne((type) => Product, (product) => product.feedback, {
    onDelete: 'SET NULL',
    nullable: true,
    //eager: true,
  })
  product?: Product;

  @RelationId((feedback: Feedback) => feedback.customer)
  customerId: number;

  @RelationId((feedback: Feedback) => feedback.product)
  productId: number;

  @Field((type) => String)
  @Column()
  @Length(0, 300)
  complaint: string;
}
