import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FaHeart } from 'react-icons/fa';
import { CutDocument, CutQuery, CutQueryVariables, useMeQuery, useVoteMutation } from '../../generated/graphql';
import FilmCutReview from './FilmCutReview';
import FilmCutReviewDelete from './FilmCutReviewDelete';
import FilmCutReviewRegiModal from './FilmCutReviewRegiModal';

interface FilmCutDetailProps {
  cutImg: string;
  cutId: number;
  isVoted?: boolean;
  votesCount?: number;
  reviews: CutQuery['cutReviews'];
}

export default function FilmCutDetail({
  cutImg,
  cutId,
  isVoted = false,
  votesCount = 0,
  reviews,
}: FilmCutDetailProps): JSX.Element {
  const toast = useToast();
  const voteButtonColor = useColorModeValue('gray.500', 'gray.400');
  const reviewRegidialog = useDisclosure();
  const deleteAlert = useDisclosure();
  const [vote, { loading: voteLoading }] = useVoteMutation({
    variables: { cutId },
    update: (cache, fetchResult) => {
      const currentCut = cache.readQuery<CutQuery, CutQueryVariables>({
        query: CutDocument,
        variables: { cutId },
      });
      if (currentCut && currentCut.cut) {
        if (fetchResult.data?.vote) {
          cache.writeQuery<CutQuery, CutQueryVariables>({
            query: CutDocument,
            variables: {
              cutId: currentCut.cut.id,
            },
            data: {
              __typename: 'Query',
              ...currentCut,
              cut: {
                ...currentCut.cut,
                votesCount: isVoted ? currentCut.cut.votesCount - 1 : currentCut.cut.votesCount + 1,
                isVoted: !isVoted,
              },
            },
          });
        }
      }
    },
  });

  const accessToken = localStorage.getItem('access_token');
  const { data: userData } = useMeQuery({ skip: !accessToken });
  const isLoggedIn = useMemo(() => {
    if (accessToken) return userData?.me?.id;
    return false;
  }, [accessToken, userData?.me?.id]);
  return (
    <Box>
      <AspectRatio ratio={16 / 9}>
        <Image src={cutImg} objectFit="cover" fallbackSrc="" />
      </AspectRatio>

      <Box py={4}>
        <Flex justify="space-between" alignItems="center">
          <Heading size="sm">{cutId}번째 사진</Heading>
          <HStack spacing={1} alignItems="center">
            <Button
              color={isVoted ? 'pink.400' : voteButtonColor}
              aria-label="like-this-cut-button"
              leftIcon={<FaHeart />}
              isLoading={voteLoading}
              onClick={() => {
                if (isLoggedIn) vote();
                else {
                  toast({
                    status: 'warning',
                    description: '좋아요 표시는 로그인한 이후 가능합니다.',
                  });
                }
              }}
            >
              <Text>{votesCount}</Text>
            </Button>
            <Button colorScheme="teal" onClick={reviewRegidialog.onOpen}>
              감상 남기기
            </Button>
          </HStack>
        </Flex>
        <Box mt={6}>
          {!reviews || reviews.length === 0 ? (
            <Center minH={100}>
              <Text>제일 먼 감상을 남겨보세요!</Text>
            </Center>
          ) : (
            <SimpleGrid mt={3} spacing={4} columns={{ base: 1, sm: 2 }}>
              {reviews.slice(0, 2).map((review) => (
                <FilmCutReview
                  key={review.id}
                  author={review.user.username}
                  contents={review.contents}
                  isMine={review.isMine}
                  onEditClick={reviewRegidialog.onOpen}
                  onDeleteClick={deleteAlert.onOpen}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Box>

      <FilmCutReviewRegiModal cutId={cutId} isOpen={reviewRegidialog.isOpen} onClose={reviewRegidialog.onClose} />
      <FilmCutReviewDelete
        target={reviews?.find((review) => review.isMine)}
        isOpen={deleteAlert.isOpen}
        onClose={deleteAlert.onClose}
      />
    </Box>
  );
}
