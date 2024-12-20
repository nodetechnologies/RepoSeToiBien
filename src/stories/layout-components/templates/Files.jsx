import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//utilities
import { useTranslation } from 'react-i18next';

//components
import IconUploader from '../../../components/@generalComponents/IconUploader';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';
import { setGeneralStatus } from '../../../redux/actions-v2/coreAction';

const Files = ({ _ }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const elementData = useSelector(
    (state) => state.element.singleElementDetails
  );
  const [files, setFiles] = React.useState([]);

  const handleUploadComplete = (files) => {
    // const fileUrls = files?.map((file) => file.fileUrl);
    // onChange(field.value, fileUrls);
  };

  const handleUploadBlur = async (filesData) => {
    const fileUrls = filesData?.map((file) => file.fileUrl);
    const newFiles = [...files, ...fileUrls];
    setFiles(newFiles);

    let formattedPath = '';
    const parts = elementData?.documentPath?.split('/');
    parts.pop();
    formattedPath = parts.join('/');

    try {
      dispatch(setGeneralStatus({ status: 'loading' }));
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: elementData?.id,
          elementPath: formattedPath,
          key: 'files',
          value: newFiles,
        },
      });
      dispatch(setGeneralStatus({ status: 'success' }));
    } catch (error) {
      console.error('Error fetching data');
    }
  };

  useEffect(() => {
    if (elementData?.files || elementData?.data?.files) {
      setFiles(elementData?.files || elementData?.data?.files);
    }
  }, [elementData?.id]);

  return (
    <div>
      <div>
        <IconUploader
          key={'media'}
          value={elementData?.files}
          fieldType={'media'}
          required={false}
          elementId={'files'}
          label={t('files')}
          elementType={t('files')}
          onComplete={handleUploadComplete}
          onBlur={handleUploadBlur}
        />
      </div>
    </div>
  );
};
export default Files;
