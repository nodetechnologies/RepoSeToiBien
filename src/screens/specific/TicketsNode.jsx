import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  ListItem,
  ListItemText,
  List,
  InputLabel,
  FormControl,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import {
  onSnapshot,
  query,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  updateDoc,
  addDoc,
} from '@firebase/firestore';
import { db } from '../../firebase';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const TicketsNode = () => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // State for tickets, form data, and selected ticket for discussion
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState('');
  const [isNew, setIsNew] = useState(false);

  const currentUser = useSelector((state) => state.core.user);
  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const activeUser = businessPreference?.employees?.find(
    (employee) => employee.id === currentUser?.uid
  );

  // Select a ticket for discussion
  const handleSelectTicket = (ticket) => {
    setIsNew(false);
    setSelectedTicket(ticket);
    setComments(''); // Reset comments
  };

  // Add comment to the selected ticket
  const handleAddComment = async () => {
    if (selectedTicket && comments) {
      const commentToAdd = {
        text: comments,
        date: new Date().toLocaleString(),
        by: currentUser?.uid,
        name: activeUser?.publicDisplay?.name || activeUser?.displayName,
        avatar: activeUser?.avatar,
      };

      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `getTickets`,
        body: {
          type: 'comment',
          data: commentToAdd,
          ticketId: selectedTicket?.id,
          targetBusiness: selectedTicket?.businessId,
        },
      });

      setComments('');
      setTimeout(() => {
        getData();
      }, 1200);

      toast.success(t('commentAdded'));
    } else {
      toast.error(t('Please select a ticket and write a comment'));
    }
  };

  // Update ticket status
  const handleStatusChange = (ticket, newStatus) => {
    setSelectedTicket({
      ...selectedTicket,
      status: newStatus,
    });

    const updatedTickets = tickets.map((t) =>
      t.id === ticket.id ? { ...t, status: newStatus } : t
    );

    setTickets(updatedTickets);

    handleSaveTicket('status', newStatus);
    toast.info(t(`Ticket status updated to ${newStatus}`));
  };

  const handleSaveTicket = async (field, value) => {
    if (selectedTicket) {
      try {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `getTickets`,
          body: {
            type: 'update',
            data: {
              [field]: value,
            },
            ticketId: selectedTicket?.id,
            targetBusiness: selectedTicket?.businessId,
          },
        });
        getData();
      } catch (error) {
        console.error(error);
      }

      setSelectedTicket(null);
      toast.success(t('Ticket saved'));
    }
  };

  const getData = async () => {
    try {
      const dataList = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `getTickets`,
        body: {
          type: 'get',
        },
      });

      setTickets(dataList?.dataToReturn);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, [businessPreference?.id]);

  return (
    <MainLayoutV2 pageTitle={t('tickets')}>
      <Block height={1} heightPercentage={97}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <List>
              {tickets?.length > 0 ? (
                tickets?.map((ticket) => (
                  <ListItem
                    onClick={() => handleSelectTicket(ticket)}
                    divider
                    button
                    key={ticket.id}
                  >
                    <ListItemAvatar
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        src={`https://storage.googleapis.com/node-business-logos/${ticket?.businessId}.png`}
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primaryTypographyProps={{ noWrap: true, fontWeight: 600 }}
                      primary={ticket?.title}
                      secondary={t(`Type: ${t(ticket.type)}`)}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>{t('noTickets')}</Typography>
              )}
            </List>
          </Grid>

          {/* Ticket details */}
          {selectedTicket && (
            <Grid item xs={12} md={8}>
              <Card elevation={0}>
                <CardContent>
                  <Typography variant="h6">{t('ticketDetails')}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>{t('title')}: </strong>
                        {selectedTicket.title}
                      </Typography>
                      <Typography variant="body1">
                        <strong>{t('type')}: </strong>
                        {t(selectedTicket.type)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>{t('priority')}: </strong>
                        {t(selectedTicket.priority)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>{t('createdAt')}: </strong>
                        {moment
                          .unix(
                            selectedTicket?.timeStamp?.seconds ||
                              selectedTicket?.timeStamp?._seconds
                          )
                          .format('DD MMM YYYY HH:mm')}
                      </Typography>
                      <Typography variant="body1">
                        <strong>{t('status')}: </strong>
                        <FormControl fullWidth>
                          <Select
                            id="status"
                            value={selectedTicket?.status}
                            onChange={(e) =>
                              handleStatusChange(selectedTicket, e.target.value)
                            }
                          >
                            <MenuItem id="open" value="open">
                              {t('Open')}
                            </MenuItem>
                            <MenuItem id="in_progress" value="in_progress">
                              {t('inProgress')}
                            </MenuItem>
                            <MenuItem id="on_hold" value="on_hold">
                              {t('onHold')}
                            </MenuItem>
                            <MenuItem id="closed" value="closed">
                              {t('closed')}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6">{t('messages')}</Typography>
                  {selectedTicket?.comments
                    ?.sort(
                      (a, b) =>
                        (a?.date?._seconds || a?.date?.seconds) -
                        (b?.date?._seconds || b?.date?.seconds)
                    )
                    ?.map((comment, index) => (
                      <Card
                        elevation={0}
                        key={index}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        <CardContent>
                          <div>
                            <Typography variant="body1">
                              {comment.text}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {moment
                                .unix(
                                  comment?.date?._seconds ||
                                    comment?.date?.seconds
                                )
                                .format('LLL')}
                            </Typography>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  <TextField
                    fullWidth
                    label={t('addMessage')}
                    multiline
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                  >
                    {t('addComment')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Block>
    </MainLayoutV2>
  );
};

export default TicketsNode;
