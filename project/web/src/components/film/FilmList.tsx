/* eslint-disable react/no-array-index-key */
// import { gql, useQuery } from '@apollo/client';
import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react';
import React from 'react';
import { Waypoint } from 'react-waypoint';
import { useFilmsQuery } from '../../generated/graphql';
import FilmCard from './FilmCard';

// interface Film {
//   id: string;
//   title: string;
//   subtitle: string;
// }

// // interface FilmQueryResult {
// //   films: Film[];
// // }
// type FilmQueryResult = {
//   films: Film[];
// };

// const FILMS_QUERY = gql`
//   query ExampleQuery {
//     films {
//       id
//       title
//       subtitle
//     }
//   }
// `;

export default function FilmList(): JSX.Element {
  const LIMIT = 6;
  const { data, loading, error, fetchMore } = useFilmsQuery({
    variables: {
      limit: LIMIT,
      cursor: 1,
    },
  });

  if (error) return <p>error.message</p>;

  return (
    <SimpleGrid columns={[2, null, 3]} spacing={[2, null, 10]}>
      {loading && new Array(6).fill(0).map((x, index) => <Skeleton key={`${index}=${x}`} height="400px" />)}

      {!loading &&
        data &&
        data.films.films.map((film, i) => (
          <Box key={film.id}>
            {data.films.cursor && i === data.films.films.length - LIMIT / 2 && (
              <Waypoint
                onEnter={() => {
                  fetchMore({
                    variables: {
                      limit: LIMIT,
                      cursor: data.films.cursor,
                    },
                  });
                }}
              />
            )}
            <FilmCard film={film} />
          </Box>
        ))}
    </SimpleGrid>
  );
}
