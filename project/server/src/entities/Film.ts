import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Film {
  // number 타입의 변수는 TypeGraphQL에 의해 GraphQL 타입으로 생성될 때 자동으로 Float 타입으로 변경된다.
  // id, director_id는 정수만 사용하므로 Int를 명시적으로 작성했다.
  @Field(() => Int, { description: '영화 고유 아이디' })
  id: number;

  // 기본 값이 String이라 () => String은 생략
  @Field({ description: '영화 제목' })
  title: string;

  @Field({ nullable: true, description: '영화 부제목' })
  subtitle?: string;

  @Field({ description: '영화 장르' })
  genre: string;

  @Field({ description: '영화 러닝 타임, minute' })
  runningTime: number;

  @Field({ description: '영화 줄거리 및 설명' })
  description: string;

  @Field(() => Int, { description: '제작자 고유 아이디' })
  director_id: number;

  @Field({ description: '포스터 이미지 URL' })
  posterImg: string;

  @Field({ description: '개봉일' })
  release: string;
}
