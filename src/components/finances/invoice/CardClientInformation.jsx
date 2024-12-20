import GeneralText from '../../../stories/general-components/GeneralText';
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CardClientInformation = ({ cardData }) => {
  const { t } = useTranslation();
  return (
    <div>
      <Divider component="div" />
      <div className="row mt-3 mb-4">
        <div className="col-6">
          <div>
            <GeneralText
              size="bold"
              primary={false}
              color={'black'}
              fontSize="12px"
              text={cardData?.targetDetails?.name}
            />
            {cardData?.targetDetails?.address && (
              <div className="mb-2">
                <GeneralText
                  size="regular"
                  color={'black'}
                  primary={false}
                  fontSize="11px"
                  text={cardData?.targetDetails?.address}
                />
              </div>
            )}
            <GeneralText
              size="regular"
              primary={false}
              color={'black'}
              fontSize="11px"
              text={cardData?.targetDetails?.email || ''}
            />
            <GeneralText
              size="regular"
              primary={false}
              color={'black'}
              fontSize="11px"
              text={cardData?.targetDetails?.phone || ''}
            />
          </div>
        </div>
        <div className="col-6">
          {cardData?.billingDetails && (
            <div>
              <GeneralText
                size="bold"
                primary={false}
                color={'black'}
                fontSize="11px"
                text={t('billTo')}
              />
              <GeneralText
                size="regular"
                primary={false}
                color={'black'}
                fontSize="11px"
                text={cardData?.billingDetails || ''}
              />
            </div>
          )}
          {cardData?.shippingDetails && (
            <div>
              <GeneralText
                size="bold"
                primary={false}
                fontSize="11px"
                color={'black'}
                text={t('shipTo')}
              />
              <GeneralText
                size="regular"
                color={'black'}
                primary={false}
                fontSize="11px"
                text={cardData?.shippingDetails || ''}
              />
            </div>
          )}
        </div>
      </div>
      <Divider component="div" />
    </div>
  );
};

export default CardClientInformation;
