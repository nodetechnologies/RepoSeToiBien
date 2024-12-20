import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';
import DynamicBlock from '../../components/DynamicBlock';

const BlocksLayout = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  return (
    <div className="block-separator">
      <div className="row align-c">
        <div className="col-md-7 col-12">
          <DynamicBlock
            variant="ultra-light"
            height="300px"
            img={'./assets/website/v2/workspaces_' + currentLangCode + '.png'}
            title={websiteData?.features?.block1 || t('block1')}
            insideText={
              websiteData?.features?.block1Inside || t('block1Inside')
            }
            insideText2={
              websiteData?.features?.block1Inside2 || t('block1Inside2')
            }
          />
        </div>
        <div className="col-md-5 col-12">
          {' '}
          <DynamicBlock
            variant="light"
            height="300px"
            text={websiteData?.features?.block2Text || t('block2')}
            title={websiteData?.features?.block2 || t('block2')}
            insideText={
              websiteData?.features?.block2Inside || t('block2Inside')
            }
            insideText2={
              websiteData?.features?.block2Inside2 || t('block2Inside2')
            }
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-3 col-12 align-c">
          <DynamicBlock
            variant="regular"
            height="300px"
            img={'./assets/website/img/sync.png'}
            title={websiteData?.features?.block3 || t('block3')}
            insideText={
              websiteData?.features?.block3Inside || t('block3Inside')
            }
            insideText2={
              websiteData?.features?.block3Inside2 || t('block3Inside2')
            }
          />
        </div>
        <div className="col-md-9 col-12">
          {' '}
          <DynamicBlock
            variant="ultra-light"
            height="300px"
            flex
            img={'./assets/website/v2/payment_' + currentLangCode + '.png'}
            insideText={
              websiteData?.features?.block4Inside || t('block4Inside')
            }
            title={websiteData?.features?.block4 || t('block4')}
            insideText2={
              websiteData?.features?.block4Inside2 || t('block4Inside2')
            }
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6 col-12">
          <div className="align-c">
            <DynamicBlock
              variant="ultra-light"
              height="340px"
              insideText={
                websiteData?.features?.block5Inside || t('block5Inside')
              }
              text={websiteData?.features?.block5Text || t('block5')}
              title={websiteData?.features?.block5 || t('block5')}
              insideText2={
                websiteData?.features?.block5Inside2 || t('block5Inside2')
              }
            />
          </div>
          <div className="align-c mt-4">
            <DynamicBlock
              height="550px"
              variant="light"
              insideText={
                websiteData?.features?.block6Inside || t('block6Inside')
              }
              img={
                './assets/website/v2/automatisation_' + currentLangCode + '.png'
              }
              title={websiteData?.features?.block6 || t('block6')}
              insideText2={
                websiteData?.features?.block6Inside2 || t('block6Inside2')
              }
            />
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="align-c">
            <DynamicBlock
              variant="regular"
              height="580px"
              insideText={
                websiteData?.features?.block7Inside || t('block7Inside')
              }
              img={'./assets/website/img/cards.png'}
              title={websiteData?.features?.block7 || t('block7')}
              insideText2={
                websiteData?.features?.block7Inside2 || t('block7Inside2')
              }
            />
          </div>
          <div className="align-c mt-4">
            <DynamicBlock
              variant="ultra-light"
              height="310px"
              insideText={
                websiteData?.features?.block8Inside || t('block8Inside')
              }
              img={'./assets/website/img/tiles.png'}
              title={websiteData?.features?.block8 || t('block8')}
              insideText2={
                websiteData?.features?.block8Inside2 || t('block8Inside2')
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlocksLayout;
