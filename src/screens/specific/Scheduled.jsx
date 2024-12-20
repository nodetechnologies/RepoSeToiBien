import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { List, ListItem, ListItemText } from '@mui/material';
import moment from 'moment';

const Scheduled = () => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const dataList = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/scheduled`,
        body: {},
      });

      const orderedList = dataList
        .sort((a, b) => {
          return (
            new Date(
              (b?.scheduledAt?._seconds || b?.scheduledAt?.seconds) * 1000
            ) -
            new Date(
              (a?.scheduledAt?._seconds || a?.scheduledAt?.seconds) * 1000
            )
          );
        })
        .map((item) => {
          return item;
        });
      setData(orderedList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <MainLayoutV2 pageTitle={t('scheduled')}>
      <Block height={1} heightPercentage={97}>
        <List>
          {data?.length > 0 &&
            data?.map((item, index) => {
              const pathTransformed = item?.elementId?._path?.segments?.map(
                (segment) => segment + '/'
              );
              const lastPart = pathTransformed?.pop();
              pathTransformed.push(lastPart);

              //extract element just before lastpart
              const elementBeforeLastPart =
                pathTransformed[pathTransformed.length - 2];
              return (
                <ListItem divider>
                  <ListItemText
                    sx={{ width: '30%' }}
                    primary={moment
                      .unix(
                        item?.scheduledAt?._seconds ||
                          item?.scheduledAt?.seconds
                      )
                      .format('DD/MM/YYYY HH:mm')}
                  />
                  <ListItemText sx={{ width: '30%' }} primary={t(item?.type)} />
                  <ListItemText
                    sx={{ width: '20%' }}
                    primary={t(elementBeforeLastPart?.split('/')[0])}
                  />
                  <ListItemText
                    sx={{ width: '20%' }}
                    primary={'# ' + lastPart?.split('/')[0]}
                  />
                </ListItem>
              );
            })}
        </List>
      </Block>
    </MainLayoutV2>
  );
};

export default Scheduled;
