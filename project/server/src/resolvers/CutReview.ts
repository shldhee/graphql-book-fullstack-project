import { IsInt, IsString } from 'class-validator';
import { Arg, Ctx, Field, InputType, Int, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { MyContext } from '../apollo/createApolloServer';
import { CutReview } from '../entities/CutReview';
import { isAuthenticated } from '../middlewares/isAuthenticated';

@InputType()
class CreateOrUpdateCutReviewInput {
  @Field(() => Int, { description: '명장면 번호' })
  @IsInt()
  cutId: number;

  @Field({ description: '감상평 내용' })
  @IsString()
  contents: string;
}

@Resolver(CutReview)
export class CutReviewResolver {
  @Mutation(() => CutReview, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async createOrUpdateCutReview(
    @Arg('cutReviewInput') cutReviewInput: CreateOrUpdateCutReviewInput,
    @Ctx() { verifiedUser }: MyContext,
  ): Promise<CutReview | null> {
    if (!verifiedUser) return null;
    const { contents, cutId } = cutReviewInput;
    const prevCutReview = await CutReview.findOne({
      where: { cutId, user: { id: verifiedUser.userId } },
    });

    if (prevCutReview) {
      prevCutReview.contents = contents;
      return prevCutReview.save();
    }

    const cutReview = CutReview.create({
      contents: cutReviewInput.contents,
      cutId: cutReviewInput.cutId,
      user: {
        id: verifiedUser.userId,
      },
    });

    return cutReview.save();
  }

  @Mutation(() => Boolean)
  test111(): boolean {
    return true;
  }
}
