import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//utilities
import { useTranslation } from 'react-i18next';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';
import GeneralText from '../../general-components/GeneralText';

const Summary = ({}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const businessPreference = useSelector((state) => state.core.businessData);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '5px',
        padding: '4px',
      }}
    >
      <div className="d-flex">
        <div className="col-4 align-c">
          <GeneralText
            text={'0'}
            primary={false}
            size="bold"
            fontSize="30px"
            color={businessPreference?.mainColor}
          />
          <div>
            <GeneralText
              text={'Semaine'}
              primary={false}
              size="regular"
              fontSize="12px"
              color={businessPreference?.secColor}
            />
          </div>
        </div>
        <div className="col-4 align-c">
          <GeneralText
            text={'0'}
            primary={false}
            size="bold"
            fontSize="30px"
            color={businessPreference?.mainColor}
          />
          <div>
            <GeneralText
              text={'Mois'}
              primary={false}
              size="regular"
              fontSize="12px"
              color={businessPreference?.secColor}
            />
          </div>
        </div>
        <div className="col-4 align-c">
          <GeneralText
            text={'0'}
            primary={false}
            size="bold"
            fontSize="30px"
            color={businessPreference?.mainColor}
          />
          <div>
            <GeneralText
              text={'Année'}
              primary={false}
              size="regular"
              fontSize="12px"
              color={businessPreference?.secColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Summary;
