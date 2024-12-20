import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Typo from '../../components/Typo';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import colorGenerator from '../../../utils/colorGenerator';

const MissionSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const mainColor = theme.palette.primary.main || '#1604DD';

  // Ensure these are valid color values
  const darkenOne = colorGenerator(mainColor, 0, 1, 0, false) || '#265bc2';
  const darkenListOne = colorGenerator(mainColor, 1, 1, 0, false) || '#003391';
  const websiteData = useSelector((state) => state.website.data);

  const [percent, setPercent] = useState(0);
  const [times, setTimes] = useState(0);
  const [tasks, setTasks] = useState(0);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      const percentTarget = websiteData?.home?.percentSec7 || 0;
      const timesTarget = websiteData?.home?.timesSec7 || 0;
      const tasksTarget = websiteData?.home?.tasksSec7 || 0;

      const incrementInterval = 20; // Speed of increment
      let percentInterval = setInterval(() => {
        setPercent((prev) => {
          if (prev >= percentTarget) {
            clearInterval(percentInterval);
            return percentTarget;
          }
          return prev + 1;
        });
      }, incrementInterval);

      let timesInterval = setInterval(() => {
        setTimes((prev) => {
          if (prev >= timesTarget) {
            clearInterval(timesInterval);
            return timesTarget;
          }
          return prev + 10;
        });
      }, 100);

      let tasksInterval = setInterval(() => {
        setTasks((prev) => {
          if (prev >= tasksTarget) {
            clearInterval(tasksInterval);
            return tasksTarget;
          }
          return prev + 10;
        });
      }, 10);

      return () => {
        clearInterval(percentInterval);
        clearInterval(timesInterval);
        clearInterval(tasksInterval);
      };
    }
  }, [inView, websiteData]);

  return (
    <div className="block-separator" ref={ref}>
      <div className="align-c mt-5">
        <Typo text={websiteData?.home?.titleSec7} variant="h3" />
        <div className="px-5">
          <Typo
            text={websiteData?.home?.subTextSec7}
            variant="p"
            className="mt-3 px-5"
          />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-4 col-12 align-c">
          <Typography
            component={motion.span}
            style={{
              backgroundImage: `linear-gradient(90deg, ${darkenOne}, ${darkenListOne})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: 70,
            }}
            variant="h4"
          >
            {percent.toFixed(0) + '%'}
          </Typography>
          <Typo
            className="mt-2 px-5"
            text={websiteData?.home?.percentTextSec7 || t('percentTextSec7')}
            variant="p"
          />
        </div>
        <div className="col-md-4 col-12 align-c">
          <Typography
            component={motion.span}
            style={{
              backgroundImage: `linear-gradient(90deg, ${darkenOne}, ${darkenListOne})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: 70,
            }}
            variant="h4"
          >
            {times.toFixed(0) + 'x'}
          </Typography>
          <Typo
            className="mt-2 px-5"
            text={websiteData?.home?.timesTextSec7 || t('timesTextSec7')}
            variant="p"
          />
        </div>
        <div className="col-md-4 col-12 align-c">
          <Typography
            component={motion.span}
            style={{
              backgroundImage: `linear-gradient(90deg, ${darkenOne}, ${darkenListOne})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: 70,
            }}
            variant="h4"
          >
            {tasks.toFixed(0)}
          </Typography>
          <Typo
            className="mt-2 px-5"
            text={websiteData?.home?.tasksTextSec7 || t('tasksTextSec7')}
            variant="p"
          />
        </div>
      </div>
    </div>
  );
};

export default MissionSection;
