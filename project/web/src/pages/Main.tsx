import React from 'react';
import { Heading } from '@chakra-ui/react';
import FilmList from '../components/film/FilmList';
import CommonLayout from '../components/CommonLayout';

export default function Main(): JSX.Element {
  console.log(process.env);
  console.log(process.env.API_HOST);
  console.log(process.env.API_SUBSCRIPTION_HOST);
  return (
    <CommonLayout>
      <Heading size="lg">최고의 장면을 찾아보세요</Heading>
      <FilmList />
    </CommonLayout>
  );
}
