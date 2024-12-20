import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import chroma from 'chroma-js';
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Blocks from '../../stories/layout-components/Block';
import { ListItem, ListItemText } from '@mui/material';
import moment from 'moment';

const UsageBilling = ({ structureId }) => {
  const { t } = useTranslation();
  const [totals, setTotals] = useState({});
  const [usageData, setUsageData] = useState({});

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const structures = businessStructure?.structures || [];
  const formatListIds = structures?.map((item) => item?.id);

  const allCategories = formatListIds;

  useEffect(() => {
    const currentMonth = moment().format('YYYY-MM');
    if (businessPreference?.id) {
      const usageCollectionRef = collection(
        db,
        'businessesOnNode',
        businessPreference?.id,
        'usage'
      );
      const q = query(
        usageCollectionRef,
        where('name', '>=', `${currentMonth}-CR`),
        where('name', '<=', `${currentMonth}-WR`)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const dataByType = { CR: [], DE: [], GE: [], SR: [], WR: [] };
        const totalsByType = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const type = doc.id.split('-').pop();
          let total = 0; // Initialize total for each type

          // Initialize or ensure all categories are present with default value 0
          const typeData = allCategories?.reduce((acc, category) => {
            acc[category] = {
              category: structures?.find(
                (structure) => structure?.id === category
              )?.name,
              value: 0,
            }; // Translate category name
            return acc;
          }, {});

          // Populate with actual values from the document
          Object.keys(data).forEach((key) => {
            if (key !== 'name' && typeData[key]) {
              typeData[key].value = data[key];
            }
          });

          // Convert object to array and sort by category order defined in allCategories
          Object.values(typeData).forEach(({ value }) => (total += value));
          totalsByType[type] = total;

          // Convert object to array and sort...
          dataByType[type] = allCategories
            .map((category) => typeData[category])
            .sort(
              (a, b) =>
                allCategories.indexOf(a.category) -
                allCategories.indexOf(b.category)
            );
        });

        setUsageData(dataByType);
        setTotals(totalsByType);
      });

      return () => unsubscribe();
    }
  }, [businessPreference?.id, t]);

  const mainColor = businessPreference?.mainColor || '#000000';
  const colorScale = chroma
    .scale([mainColor, chroma(mainColor).darken(3)])
    .colors(5);

  const renderBarChart = (data, color, title) => (
    <div key={title} style={{ marginBottom: '20px', maxWidth: 1200 }}>
      <h3>{t(title)}</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <MainLayoutV2 pageTitle={t('usage')}>
      <div className="mt-1 ">
        <Blocks height={1} heightPercentage={82}>
          <div className="d-flex p-4">
            <div style={{ paddingRight: '40px' }} className="col-9">
              {Object.entries(usageData)
                .filter(([type, data]) => type !== 'DE')
                .map(([type, data], index) =>
                  renderBarChart(data, colorScale[index], type)
                )}
            </div>
            <div className="col-3">
              {Object.entries(totals)
                .filter(([type, data]) => type !== 'DE')
                .map(([type, total]) => (
                  <div className="mt-3">
                    <ListItem>
                      <ListItemText primary={t(type)} secondary={total} />
                    </ListItem>
                  </div>
                ))}
            </div>
          </div>
        </Blocks>
      </div>
    </MainLayoutV2>
  );
};

export default UsageBilling;
