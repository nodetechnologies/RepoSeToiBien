import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Icons from '@mui/icons-material';
import moment from 'moment';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
// utilities
import { useTranslation } from 'react-i18next';
import { db } from '../../../firebase.js';
import {
  query,
  updateDoc,
  Timestamp,
  addDoc,
  collection,
  limit,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';

// components
import { useTheme } from '@mui/material/styles';
import {
  Box,
  List,
  Checkbox,
  MenuItem,
  ListItem,
  ListItemText,
  Select,
} from '@mui/material';
import TextFieldMUI from '@mui/material/TextField';

const NodiesPoints = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { nodeId } = useParams();
  const [newTask, setNewTask] = useState('');

  const businessPreference = useSelector((state) => state.core.businessData);
  const currentStatus = useSelector((state) => state.core.status);
  const employees = businessPreference?.employees;
  const [tasks, setTasks] = useState([]);

  const currentUser = useSelector((state) => state.core.user);

  const businessDocId = businessPreference?.id;

  useEffect(() => {
    if (businessDocId && nodeId) {
      const pointsRef = collection(db, 'rooms', nodeId, 'points');
      try {
        const q = query(pointsRef, orderBy('order', 'desc'), limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newPoints = snapshot.docs.map((doc) => ({
            id: doc?.id,
            ...doc.data(),
          }));
          setTasks(newPoints);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error(error);
      }
    }
  }, [nodeId, businessDocId]);

  const addTask = async () => {
    if (newTask.trim() === '') return;
    const dropRef = collection(db, 'rooms', nodeId, 'points');
    const currentUserRef = doc(db, 'users', currentUser?.uid);
    const businessRef = doc(db, 'businessesOnNode', businessDocId);

    const orderOfLastTask =
      tasks.length > 0 ? tasks[tasks.length - 1].order : 0;

    const newMessageData = {
      name: newTask,
      timeStamp: Timestamp.fromDate(new Date()),
      completed: false,
      ownerId: businessRef,
      by: currentUserRef,
      assignedToId: currentUserRef,
      order: orderOfLastTask + 1,
      targetDate: Timestamp.fromDate(new Date()),
      isPinned: false,
    };
    await addDoc(dropRef, newMessageData);
    setNewTask('');
  };

  const updateTaskData = async (task, value, key) => {
    const taskRef = doc(db, 'rooms', nodeId, 'points', task?.id);
    let valueFinal = value;
    if (value === '') {
      await deleteDoc(taskRef);
    } else {
      if (key === 'targetDate') {
        const finalDate = new Date(value);
        valueFinal = Timestamp.fromDate(finalDate);
      }
      if (key === 'assignedToId') {
        valueFinal = doc(db, 'users', value);
      }
      await updateDoc(taskRef, {
        [key]: valueFinal,
      });
    }
  };

  return (
    <div className="row">
      <PerfectScrollbar>
        <List>
          {tasks
            ?.sort((a, b) => a.completed - b.completed)
            ?.map((task, index) => (
              <ListItem key={index}>
                <Box width="5%">
                  <Checkbox
                    edge="start"
                    onClick={() =>
                      updateTaskData(task, !task?.completed, 'completed')
                    }
                    checked={task?.completed}
                    icon={<Icons.CheckCircleOutline />}
                    checkedIcon={<Icons.CheckCircle />}
                    disableRipple
                    inputProps={{ 'aria-labelledby': task?.id }}
                  />
                </Box>
                <ListItemText>
                  <TextFieldMUI
                    value={task?.name}
                    fullWidth
                    onBlur={(e) => updateTaskData(task, e.target.value, 'name')}
                    variant="standard"
                    multiline
                    onChange={(e) => {
                      const newTasks = tasks.slice();
                      newTasks[index].name = e.target.value;
                      setTasks(newTasks);
                    }}
                  />
                </ListItemText>
                <Box width="14%" sx={{ marginTop: '1px' }}>
                  <TextFieldMUI
                    type="date"
                    fullWidth
                    value={
                      moment
                        .unix(
                          task?.targetDate?._seconds ||
                            task?.targetDate?.seconds
                        )
                        .format('YYYY-MM-DD') || ''
                    }
                    onChange={(e) =>
                      updateTaskData(task, e.target.value, 'targetDate')
                    }
                    sx={{ paddingRight: '15px' }}
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                  />
                </Box>
                <Box width="15%" sx={{ marginTop: '1px' }}>
                  <Select
                    fullWidth
                    value={task?.assignedToId?.id || ''}
                    onChange={(e) =>
                      updateTaskData(task, e.target.value, 'assignedToId')
                    }
                    displayEmpty
                    inputProps={{ 'aria-label': t('select') }}
                    variant="standard"
                  >
                    <MenuItem value="" disabled>
                      {t('assignedTo')}
                    </MenuItem>
                    {employees?.map((employee) => (
                      <MenuItem key={employee.id} value={employee?.id}>
                        {employee.publicDisplay?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </ListItem>
            ))}
          <ListItem>
            <Box width="5%">
              <Checkbox
                edge="start"
                checked={false}
                icon={<Icons.CheckCircleOutline />}
                checkedIcon={<Icons.CheckCircle />}
                disableRipple
                inputProps={{ 'aria-labelledby': 'new-task' }}
              />
            </Box>
            <ListItemText>
              <TextFieldMUI
                value={newTask}
                fullWidth
                multiline
                variant="standard"
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addTask(newTask);
                  }
                }}
              />
            </ListItemText>
          </ListItem>
        </List>
      </PerfectScrollbar>
    </div>
  );
};

export default NodiesPoints;
