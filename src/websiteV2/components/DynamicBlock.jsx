import React, { useState, useEffect, useRef } from 'react';
import { Paper, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import colorGenerator from '../../utils/colorGenerator';
import Typo from './Typo';
import { Add } from '@mui/icons-material';
import Close from '@mui/icons-material/Close';
import { random } from 'chroma-js';
import { randInt } from 'three/src/math/MathUtils';

const DynamicBlock = ({
  variant,
  title,
  text,
  insideText,
  insideText2,
  img,
  flex,
  className,
  height,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [shaken, setShaken] = useState(false);
  const isDarkMode = theme.palette.mode === 'dark';
  const mainColor = theme.palette.primary.main || '#1604DD';

  const blockRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shaken) {
          setShaken(true);
          const shakeDuration = randInt(5000, 10000);
          setTimeout(() => setShaken(false), shakeDuration);
        }
      },
      { threshold: 0.5 }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => {
      if (blockRef.current) {
        observer.unobserve(blockRef.current);
      }
    };
  }, [shaken]);

  const variantResolver = (variant) => {
    const baseColor = open
      ? colorGenerator(mainColor, 0, 1, 0, false)
      : colorGenerator(mainColor, 0.2, 0.1, 1, false);

    switch (variant) {
      case 'ultra-light':
        return {
          backgroundColor: isDarkMode
            ? colorGenerator(mainColor, 0.2, 0.1, 1, false)
            : colorGenerator(mainColor, 0, 0.1, 1, false),
          width: '100%',
          height: height,
          padding: '30px',
          borderRadius: '10px',
        };
      case 'light':
        return {
          backgroundColor: isDarkMode
            ? colorGenerator(mainColor, 0.1, 0.3, 0.6, false)
            : colorGenerator(mainColor, 0.1, 0.3, 0.6, false),
          width: '100%',
          height: height,
          padding: '30px',
          borderRadius: '10px',
        };
      case 'regular':
        return {
          backgroundColor: colorGenerator(mainColor, 0, 1, 0, false),
          width: '100%',
          height: height,
          padding: '30px',
          borderRadius: '10px',
        };
      default:
        return {
          backgroundColor: baseColor,
          width: '100%',
          height: height,
          padding: '30px',
          borderRadius: '10px',
        };
    }
  };

  const getBackgroundColor = (isOpen) => {
    return isOpen
      ? colorGenerator(mainColor, 2, 1, 0, false)
      : colorGenerator(mainColor, 0.2, 0.1, 1, false);
  };

  const adjustedHeight = height?.split('px')[0] - 100 + 'px';

  return (
    <motion.div
      ref={blockRef}
      initial={false}
      animate={{
        backgroundColor: getBackgroundColor(open),
      }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      style={{ width: '100%', height: height, borderRadius: '10px' }}
    >
      <Paper
        elevation={0}
        className={className || ''}
        style={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          padding: '30px',
        }}
        sx={variantResolver(variant)}
      >
        <div>
          {open ? (
            <div className="align-left px-5">
              <Typo
                variant="h3-light"
                text={title}
                color={open ? '#FFFFFF' : '#000000'}
                className="px-3"
              />
              <Typo
                variant="p-light"
                color={open ? '#FFFFFF' : '#000000'}
                text={insideText || t('noData')}
                className="mt-3 px-3"
              />
              <Typo
                variant="p-light"
                color={open ? '#FFFFFF' : '#000000'}
                text={insideText2 || t('noData')}
                className="mt-3 px-3"
              />
            </div>
          ) : (
            <div className={flex ? 'd-flex middle-content' : ''}>
              <Typo
                variant="h3-light"
                text={title}
                className="mb-3"
                color={variant === 'regular' ? '#FFFFFF' : null}
              />
              {text && (
                <Typo
                  variant="p"
                  text={text}
                  color={variant === 'regular' ? '#FFFFFF' : null}
                  className="mt-3 px-5"
                />
              )}
              {img && (
                <img
                  src={img}
                  alt="img"
                  style={{
                    padding: '22px',
                    width: '85%',
                    height: 'auto',
                    maxHeight: adjustedHeight,
                  }}
                />
              )}
            </div>
          )}
        </div>
        <div
          style={{ position: 'absolute', margin: '10px', bottom: 0, right: 0 }}
        >
          <IconButton onClick={() => setOpen(!open)}>
            {open ? (
              <Close htmlColor={'#FFFFFF'} />
            ) : (
              <motion.div
                animate={
                  shaken
                    ? {
                        x: [0, -3, 3, -3, 3, 0],
                        transition: { duration: 0.8 },
                      }
                    : {}
                }
              >
                <Add
                  htmlColor={variant === 'regular' ? '#FFFFFF' : '#000000'}
                />
              </motion.div>
            )}
          </IconButton>
        </div>
      </Paper>
    </motion.div>
  );
};

export default DynamicBlock;
