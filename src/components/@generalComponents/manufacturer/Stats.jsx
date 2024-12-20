// Utilities
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

//components
import Block from '../../../stories/layout-components/Block';
import GeneralText from '../../../stories/general-components/GeneralText';
import { useParams } from 'react-router';

const Stats = ({
  updateValues,
  activeIndex,
  setUpdateValues,
  startDate,
  endDate,
  list,
}) => {
  // Initialize hooks and states
  const { t } = useTranslation();
  const [barChartData, setBarChartData] = useState([]);
  const [nodeCards, setNodeCards] = useState([]);
  const [prefixData, setPrefixData] = useState([]);
  const [avgViews, setAvgViews] = useState(0);
  const [avgTotal, setAvgTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [cardPerState, setCardPerState] = useState([]);
  const { structureId } = useParams();
  const [cardsPerStatus, setCardsPerStatus] = useState([]);
  const projects = list;
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const nameStatus0 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 0)?.label;

  const nameStatus1 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 1)?.label;

  const nameStatus2 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 2)?.label;

  const nameStatus3 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 3)?.label;

  const colorStatus0 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 0)?.color;

  const colorStatus1 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 1)?.color;

  const colorStatus2 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 2)?.color;

  const colorStatus3 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 3)?.color;

  const pieChartRef = useRef(null);
  const statusColors = [colorStatus0, colorStatus1, colorStatus2, colorStatus3];

  // State to store dimensions
  const [pieChartSize, setPieChartSize] = useState({ width: 0, height: 450 });

  // Update chart sizes on mount and window resize
  useEffect(() => {
    if (updateValues === true) {
      updateChartSizes();

      window.addEventListener('resize', updateChartSizes);
      if (activeIndex === 1) {
        setUpdateValues(false);
        return () => window.removeEventListener('resize', updateChartSizes);
      }
    }
  }, [updateValues]);

  const updateChartSizes = () => {
    if (pieChartRef.current) {
      setPieChartSize({
        width: pieChartRef.current.offsetWidth,
        height: 500,
      });
    }
  };

  useEffect(() => {
    setNodeCards(projects);
  }, [projects]);

  const processPrefixData = () => {
    const prefixCounts = {};
    let cardStatuses = {};
    let cardPerState = [];
    let avgViews = 0;
    let avgTotal = 0;
    let total = 0;
    let totalViews = 0;

    nodeCards?.forEach((card) => {
      const prefix = card?.targetPrefix;
      const status = `status${card?.status}`;

      if (!prefixCounts[prefix]) {
        prefixCounts[prefix] = {
          status0: 0,
          status1: 0,
          status2: 0,
          status3: 0,
        };
      }

      if (!cardStatuses[status]) {
        cardStatuses[status] = 0;
      }

      if (!cardPerState[card?.targetDetails?.state]) {
        cardPerState[card?.targetDetails?.state] = 0;
      }

      cardPerState[card?.targetDetails?.state]++;

      setCardPerState(cardPerState);

      cardStatuses[status]++;
      prefixCounts[prefix][status]++;
      total += card?.finances?.total / 10000;
      totalViews += card?.views;
    });

    avgViews = totalViews / nodeCards?.length;
    avgTotal = total / nodeCards?.length;

    setAvgViews(avgViews);
    setAvgTotal(avgTotal);
    setTotal(total);

    setPrefixData(
      Object.entries(prefixCounts).map(([prefix, counts]) => ({
        prefix,
        ...counts,
      }))
    );
  };

  const getNameStatus = (index) => {
    switch (index) {
      case 0:
        return nameStatus0;
      case 1:
        return nameStatus1;
      case 2:
        return nameStatus2;
      case 3:
        return nameStatus3;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (nodeCards?.length > 0) {
      const statusCounts = nodeCards?.reduce((acc, card) => {
        const statusKey = `status${card?.status}`;
        if (!acc[statusKey]) {
          acc[statusKey] = { name: statusKey, value: 1, status: card?.status };
        } else {
          acc[statusKey].value += 1;
        }
        return acc;
      }, {});

      //transform to name and value array
      const transformedValues = Object.values(statusCounts)?.map(
        (value, index) => {
          return {
            name: getNameStatus(value?.status),
            value: value?.value,
            status: value?.status,
            color: statusColors[value?.status % statusColors?.length],
          };
        }
      );

      setCardsPerStatus(Object?.values(transformedValues));
    }
  }, [nodeCards]);

  useEffect(() => {
    if (nodeCards?.length > 0) {
      setBarChartData(processNodeCardsForBarChart());
      processPrefixData();
    }
  }, [nodeCards]);

  const processNodeCardsForBarChart = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const endDateStamp = new Date(endDate * 1000);
    const startDateStamp = new Date(startDate * 1000);

    const differenceInDays = Math.round(
      (endDateStamp - startDateStamp) / oneDay
    );
    const barData = [];
    let cumulativeCounts = { status0: 0, status1: 0, status2: 0 };

    for (let i = 0; i <= differenceInDays; i++) {
      const currentDate = new Date(
        new Date(startDateStamp).getTime() + i * oneDay
      );
      const formattedDate = currentDate.toISOString().split('T')[0];

      const dayData = {
        name: formattedDate,
        status0: 0,
        status1: 0,
        status2: 0,
      };

      nodeCards?.forEach((card) => {
        const cardDate = new Date(
          (card?.timeStamp?.seconds ||
            card?.timeStamp?._seconds ||
            card?.timeStamp) * 1000
        );

        if (cardDate.toDateString() === currentDate.toDateString()) {
          dayData[`status${card?.status}`]++;
        }
      });

      // Update cumulativeCounts for each status and assign to dayData
      cumulativeCounts.status0 += dayData.status0;
      cumulativeCounts.status1 += dayData.status1;
      cumulativeCounts.status2 += dayData.status2;

      // Use the cumulative counts for the barData
      barData.push({
        name: formattedDate,
        status0: cumulativeCounts.status0,
        status1: cumulativeCounts.status1,
        status2: cumulativeCounts.status2,
      });
    }

    return barData;
  };

  const rows = Object.entries(cardPerState)?.map(([key, value]) => ({
    region: key || t('undefinedRegion'),
    number: value,
  }));

  const [highestValue, setHighestValueStatus] = useState('');
  const [lowestValue, setLowestValueStatus] = useState('');

  useEffect(() => {
    if (nodeCards?.length > 0) {
      setHighestValueStatus(
        Math.max(...nodeCards?.map((card) => card?.finances?.total / 10000))
      );
      setLowestValueStatus(
        Math.min(...nodeCards?.map((card) => card?.finances?.total / 10000))
      );
    }
  }, [nodeCards]);

  return (
    <div className="d-flex mt-4">
      <div style={{ paddingLeft: '10px' }} className="col-3 align-center">
        <Block noBorder noScroll noPadding height={5} heightPercentage={15}>
          <div
            className="middle-content"
            style={{
              padding: '25px',
            }}
          >
            <div>
              <GeneralText
                text={`-`}
                fontSize="24px"
                size="bold"
                primary={true}
              />
            </div>
            <div>
              <GeneralText
                text={t('changeSinceLastWeek')}
                fontSize="12px"
                size="medium"
                primary={true}
              />
            </div>
          </div>
        </Block>

        <div className="mt-3">
          <Block noBorder noScroll noPadding height={5} heightPercentage={15}>
            <div
              className="middle-content"
              style={{
                padding: '25px',
              }}
            >
              <div>
                <GeneralText
                  text={`${avgTotal?.toFixed(2)}$`}
                  fontSize="24px"
                  size="bold"
                  primary={true}
                />
              </div>
              <div>
                <GeneralText
                  text={t('avgTotal')}
                  fontSize="12px"
                  size="medium"
                  primary={true}
                />
              </div>
            </div>
          </Block>
        </div>
        <div className="mt-3">
          <Block noBorder noScroll noPadding height={5} heightPercentage={15}>
            <div
              className="middle-content"
              style={{
                padding: '25px',
              }}
            >
              <div>
                <GeneralText
                  text={`${lowestValue}$` + ` - ` + `${highestValue}$`}
                  fontSize="24px"
                  size="bold"
                  primary={true}
                />
              </div>
              <div>
                <GeneralText
                  text={t('minMaxTotal')}
                  fontSize="12px"
                  size="medium"
                  primary={true}
                />
              </div>
            </div>
          </Block>
        </div>
        <div className="mt-3">
          <Block noBorder noScroll noPadding height={5} heightPercentage={15}>
            <div
              className="middle-content"
              style={{
                padding: '25px',
              }}
            >
              <div>
                <GeneralText
                  text={`${avgViews?.toFixed(1)}`}
                  fontSize="24px"
                  size="bold"
                  primary={true}
                />
              </div>
              <div>
                <GeneralText
                  text={t('avgViews')}
                  fontSize="12px"
                  size="medium"
                  primary={true}
                />
              </div>
            </div>
          </Block>
        </div>
        <div className="mt-3">
          <Block noBorder noScroll noPadding height={5} heightPercentage={22}>
            <div
              className="middle-content"
              style={{
                padding: '25px',
              }}
            >
              <div>
                <GeneralText
                  text={`${total?.toFixed(2)}$`}
                  fontSize="24px"
                  size="bold"
                  primary={true}
                />
              </div>
              <div>
                <GeneralText
                  text={t('totalValue')}
                  fontSize="12px"
                  size="medium"
                  primary={true}
                />
              </div>
            </div>
          </Block>
        </div>
      </div>
      <div className="col-5 align-center">
        <div style={{ paddingLeft: '20px' }}>
          <Block
            title={t('quotesByWeek')}
            noPadding
            noBorder
            noScroll
            height={2}
            heightPercentage={38}
          >
            <div className="mt-4 py-1">
              <ResponsiveContainer width="90%" height={300}>
                <AreaChart
                  data={barChartData}
                  syncId="anyId"
                  margin={{
                    top: 0,
                    right: 0,
                    left: 35,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="status0" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={colorStatus0}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={colorStatus0}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="status1" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={colorStatus1}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={colorStatus1}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="status2" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={colorStatus2}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={colorStatus2}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis hide />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="status0"
                    stroke={colorStatus0}
                    name={getNameStatus(0)}
                    fill="url(#status0)"
                  />
                  <Area
                    type="monotone"
                    dataKey="status1"
                    stroke={colorStatus1}
                    name={getNameStatus(1)}
                    fill="url(#status1)"
                  />
                  <Area
                    type="monotone"
                    dataKey="status2"
                    stroke={colorStatus2}
                    name={getNameStatus(2)}
                    fill="url(#status2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Block>
        </div>
        <div className="mt-1">
          <Block noBorder noScroll height={2} heightPercentage={42}>
            <TableContainer sx={{ backgroundColor: 'transparent' }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">{t('region')}</TableCell>
                    <TableCell align="left">{t('number')}</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" align="left">
                        {row?.region}
                      </TableCell>
                      <TableCell align="left">{row?.number}</TableCell>

                      <TableCell align="right"></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Block>
        </div>
      </div>
      <div className="col-4 align-center">
        <div style={{ paddingLeft: '20px', paddingRight: '8px' }}>
          <Block
            title={t('quotesByStatus')}
            noPadding
            noBorder
            height={2}
            heightPercentage={50}
          >
            <ResponsiveContainer width="100%" height={pieChartSize.height}>
              <ResponsiveContainer width="100%" height={pieChartSize.height}>
                <PieChart>
                  <Pie
                    data={cardsPerStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="status"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {cardsPerStatus
                      ?.filter((entry, index) => entry?.status !== 3)
                      ?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry?.color} />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ResponsiveContainer>
          </Block>
        </div>
        <div
          style={{ paddingLeft: '20px', paddingRight: '8px' }}
          className="mt-3"
        >
          <Block
            title={t('totalsPerPrefix')}
            noPadding
            noBorder
            height={2}
            heightPercentage={31}
          >
            {' '}
            <Table
              size="small"
              aria-label="a dense table"
              sx={{ marginTop: '10px' }}
            >
              <TableBody>
                {prefixData
                  ?.filter((row) => row.prefix !== '')
                  ?.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row?.prefix}
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: colorStatus0,
                          color: '#fff',
                          fontWeight: '600',
                        }}
                        align="right"
                      >
                        {row?.status0}
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: colorStatus1,
                          color: '#fff',
                          fontWeight: '600',
                        }}
                        align="right"
                      >
                        {row?.status1}
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: colorStatus2,
                          color: '#fff',
                          fontWeight: '600',
                        }}
                        align="right"
                      >
                        {row?.status2}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor: '#f7f7f7',
                          fontWeight: '600',
                        }}
                      >
                        {row?.status2 + row?.status1 + row?.status0}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Block>
        </div>
      </div>
    </div>
  );
};
export default Stats;
