import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';
import PublicLayout from '../../layouts/PublicLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  LinearProgress,
  Avatar,
} from '@mui/material';
import { CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { Helmet } from 'react-helmet';
import chroma from 'chroma-js';
import moment from 'moment';

const GamePlay = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const { gameId } = useParams();

  const [gameData, setGameData] = useState(null);
  const [playersData, setPlayersData] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const mainColor = gameData?.completedStepColor || '#FFD700';

  // Fetch game data
  useEffect(() => {
    const gameRef = doc(db, 'games', gameId);

    // Listen for real-time updates to the game document
    const unsubscribeGame = onSnapshot(gameRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();
        setGameData(docData);
      }
    });

    return () => unsubscribeGame();
  }, [gameId]);

  // Fetch players data from the players subcollection
  useEffect(() => {
    const playersRef = collection(db, 'games', gameId, 'players');

    const unsubscribePlayers = onSnapshot(playersRef, (snapshot) => {
      const playersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Check if any player's score has changed
      const currentPlayer = playersList.find(
        (player) =>
          player.score !== playersData.find((p) => p.id === player.id)?.score
      );

      if (currentPlayer) {
        setCurrentPlayer(currentPlayer);
      }
      //order player by end time
      playersList.sort((a, b) => {
        if (
          (b.endTime?.seconds || b.endTime?._seconds) &&
          (a.endTime?.seconds || a.endTime?._seconds)
        ) {
          return (
            (a.endTime?.seconds || a.endTime?._seconds) -
            (b.endTime?.seconds || b.endTime?._seconds)
          );
        } else {
          return 0;
        }
      });

      setPlayersData(playersList);
    });

    return () => unsubscribePlayers();
  }, [gameId, playersData]);

  // Reset currentPlayer after 3 seconds to stop the shake
  useEffect(() => {
    if (currentPlayer) {
      const timer = setTimeout(() => {
        setCurrentPlayer(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer]);

  // Determine if the first player has finished
  const firstPlayerFinished = playersData.some(
    (player) => player.score === gameData?.questions?.length
  );

  // Get players who have finished the game
  const finishedPlayers = playersData.filter(
    (player) => player.score === gameData?.questions?.length && player.endTime
  );

  // Sort finished players by endTime
  const rankedPlayers = firstPlayerFinished
    ? [...finishedPlayers].sort((a, b) => a.endTime - b.endTime)
    : [];

  // Function to get medal emoji
  const getMedal = (playerId, rankedPlayers) => {
    const index = rankedPlayers.findIndex((p) => p.id === playerId);
    const numFinished = rankedPlayers.length;

    if (index === 0) {
      return '🥇';
    } else if (index === 1 && numFinished >= 2) {
      return '🥈';
    } else if (index === 2 && numFinished >= 3) {
      return '🥉';
    } else {
      return '';
    }
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>{gameData?.name || ''} - Node Dots</title>
      </Helmet>
      <Container sx={{ mt: 5 }}>
        <Typography
          variant="h1"
          align="center"
          fontSize={24}
          fontWeight={600}
          gutterBottom
        >
          {gameData?.name || 'No title'}
        </Typography>
        {gameData && gameData?.questions && playersData.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              mt: 5,
              maxWidth: 950,
              mx: 'auto',
              overflowX: 'auto',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: gameData?.gameColor + '70',
                      color: 'white',
                      padding: '10px',
                    }}
                  >
                    Joueur
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: gameData?.gameColor + '70',
                      color: 'white',
                      padding: '10px',
                    }}
                  >
                    Progression
                  </TableCell>
                  {firstPlayerFinished && (
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: gameData?.gameColor + '70',
                        color: 'white',
                        padding: '10px',
                      }}
                    >
                      Temps final
                    </TableCell>
                  )}
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: gameData?.gameColor + '70',
                      color: 'white',
                      padding: '10px',
                    }}
                  >
                    Score
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: gameData?.gameColor + '70',
                      color: 'white',
                      padding: '10px',
                    }}
                  >
                    Statut
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {playersData.map((player, pIndex) => {
                  const gameCompleted =
                    player?.score === gameData?.questions?.length;

                  const ratio =
                    (player?.score / gameData?.questions?.length) * 100;
                  const color = chroma(mainColor)
                    .darken((ratio / 100) * 1.2)
                    .hex();

                  // Format end time
                  const endTime =
                    player?.questions && player?.endTime
                      ? moment
                          .unix(
                            player?.questions[player?.score - 1]?.matchedAt
                              ?._seconds ||
                              player?.questions[player?.score - 1]?.matchedAt
                                ?.seconds
                          )
                          .format('HH:mm:ss')
                      : '-';

                  // Get medal if applicable
                  const medal = firstPlayerFinished
                    ? getMedal(player.id, rankedPlayers)
                    : '';

                  return (
                    <TableRow key={pIndex}>
                      <TableCell sx={{ padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={player?.avatar}
                            alt={player?.name}
                            sx={{
                              marginRight: '10px',
                              width: 35,
                              height: 35,
                              animation:
                                currentPlayer?.id === player.id
                                  ? 'shake 0.5s'
                                  : 'none',
                            }}
                          />
                          {player?.name}
                        </div>
                      </TableCell>
                      <TableCell sx={{ padding: '10px', minWidth: '150px' }}>
                        <LinearProgress
                          variant="determinate"
                          value={ratio}
                          sx={{
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: color,
                            },
                            height: '10px',
                            borderRadius: '5px',
                          }}
                        />
                      </TableCell>
                      {firstPlayerFinished && (
                        <TableCell sx={{ padding: '10px' }}>
                          {endTime} {medal}
                        </TableCell>
                      )}
                      <TableCell sx={{ padding: '10px' }}>
                        {player?.score}
                      </TableCell>
                      <TableCell sx={{ padding: '10px' }}>
                        {gameCompleted ? (
                          <CheckCircle sx={{ color: 'green' }} />
                        ) : (
                          <HourglassEmpty sx={{ color: 'orange' }} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6" align="center">
            Chargement des données du jeu...
          </Typography>
        )}
      </Container>
    </PublicLayout>
  );
};

export default GamePlay;
