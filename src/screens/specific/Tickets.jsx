import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  ListItem,
  ListItemText,
  List,
  InputLabel,
  FormControl,
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
import Button from '../../stories/general-components/Button';
import TextField from '../../stories/general-components/TextField';
import Select from '../../stories/general-components/Select';

const Tickets = () => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // State for tickets, form data, and selected ticket for discussion
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    type: 'reportBug',
  });
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

  const businessStructures = businessStructure?.structures;

  // Handlers for creating tickets
  const handleCreateTicket = async () => {
    setSelectedTicket(null);
    setIsNew(true);

    if (newTicket.title && newTicket.description) {
      const ticketId =
        tickets.length + 1 + businessPreference.id + moment().unix();
      const ticket = {
        id: ticketId,
        title: newTicket.title,
        description: newTicket.description,
        type: newTicket.type,
        status: 'open',
        comments: [],
        url: newTicket.url,
        priority: newTicket.priority,
        timeStamp: serverTimestamp(),
        businessId: businessPreference?.id,
      };

      const ticketDocId = newTicket?.id || ticketId;
      const docRef = doc(
        db,
        'businessesOnNode',
        businessPreference.id,
        'tickets',
        ticketDocId
      );

      await setDoc(docRef, ticket, { merge: true });
      setTickets([...tickets, ticket]);
      setNewTicket({
        title: '',
        description: '',
        type: 'reportBug',
        url: '',
        priority: 'low',
      });
      toast.success(t('created'));
    } else {
      console.error('Please fill');
    }
  };

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
        date: serverTimestamp(),
        by: currentUser?.uid,
        name: activeUser?.publicDisplay?.name || activeUser?.displayName,
        avatar: activeUser?.avatar,
      };
      const commentId =
        selectedTicket?.comments?.length + 2 + '_' + selectedTicket?.id;

      const docCommentRef = doc(
        db,
        'businessesOnNode',
        businessPreference.id,
        'tickets',
        selectedTicket?.id,
        'comments',
        commentId
      );

      await setDoc(docCommentRef, commentToAdd, { merge: true });
      setComments('');
      toast.success(t('aadded'));
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
      t.id === selectedTicket.id ? { ...t, status: newStatus } : t
    );

    setTickets(updatedTickets);

    handleSaveTicket('status', newStatus);
    toast.info(t(`Ticket status updated to ${newStatus}`));
  };

  const handleSaveTicket = async (field, value) => {
    if (selectedTicket) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === selectedTicket.id ? selectedTicket : ticket
      );

      const docRef = doc(
        db,
        'businessesOnNode',
        businessPreference.id,
        'tickets',
        selectedTicket?.id
      );

      const selectedTicketTransit = {
        ...selectedTicket,
        [field]: value,
      };

      await updateDoc(docRef, selectedTicketTransit);
      setTickets(updatedTickets);
      setSelectedTicket(null);
      toast.success(t('saved'));
    }
  };

  useEffect(() => {
    if (!businessPreference?.id) return;
    const q = query(
      collection(db, 'businessesOnNode', businessPreference.id, 'tickets')
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTickets(list);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe();
  }, [tickets?.length, businessPreference?.id]);

  useEffect(() => {
    if (selectedTicket?.id) {
      const qComments = query(
        collection(
          db,
          'businessesOnNode',
          businessPreference.id,
          'tickets',
          selectedTicket?.id,
          'comments'
        )
      );
      const unsubscribe = onSnapshot(
        qComments,
        (querySnapshot) => {
          const comments = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSelectedTicket({ ...selectedTicket, comments });
        },
        (error) => {
          console.error(error);
        }
      );

      return () => unsubscribe();
    }
  }, [selectedTicket?.id]);

  return (
    <MainLayoutV2
      pageTitle={t('tickets')}
      actions={{ add: handleCreateTicket }}
    >
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
                    <ListItemText
                      primary={ticket?.title}
                      secondary={t(`Type: ${t(ticket?.type)}`)}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>{t('noTickets')}</Typography>
              )}
            </List>
          </Grid>
          {!selectedTicket && isNew && (
            <Grid item xs={12} md={8}>
              <Card elevation={0} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6">{t('createNewTicket')}</Typography>
                  <TextField
                    fullWidth
                    label={t('title')}
                    value={newTicket.title}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, title: e.target.value })
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label={t('description')}
                    multiline
                    helperText={t('descriptionHelp')}
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) =>
                      setNewTicket({
                        ...newTicket,
                        description: e.target.value,
                      })
                    }
                    margin="normal"
                  />
                  <Select
                    label={t('type')}
                    value={newTicket.type}
                    noEmpty
                    onChange={(e, value) =>
                      setNewTicket({ ...newTicket, type: value })
                    }
                    selections={[
                      {
                        id: 'reportBug',
                        value: 'reportBug',
                        label: t('reportBug'),
                      },
                      {
                        id: 'generalQuestion',
                        value: 'generalQuestion',
                        label: t('generalQuestion'),
                      },
                      {
                        id: 'newStructure',
                        value: 'newStructure',
                        label: t('newStructure'),
                      },
                      {
                        id: 'other',
                        value: 'other',
                        label: t('other'),
                      },
                    ]}
                  />

                  <Select
                    label={t('priority')}
                    value={newTicket.priority}
                    noEmpty
                    onChange={(e, value) =>
                      setNewTicket({ ...newTicket, priority: value })
                    }
                    selections={[
                      {
                        id: 'low',
                        value: 'low',
                        label: t('low'),
                      },
                      {
                        id: 'med',
                        value: 'med',
                        label: t('regular'),
                      },
                      {
                        id: 'high',
                        value: 'high',
                        label: t('highlyImportant'),
                      },
                      {
                        id: 'urgent',
                        value: 'urgent',
                        label: t('urgent'),
                      },
                    ]}
                  />

                  <TextField
                    fullWidth
                    helperText={t('urlElementHelp')}
                    label={t('urlElement')}
                    value={newTicket.url}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, url: e.target.value })
                    }
                    margin="normal"
                  />
                  <div className="mt-3">
                    <Button
                      variant="contained"
                      color="primary"
                      label={t('createTicket')}
                      elevation={0}
                      onClick={handleCreateTicket}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )}
          {/* Ticket details */}
          {selectedTicket && (
            <Grid item xs={12} md={8}>
              <Card elevation={0}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {t('ticketDetails')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>{t('title')}: </strong>
                        {selectedTicket?.title}
                      </Typography>
                      <Typography variant="body1">
                        <strong>{t('type')}: </strong>
                        {t(selectedTicket?.type)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>{t('priority')}: </strong>
                        {t(selectedTicket?.priority)}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 3 }}>
                        {t(selectedTicket?.description)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>{t('createdAt')}: </strong>
                        {moment(selectedTicket?.timeStamp?.toDate()).format(
                          'LLL'
                        )}
                      </Typography>

                      <Select
                        label={t('status')}
                        noEmpty
                        value={selectedTicket.status}
                        onChange={(e) =>
                          handleStatusChange(selectedTicket, e.target.value)
                        }
                        selections={[
                          {
                            id: 'open',
                            value: 'open',
                            label: t('openTciket'),
                          },
                          {
                            id: 'in_progress',
                            value: 'in_progress',
                            label: t('inProgress'),
                          },
                          {
                            id: 'on_hold',
                            value: 'on_hold',
                            label: t('onHold'),
                          },
                          {
                            id: 'closed',
                            value: 'closed',
                            label: t('closed'),
                          },
                        ]}
                      />
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
                      <Card elevation={0} key={index} sx={{ mt: 2 }}>
                        <CardContent
                          style={{
                            backgroundColor:
                              businessPreference?.mainColor + '07',
                            borderRadius: '10px 10px 0px 10px ',
                            margin: 0,
                            padding: 10,
                          }}
                        >
                          <div className="d-flex">
                            <Avatar
                              alt={comment?.name}
                              src={comment?.avatar}
                              sx={{ width: 30, height: 30 }}
                            />
                            <div className="mx-2">
                              <Typography
                                variant="body1"
                                fontWeight={600}
                                fontSize={11}
                              >
                                {comment?.name}
                              </Typography>
                              <Typography variant="body2">
                                {comment?.text}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {moment
                                  .unix(
                                    comment?.date?._seconds ||
                                      comment?.date?.seconds
                                  )
                                  .format('LLL')}
                              </Typography>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  <TextField
                    fullWidth
                    label={t('addMessage')}
                    multiline
                    type="comment"
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    margin="normal"
                  />
                  <div className="mt-2">
                    <Button
                      label={t('addComment')}
                      onClick={handleAddComment}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Block>
    </MainLayoutV2>
  );
};

export default Tickets;
