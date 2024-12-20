// Libraries
import React from 'react';

// Components
import GeneralText from '../../stories/general-components/GeneralText';

const BusinessInformationTag = ({ businessData }) => {
  return (
    <div className="row align-left">
      <div>
        <img
          src={`https://storage.googleapis.com/node-business-logos/${
            businessData?.id || businessData?.entityId
          }.png`}
          height="50"
          width="50"
          alt="logo"
        />
      </div>
      <div className="mt-2 mx-2">
        <GeneralText
          size="bold"
          primary={false}
          color={'black'}
          fontSize="11px"
          text={businessData?.data?.publicName || businessData?.name}
        />
        <div>
          <GeneralText
            size="regular"
            primary={false}
            color={'black'}
            fontSize="9px"
            text={businessData?.data?.address || businessData?.address}
          />
        </div>
        {businessData?.phone && (
          <div style={{ marginTop: '-4px' }}>
            <GeneralText
              size="regular"
              primary={false}
              fontSize="9px"
              color={'black'}
              text={
                (businessData?.data?.phoneNumber || businessData?.phone) +
                ' - ' +
                (businessData?.data?.website || businessData?.website)
              }
            />
          </div>
        )}
        {businessData?.taxId && (
          <div style={{ marginTop: '2px' }}>
            <GeneralText
              size="regular"
              primary={false}
              color={'black'}
              fontSize="9px"
              text={
                businessData?.data?.taxId ||
                businessData?.taxId + ' ' + businessData?.taxIdSecond
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInformationTag;
