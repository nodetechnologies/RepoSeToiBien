import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import chroma from 'chroma-js';

// utils
import { useTranslation } from 'react-i18next';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import moment from 'moment';
import Blocks from '../../stories/layout-components/Block';
import GeneralText from '../../stories/general-components/GeneralText';
import { Chip, List, ListItem, ListItemText, colors } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const DashboardFinances = ({ startDate, endDate }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [lists, setLists] = useState({
    categories: [],
  });

  const [categories, setCategories] = useState([]);

  const businessPreference = useSelector((state) => state.core.businessData);
  const mainColor =
    businessPreference?.mainColor && chroma.valid(businessPreference?.mainColor)
      ? businessPreference?.mainColor
      : '#000000';

  const handleFetchData = async () => {
    try {
      const listsData = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreMulti/board`,
        body: {
          startDate: moment.unix(startDate).toISOString(),
          endDate: moment.unix(endDate).toISOString(),
          type: 'finances',
        },
      });
      setLists(listsData);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (count) => {
    const intensity = count / lists?.total;
    return chroma.mix('grey', mainColor, intensity).hex();
  };

  useEffect(() => {
    handleFetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    const categoriesForm = Object.entries(lists?.categories || {}).map(
      ([key, value]) => ({
        name: key,
        value: Number(value?.toFixed(2)),
        color: getStatusColor(value),
      })
    );
    setCategories(categoriesForm);
  }, [lists]);

  return (
    <div className="d-flex mt-4">
      <div className="col-4 align-center">
        <Blocks noBorder noScroll heightPercentage={10} height={5}>
          <div
            className="middle-content"
            style={{
              padding: '25px',
            }}
          >
            <div>
              <GeneralText
                text={lists?.total?.toFixed(2) + ' $'}
                fontSize="24px"
                size="bold"
                primary={true}
              />
            </div>
            <div>
              <GeneralText
                text={t('total')}
                fontSize="12px"
                size="medium"
                primary={true}
              />
            </div>
          </div>
        </Blocks>

        <div className="d-flex" style={{ marginTop: '-18px' }}>
          <div className="col-6">
            <Blocks noBorder noScroll heightPercentage={15} height={5}>
              <div
                className="middle-content"
                style={{
                  padding: '25px',
                }}
              >
                <div className="mt-1">
                  <GeneralText
                    text={lists?.article?.toFixed(2) + ' $'}
                    fontSize="20px"
                    size="bold"
                    primary={true}
                  />
                </div>
                <div className="align-c d-flex middle-content ">
                  <GeneralText
                    text={
                      ((100 * lists?.article) / lists?.total || 0)?.toFixed(0) +
                      ' %'
                    }
                    fontSize="14px"
                    size="bold"
                    primary={true}
                    classNameComponent="greyText"
                  />

                  <Chip
                    label={
                      t('qty') + ' ' + (lists?.totalQtyArticle || 0)?.toFixed(1)
                    }
                    size="small"
                    style={{
                      backgroundColor: mainColor,
                      color: '#fff',
                      marginLeft: '5px',
                      height: '18px',
                      '& .MuiChipLabel': {
                        fontSize: '10px',
                      },
                    }}
                  ></Chip>
                </div>
                <div className="mt-2">
                  <GeneralText
                    text={t('totalArticles')}
                    fontSize="12px"
                    size="medium"
                    primary={true}
                  />
                </div>
              </div>
            </Blocks>
          </div>
          <div className="col-6">
            <Blocks noBorder noScroll heightPercentage={15} height={5}>
              <div
                className="middle-content"
                style={{
                  padding: '25px',
                }}
              >
                <div className="mt-1">
                  <GeneralText
                    text={lists?.service?.toFixed(2) + ' $'}
                    fontSize="20px"
                    size="bold"
                    primary={true}
                  />
                </div>
                <div className="align-c d-flex middle-content ">
                  <GeneralText
                    text={
                      ((100 * lists?.service) / lists?.total || 0)?.toFixed(0) +
                      ' %'
                    }
                    fontSize="14px"
                    size="bold"
                    primary={true}
                    classNameComponent="greyText"
                  />

                  <Chip
                    label={
                      (lists?.totalQtyService || 0)?.toFixed(1) +
                      ' ' +
                      t('unities')
                    }
                    size="small"
                    style={{
                      backgroundColor: mainColor,
                      color: '#fff',
                      marginLeft: '5px',
                      height: '18px',
                      '& .MuiChipLabel': {
                        fontSize: '10px',
                      },
                    }}
                  ></Chip>
                </div>
                <div className="mt-2">
                  <GeneralText
                    text={t('totalServices')}
                    fontSize="12px"
                    size="medium"
                    primary={true}
                  />
                </div>
              </div>
            </Blocks>
          </div>
        </div>
        <div style={{ marginTop: '-18px' }}>
          <Blocks
            title={t('categories')}
            noBorder
            noScroll
            empty={!categories?.length > 0}
            emptyType={'select'}
            heightPercentage={41}
            height={4}
          >
            <div>
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    nameKey="name"
                    // label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {categories?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || '#000'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Blocks>
        </div>
        <div style={{ marginTop: '-18px' }}>
          <Blocks noBorder noScroll heightPercentage={12} height={5}>
            <div
              className="middle-content"
              style={{
                padding: '25px',
              }}
            >
              <div>
                <GeneralText
                  text={(lists?.realHourValue || 0)?.toFixed(2) + ' $'}
                  fontSize="24px"
                  size="bold"
                  primary={true}
                />
              </div>
              <div>
                <GeneralText
                  text={t('realValueByHours')}
                  fontSize="12px"
                  size="medium"
                  primary={true}
                />
              </div>
            </div>
          </Blocks>
        </div>
      </div>
      <div className="col-4 align-center">
        <Blocks noBorder noScroll height={3} heightPercentage={12}>
          <div className="middle-content p-4">
            <div>
              <GeneralText
                text={(lists?.salesAvg || 0)?.toFixed(2) + ' $'}
                fontSize="24px"
                size="bold"
                primary={true}
              />
            </div>
            <div>
              <GeneralText
                text={t('salesAvg')}
                fontSize="12px"
                size="medium"
                primary={true}
              />
            </div>
          </div>
        </Blocks>
        <div style={{ marginTop: '-18px' }}>
          <Blocks noBorder noScroll height={3} heightPercentage={12}>
            <div className="middle-content p-4">
              <div>
                <GeneralText
                  text={(lists?.salesMed || '0') + ' $'}
                  fontSize="24px"
                  size="bold"
                  primary={true}
                />
              </div>
              <div>
                <GeneralText
                  text={t('salesMed')}
                  fontSize="12px"
                  size="medium"
                  primary={true}
                />
              </div>
            </div>
          </Blocks>
        </div>
        <div style={{ marginTop: '-18px' }}>
          <Blocks
            title={t('countByDay')}
            noBorder
            heightPercentage={20}
          ></Blocks>
        </div>
        <div style={{ marginTop: '-18px' }}>
          <Blocks title={t('topInvoices')} noBorder heightPercentage={30}>
            <List>
              {lists?.topFive?.map((item, index) => (
                <ListItem>
                  <ListItemText
                    primary={item?.targetName}
                    secondary={moment
                      .unix(
                        item?.invoiceDate?.seconds ||
                          item?.invoiceDate?._seconds
                      )
                      .format('DD MMM YYYY')}
                  ></ListItemText>
                  <ListItemText
                    primary={item?.finances?.subtotal?.toFixed(2) + ' $'}
                    secondary={'#' + item?.searchId || ''}
                  ></ListItemText>
                </ListItem>
              ))}
            </List>
          </Blocks>
        </div>
      </div>
      <div className="col-4">
        <Blocks
          title={t('topItems')}
          noBorder
          height={2}
          heightPercentage={85.5}
        >
          <div className="d-flex align-c mt-2"></div>
          <List>
            {lists?.unpaidCards?.map((card, index) => (
              <ListItem
                button
                divider
                onClick={() =>
                  navigate(
                    '/app/element/cardsinvoiced/' +
                      card?.structureDetails?.id +
                      '/' +
                      card?.id
                  )
                }
              >
                {' '}
                <ListItemText
                  sx={{ width: '50%' }}
                  primary={card?.name}
                  secondary={moment
                    .unix(
                      card?.invoiceDate?.seconds || card?.invoiceDate?._seconds
                    )
                    .format('DD MMM YYYY')}
                />{' '}
                <ListItemText
                  sx={{ width: '50%' }}
                  primary={card?.finances?.balance?.toFixed(2) + ' $'}
                  secondary={card?.targetDetails?.name}
                />
              </ListItem>
            ))}
          </List>
        </Blocks>
      </div>
    </div>
  );
};

export default DashboardFinances;
