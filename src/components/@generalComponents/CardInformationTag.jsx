// Libraries
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment';

// Components
import Chip from '../../stories/general-components/Chip';
import GeneralText from '../../stories/general-components/GeneralText';
const CardInformationTag = ({ card, isBooking, langCode }) => {
  const { t } = useTranslation();

  const businessPreference = useSelector((state) => state.core.businessData);

  return (
    <React.Fragment>
      <div className="align-left">
        <div className="mb-3">
          {card?.isInvoiced && !card?.isProject && (
            <Chip
              label={
                parseInt(card?.finances?.balance / 10000) <= 0
                  ? t('paid')
                  : t('unPaid')
              }
              status={parseInt(card?.finances?.balance / 10000) <= 0 ? 97 : 98}
              size="small"
            />
          )}
        </div>

        <div className="d-flex">
          <GeneralText
            size="bold"
            primary={false}
            color={'black'}
            fontSize="13px"
            text={card?.businessData?.['structurename_' + langCode]}
          />
          <GeneralText
            size="bold"
            color={'black'}
            primary={false}
            fontSize="12px"
            classNameComponent="uppercase"
            text={'#' + card?.id?.split(businessPreference?.id)[0]}
          />
        </div>
        <div className="d-flex mb-2">
          <GeneralText
            size="medium"
            primary={false}
            color={'black'}
            fontSize="11px"
            classNameComponent="uppercase"
            text={card?.name}
          />
        </div>
        <div className="d-flex">
          <GeneralText
            size="regular"
            primary={false}
            color={'black'}
            fontSize="11px"
            text={t('PO') + ': '}
          />
          <GeneralText
            size="regular"
            primary={false}
            color={'black'}
            fontSize="11px"
            classNameComponent="uppercase"
            text={
              card?.reference
                ? card?.reference + ' - ' + (card?.id?.slice(-6) ?? '')
                : card?.id?.slice(-6) ?? ''
            }
          />
        </div>

        <div className="mt-3">
          <GeneralText
            size="medium"
            color={'black'}
            primary={false}
            fontSize="10px"
            text={
              t('creationDate') +
              ': ' +
              moment
                .unix(card?.timeStamp?._seconds || card?.timeStamp?.seconds)
                .format('DD MMM YYYY')
            }
          />
        </div>
        {card?.dueDate && (
          <div>
            <GeneralText
              size="medium"
              color={'black'}
              primary={false}
              fontSize="10px"
              text={
                t('dueDate') +
                ': ' +
                moment
                  .unix(
                    card?.dueDate?._seconds ||
                      card?.dueDate?.seconds ||
                      card?.targetDate?._seconds ||
                      card?.targetDate?.seconds
                  )
                  .format('DD MMM YYYY')
              }
            />
          </div>
        )}
        <div>
          <GeneralText
            size="bold"
            primary={false}
            color={'black'}
            fontSize="10px"
            text={
              (card?.targetProfileDetails?.attribute1 || '') +
              ' ' +
              (card?.targetProfileDetails?.attribute2 || '') +
              ' ' +
              (card?.targetProfileDetails?.attribute3 || '') +
              ' ' +
              (card?.targetProfileDetails?.attribute4 || '')
            }
          />
          {card?.targetProfileDetails?.metric && (
            <GeneralText
              size="bold"
              color={'black'}
              primary={false}
              fontSize="10px"
              text={' -> ' + card?.targetProfileDetails?.metric}
            />
          )}
          {card?.targetProfileDetails?.name && (
            <GeneralText
              size="medium"
              primary={false}
              color={'black'}
              fontSize="10px"
              text={card?.targetProfileDetails?.name || ''}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default CardInformationTag;
