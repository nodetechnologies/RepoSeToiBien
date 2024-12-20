// Libraries
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import Button from '../../stories/general-components/Button';
import GeneralText from '../../stories/general-components/GeneralText';

const ConfirmAction = ({
  children,
  condition,
  title,
  subtitle,
  onYes,
  onNo,
}) => {
  const { t } = useTranslation();

  const [actionAllowed, setActionAllowed] = useState(false);

  useEffect(() => {
    setActionAllowed(condition);
  }, [condition]);

  const onYesClick = () => {
    setActionAllowed(true);
    if (onYes) onYes();
  };

  const onNoClick = () => {
    setActionAllowed(false);
    if (onNo) onNo();
  };

  if (actionAllowed) return children;
  else
    return (
      <div className="mt-4">
        <GeneralText text={title} fontSize="12px" size="bold" primary={true} />
        <div>
          <GeneralText
            text={subtitle}
            fontSize="10px"
            size="regular"
            primary={true}
          />
        </div>
        <div className="d-flex mt-3">
          <Button label={t('yes')} primary={true} onClick={onYesClick} />
          <Button label={t('no')} primary={true} onClick={onNoClick} />
        </div>
      </div>
    );
};

export default ConfirmAction;
