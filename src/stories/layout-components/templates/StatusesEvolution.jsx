import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import {
  CheckCircle,
  HourglassBottomOutlined,
  RadioButtonUnchecked,
} from '@mui/icons-material';

const StatusesEvolution = ({ elementDetails, componentData }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const dispatch = useDispatch();
  const { search } = useLocation();

  const [activeStep, setActiveStep] = useState(0);

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const businessStructures = businessStructure?.structures;
  const structure = businessStructures?.find(
    (s) => s.id === elementDetails?.elementData?.structureId
  );

  const statusField =
    componentData?.statuses ||
    structure?.fields?.find((field) => field?.value === 'status');

  const steps = statusField?.selections?.map(
    (status) => status?.['label_' + currentLanguage]
  );

  function colorResolver(status) {
    const matchedColor = statusField?.selections?.find(
      (selection) => selection?.value === status
    )?.color;
    return matchedColor;
  }

  // Custom Step Icon Component
  const StepIconComponent = (props) => {
    const { active, completed, className } = props;

    const color = colorResolver(props?.icon - 1);

    return completed ? (
      <CheckCircle
        style={{ color: color, width: '25px', height: '25px' }}
        className={className}
      />
    ) : active ? (
      <HourglassBottomOutlined
        style={{ color: color, width: '25px', height: '25px' }}
        className={className}
      />
    ) : (
      <RadioButtonUnchecked
        style={{ color: 'gray', width: '25px', height: '25px' }}
        className={className}
      />
    );
  };

  useEffect(() => {
    setActiveStep(elementDetails?.elementData?.status);
  }, [elementDetails?.elementData?.status]);

  return (
    <Box sx={{ width: '100%' }} id="statuses-box">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={StepIconComponent}>
              <div style={{ fontSize: '11px' }}>{label}</div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StatusesEvolution;
