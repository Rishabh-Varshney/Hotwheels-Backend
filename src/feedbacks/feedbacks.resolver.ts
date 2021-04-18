import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { FeedbackInput, FeedbackOutput } from './dtos/feedback.dto';
import { FeedbackService } from './feedbacks.service';

@Resolver()
export class FeedbackResolver {
  constructor(private readonly feedbackService: FeedbackService) {}
  @Mutation((returns) => FeedbackOutput)
  @Role(['Client', 'Retailer'])
  async createFeedback(
    @AuthUser() customer: User,
    @Args('input')
    feedbackInput: FeedbackInput,
  ): Promise<FeedbackOutput> {
    return this.feedbackService.createFeedback(customer, FeedbackInput);
  }
}
