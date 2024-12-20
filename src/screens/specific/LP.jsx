import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import TextField from '../../stories/general-components/TextField';
import IconUploader from '../../components/@generalComponents/IconUploader';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { Divider } from '@mui/material';

const LP = () => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const { docId } = useParams();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    businessId: '',
    header: '',
    name: '',
    descSlide: '',
    description: '',
    feature1Slide: '',
    feature2Slide: '',
    feature3Slide: '',
    funcDesc1: '',
    funcDesc2: '',
    funcDesc3: '',
    funcDesc4: '',
    funcDescription: '',
    funcImg1: '',
    funcImg2: '',
    funcImg3: '',
    funcImg4: '',
    funcTitle: '',
    funcTitle1: '',
    funcTitle2: '',
    funcTitle3: '',
    funcTitle4: '',
    mainFeatureImg: '',
    mainFeatureTitle: '',
    mainFeatureSub: '',
    secSlideTitle: '',
    secSlideDescription: '',
    secSlideImg: '',
    subHeader: '',
    titleSlide: '',
    topBlock2: '',
    topBlock3: '',
    topBlock4: '',
    topBlock5: '',
    topBlock8: '',
    url: '',
    bottomBlock2: '',
    bottomBlock4: '',
    bottomBlock5: '',
    bottomBlock8: '',
    btnHeader: '',
    imgBlock1: '',
    imgBlock3: '',
    imgBlock6: '',
    imgBlock7: '',
    middleBlock2: '',
    middleBlock3: '',
    middleBlock5: '',
    middleBlock8: '',
  });

  const handleInputChange = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  useEffect(() => {
    const handleGet = async () => {
      try {
        const lpContent = await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `landPage`,
          noAuth: true,
          body: {
            docId: docId,
          },
        });
        setData(lpContent);
      } catch (error) {
        toast.error(t('error_getting'));
      }
    };

    handleGet();
  }, [docId]);

  const handleSubmit = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `landPage`,
        noAuth: true,
        body: {
          docId: docId,
          type: 'set',
          data: {
            ...data,
          },
        },
      });
      toast.success(t('saved_successfully'));
    } catch (error) {
      toast.error(t('error_saving'));
    }
  };

  const handleAddNew = () => {
    setData({
      header: '',
      descSlide: '',
      feature1Slide: '',
      feature2Slide: '',
      feature3Slide: '',
      funcDesc1: '',
      funcDesc2: '',
      funcDesc3: '',
      funcDesc4: '',
      funcTitle: '',
      funcTitle1: '',
      funcTitle2: '',
      funcTitle3: '',
      funcTitle4: '',
      mainFeatureTitle: '',
      mainFeatureSub: '',
      secSlideTitle: '',
      secSlideDescription: '',
      subHeader: '',
      titleSlide: '',
      url: '',
      bottomBlock2: '',
      bottomBlock4: '',
      bottomBlock5: '',
      bottomBlock8: '',
      btnHeader: '',
      imgBlock1: '',
      imgBlock3: '',
      imgBlock6: '',
      imgBlock7: '',
      middleBlock2: '',
      middleBlock3: '',
      middleBlock5: '',
      middleBlock8: '',
    });
  };

  return (
    <MainLayoutV2
      pageTitle={t('support')}
      actions={{
        save: handleSubmit,
        add: handleAddNew,
      }}
    >
      <Block height={1} heightPercentage={82}>
        <div className="row">
          <TextField
            label={t('businessId')}
            value={data?.businessId}
            fullWidth
            onChange={(e) => handleInputChange('businessId', e.target.value)}
          />
          <TextField
            label={t('name')}
            value={data?.name}
            fullWidth
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <TextField
            label={t('description')}
            value={data?.description}
            fullWidth
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
          <Divider component="div" sx={{ mt: 4, mb: 4 }} />
          <IconUploader
            label={t('imgBlock1')}
            fieldType="media-single"
            value={data?.imgBlock1}
            onComplete={(e) => handleInputChange('imgBlock1', e?.[0]?.fileUrl)}
          />
          <TextField
            label={t('topBlock2')}
            value={data?.topBlock2}
            fullWidth
            onChange={(e) => handleInputChange('topBlock2', e.target.value)}
          />
          <TextField
            label={t('middleBlock2')}
            value={data?.middleBlock2}
            fullWidth
            onChange={(e) => handleInputChange('middleBlock2', e.target.value)}
          />
          <TextField
            label={t('bottomBlock2')}
            value={data?.bottomBlock2}
            fullWidth
            onChange={(e) => handleInputChange('bottomBlock2', e.target.value)}
          />
          <IconUploader
            label={t('imgBlock3')}
            fieldType="media-single"
            value={data?.imgBlock3}
            onComplete={(e) => handleInputChange('imgBlock3', e?.[0]?.fileUrl)}
          />
          <TextField
            label={t('topBlock3')}
            value={data?.topBlock3}
            fullWidth
            onChange={(e) => handleInputChange('topBlock3', e.target.value)}
          />
          <TextField
            label={t('middleBlock3')}
            value={data?.middleBlock3}
            fullWidth
            onChange={(e) => handleInputChange('middleBlock3', e.target.value)}
          />
          <TextField
            label={t('topBlock4')}
            value={data?.topBlock4}
            fullWidth
            onChange={(e) => handleInputChange('topBlock4', e.target.value)}
          />
          <TextField
            label={t('bottomBlock4')}
            value={data?.bottomBlock4}
            fullWidth
            onChange={(e) => handleInputChange('bottomBlock4', e.target.value)}
          />
          <TextField
            label={t('topBlock5')}
            value={data?.topBlock5}
            fullWidth
            onChange={(e) => handleInputChange('topBlock5', e.target.value)}
          />
          <TextField
            label={t('middleBlock5')}
            value={data?.middleBlock5}
            fullWidth
            onChange={(e) => handleInputChange('middleBlock5', e.target.value)}
          />
          <TextField
            label={t('bottomBlock5')}
            value={data?.bottomBlock5}
            fullWidth
            onChange={(e) => handleInputChange('bottomBlock5', e.target.value)}
          />
          <IconUploader
            label={t('imgBlock6')}
            fieldType="media-single"
            value={data?.imgBlock6}
            onComplete={(e) => handleInputChange('imgBlock6', e?.[0]?.fileUrl)}
          />
          <IconUploader
            label={t('imgBlock7')}
            fieldType="media-single"
            value={data?.imgBlock7}
            onComplete={(e) => handleInputChange('imgBlock7', e?.[0]?.fileUrl)}
          />
          <TextField
            label={t('topBlock8')}
            value={data?.topBlock8}
            fullWidth
            onChange={(e) => handleInputChange('topBlock8', e.target.value)}
          />
          <TextField
            label={t('middleBlock8')}
            value={data?.middleBlock8}
            fullWidth
            onChange={(e) => handleInputChange('middleBlock8', e.target.value)}
          />
          <TextField
            label={t('bottomBlock8')}
            value={data?.bottomBlock8}
            fullWidth
            onChange={(e) => handleInputChange('bottomBlock8', e.target.value)}
          />
          <TextField
            label={t('url')}
            value={data?.url}
            fullWidth
            onChange={(e) => handleInputChange('url', e.target.value)}
          />
          <Divider component="div" sx={{ mt: 4, mb: 4 }} />
          <TextField
            label={t('header')}
            value={data?.header}
            fullWidth
            onChange={(e) => handleInputChange('header', e.target.value)}
          />
          <TextField
            label={t('subHeader')}
            value={data?.subHeader}
            fullWidth
            onChange={(e) => handleInputChange('subHeader', e.target.value)}
          />
          <TextField
            label={t('btnHeader')}
            value={data?.btnHeader}
            fullWidth
            onChange={(e) => handleInputChange('btnHeader', e.target.value)}
          />
          <Divider component="div" sx={{ mt: 4, mb: 4 }} />
          <TextField
            label={t('titleSlide')}
            value={data?.titleSlide}
            fullWidth
            onChange={(e) => handleInputChange('titleSlide', e.target.value)}
          />
          <TextField
            label={t('descSlide')}
            value={data?.descSlide}
            fullWidth
            onChange={(e) => handleInputChange('descSlide', e.target.value)}
          />
          <TextField
            label={t('feature1Slide')}
            value={data?.feature1Slide}
            fullWidth
            onChange={(e) => handleInputChange('feature1Slide', e.target.value)}
          />
          <TextField
            label={t('feature2Slide')}
            value={data?.feature2Slide}
            fullWidth
            onChange={(e) => handleInputChange('feature2Slide', e.target.value)}
          />
          <TextField
            label={t('feature3Slide')}
            value={data?.feature3Slide}
            fullWidth
            onChange={(e) => handleInputChange('feature3Slide', e.target.value)}
          />
          <Divider component="div" sx={{ mt: 4, mb: 4 }} />
          <TextField
            label={t('funcTitle')}
            value={data?.funcTitle}
            fullWidth
            onChange={(e) => handleInputChange('funcTitle', e.target.value)}
          />
          <TextField
            label={t('funcDescription')}
            value={data?.funcDescription}
            fullWidth
            onChange={(e) =>
              handleInputChange('funcDescription', e.target.value)
            }
          />
          <IconUploader
            label={t('funcImg1')}
            fieldType="media-single"
            value={data?.funcImg1}
            onComplete={(e) => handleInputChange('funcImg1', e?.[0]?.fileUrl)}
          />
          <TextField
            label={t('funcTitle1')}
            value={data?.funcTitle1}
            fullWidth
            onChange={(e) => handleInputChange('funcTitle1', e.target.value)}
          />
          <TextField
            label={t('funcDesc1')}
            value={data?.funcDesc1}
            fullWidth
            onChange={(e) => handleInputChange('funcDesc1', e.target.value)}
          />{' '}
          <IconUploader
            label={t('funcImg2')}
            fieldType="media-single"
            value={data?.funcImg2}
            onComplete={(e) => handleInputChange('funcImg2', e?.[0]?.fileUrl)}
          />
          <TextField
            label={t('funcTitle2')}
            value={data?.funcTitle2}
            fullWidth
            onChange={(e) => handleInputChange('funcTitle2', e.target.value)}
          />
          <TextField
            label={t('funcDesc2')}
            value={data?.funcDesc2}
            fullWidth
            onChange={(e) => handleInputChange('funcDesc2', e.target.value)}
          />
          <IconUploader
            label={t('funcImg3')}
            fieldType="media-single"
            value={data?.funcImg3}
            onComplete={(e) => handleInputChange('funcImg3', e?.[0]?.fileUrl)}
          />
          <TextField
            label={t('funcTitle3')}
            value={data?.funcTitle3}
            fullWidth
            onChange={(e) => handleInputChange('funcTitle3', e.target.value)}
          />
          <TextField
            label={t('funcDesc3')}
            value={data?.funcDesc3}
            fullWidth
            onChange={(e) => handleInputChange('funcDesc3', e.target.value)}
          />
          <IconUploader
            label={t('funcImg4')}
            fieldType="media-single"
            value={data?.funcImg4}
            onComplete={(e) => handleInputChange('funcImg4', e?.[0]?.fileUrl)}
          />
          <TextField
            label={t('funcTitle4')}
            value={data?.funcTitle4}
            fullWidth
            onChange={(e) => handleInputChange('funcTitle4', e.target.value)}
          />
          <TextField
            label={t('funcDesc4')}
            value={data?.funcDesc4}
            fullWidth
            onChange={(e) => handleInputChange('funcDesc4', e.target.value)}
          />
          <Divider component="div" sx={{ mt: 4, mb: 4 }} />
          <IconUploader
            label={t('secSlideImg')}
            fieldType="media-single"
            value={data?.secSlideImg}
            onComplete={(e) =>
              handleInputChange('secSlideImg', e?.[0]?.fileUrl)
            }
          />
          <TextField
            label={t('secSlideTitle')}
            value={data?.secSlideTitle}
            fullWidth
            onChange={(e) => handleInputChange('secSlideTitle', e.target.value)}
          />
          <TextField
            label={t('secSlideDescription')}
            value={data?.secSlideDescription}
            fullWidth
            onChange={(e) =>
              handleInputChange('secSlideDescription', e.target.value)
            }
          />
          <Divider component="div" sx={{ mt: 4, mb: 4 }} />
          <TextField
            label={t('mainFeatureTitle')}
            value={data?.mainFeatureTitle}
            fullWidth
            onChange={(e) =>
              handleInputChange('mainFeatureTitle', e.target.value)
            }
          />
          <TextField
            label={t('mainFeatureSub')}
            value={data?.mainFeatureSub}
            fullWidth
            onChange={(e) =>
              handleInputChange('mainFeatureSub', e.target.value)
            }
          />
          <IconUploader
            label={t('mainFeatureImg')}
            fieldType="media-single"
            value={data?.mainFeatureImg}
            onComplete={(e) =>
              handleInputChange('mainFeatureImg', e?.[0]?.fileUrl)
            }
          />
          <Divider component="div" sx={{ mt: 4, mb: 4 }} />
        </div>
      </Block>
    </MainLayoutV2>
  );
};

export default LP;
