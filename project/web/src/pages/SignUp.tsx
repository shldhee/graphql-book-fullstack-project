import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import SignUpForm from '../components/auth/SignUpForm';
import CommonLayout from '../components/CommonLayout';

export default function SignUp(): JSX.Element {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.800')}>
      <CommonLayout>
        <Flex align="center" justify="center">
          <SignUpForm />
        </Flex>
      </CommonLayout>
    </Box>
  );
}
