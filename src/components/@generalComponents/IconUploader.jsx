import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  IconButton,
  Modal,
  Box,
  Typography,
  CircularProgress,
  InputLabel,
  Tooltip,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import UploadIcon from '@mui/icons-material/Upload';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSearchParams } from 'react-router-dom';
import Avatar from '../../stories/general-components/Avatar';

// Function to encode metadata
function createUploadMetadata(metadata) {
  return Object.entries(metadata)
    .map(([key, value]) => {
      const base64Value = btoa(unescape(encodeURIComponent(String(value))));
      return `${key} ${base64Value}`;
    })
    .join(',');
}

// formDataUpload Function
async function formDataUpload(params) {
  const baseUrl = 'https://api.bytescale.com';
  const path = `/v2/accounts/${params.accountId}/uploads/form_data`;
  const entries = (obj) =>
    Object.entries(obj).filter(([, val]) => (val ?? null) !== null);
  const query = entries(params.querystring ?? {})
    .flatMap(([k, v]) => (Array.isArray(v) ? v.map((v2) => [k, v2]) : [[k, v]]))
    .map((kv) => kv.join('='))
    .join('&');
  const formData = new FormData();
  formData.append('file', params.requestBody, params.originalFileName);

  // Encode metadata
  const uploadMetadata = createUploadMetadata(params.metadata);

  const response = await fetch(
    `${baseUrl}${path}${query.length > 0 ? '?' : ''}${query}`,
    {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        'Upload-Metadata': uploadMetadata,
      },
    }
  );
  const result = await response.json();
  if (Math.floor(response.status / 100) !== 2) {
    console.error(`Bytescale API Error: ${JSON.stringify(result)}`);
    throw new Error(`Bytescale API Error: ${JSON.stringify(result)}`);
  }
  return result;
}

// Function to get the appropriate icon based on MIME type
function getFileIcon(mimeType) {
  if (mimeType?.startsWith('image/')) {
    return null; // We will display the image
  } else if (mimeType === 'application/pdf') {
    return <PictureAsPdfIcon sx={{ fontSize: 40, color: '#999999' }} />;
  } else if (
    mimeType === 'application/msword' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return <DescriptionIcon sx={{ fontSize: 40, color: '#999999' }} />;
  } else if (
    mimeType === 'application/vnd.ms-excel' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return <InsertDriveFileIcon sx={{ fontSize: 40, color: '#999999' }} />;
  } else if (mimeType === 'text/plain') {
    return <DescriptionIcon sx={{ fontSize: 40, color: '#999999' }} />;
  } else {
    return <InsertDriveFileIcon sx={{ fontSize: 40, color: '#999999' }} />;
  }
}

// Custom Uploader Component
const IconUploader = ({
  onComplete,
  elementType,
  fieldType,
  label,
  value,
  size,
  required,
  fieldKey,
  folderPath,
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const businessId = searchParams.get('businessId') || '';
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';

  const businessPreference = useSelector((state) => state.core.businessData);

  const handleUpload = useCallback(
    async (acceptedFiles) => {
      if (!businessPreference?.id && !businessId) {
        console.error('Business ID is undefined.');
        return;
      }
      setUploading(true);

      let uploadedFilesData = [];

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        try {
          const result = await formDataUpload({
            accountId: 'kW15buA',
            apiKey: 'public_kW15buA4B6U6YzcBgoEsrFxYm4BE',
            requestBody: file,
            originalFileName: file.name,
            folderPathVariablesEnabled: true,
            metadata: {
              elementType: String(elementType),
              fieldType: String(fieldType),
              fieldKey: String(fieldKey),
              ownerId: String(businessPreference?.id || businessId),
            },
            querystring: {
              folderPath: folderPath
                ? folderPath
                : fieldType === 'media-single-private'
                ? '/private/' + (businessPreference?.id || businessId)
                : '/public/' + (businessPreference?.id || businessId),
            },
          });

          // Assuming result.fileUrl contains the uploaded file URL
          const fileUrl =
            result.fileUrl ||
            (result.files && result.files[0] && result.files[0].fileUrl);

          if (!fileUrl) {
            console.error('Cannot find fileUrl in result:', result);
            continue;
          }

          uploadedFilesData.push({
            fileUrl,
            mimeType: file.type,
            name: file.name,
          });

          // For 'media-single', we only need one file
          if (
            fieldType === 'media-single' ||
            fieldType === 'media-single-private'
          ) {
            break; // Stop after one file
          }
        } catch (error) {
          console.error(error);
        }
      }

      // If 'media-single', keep only the last uploaded file
      if (
        fieldType === 'media-single' ||
        fieldType === 'media-single-private'
      ) {
        setUploadedFiles(uploadedFilesData.slice(-1));
      } else {
        setUploadedFiles([...uploadedFiles, ...uploadedFilesData]);
      }

      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(
          fieldType === 'media-single' || fieldType === 'media-single-private'
            ? uploadedFilesData[0]
            : [...uploadedFiles, ...uploadedFilesData]
        );
      }

      setUploading(false);
      setOpenModal(false);
    },
    [
      businessPreference?.id || businessId,
      elementType,
      fieldKey,
      fieldType,
      onComplete,
      uploadedFiles,
    ]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      handleUpload(acceptedFiles);
    },
    [handleUpload]
  );

  function findMime(imagePathUrl) {
    if (!imagePathUrl) {
      return 'image/png';
    }

    if (imagePathUrl.endsWith('.pdf')) {
      return 'application/pdf';
    }

    if (imagePathUrl.endsWith('.txt')) {
      return 'text/plain';
    }

    if (imagePathUrl.endsWith('.doc')) {
      return 'application/msword';
    }

    if (imagePathUrl.endsWith('png')) {
      return 'image/png';
    }

    if (imagePathUrl.endsWith('jpg')) {
      return 'image/jpeg';
    }

    if (imagePathUrl.endsWith('jpeg')) {
      return 'image/jpeg';
    }

    if (imagePathUrl.endsWith('gif')) {
      return 'image/gif';
    }

    if (imagePathUrl.endsWith('bmp')) {
      return 'image/bmp';
    }

    if (imagePathUrl.endsWith('tiff')) {
      return 'image/tiff';
    }

    if (imagePathUrl.endsWith('svg')) {
      return 'image/svg+xml';
    }

    if (imagePathUrl.endsWith('webp')) {
      return 'image/webp';
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple:
      fieldType !== ('media-single' || fieldType === 'media-single-private'),
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      'application/vnd.ms-powerpoint': [],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        [],
      'text/plain': [],

      'application/vnd.google-apps.document': [],
      'application/vnd.google-apps.spreadsheet': [],
      'application/vnd.google-apps.presentation': [],
    },
  });

  useEffect(() => {
    if (value) {
      const filesToMap = Array.isArray(value) ? value : [value];
      const transformedValue = filesToMap?.map((file) => {
        if (file?.fileUrl) {
          return {
            fileUrl: file?.fileUrl,
            mimeType: file?.mimeType,
            name: file?.name,
          };
        } else {
          return {
            fileUrl: file,
            mimeType: findMime(file),
            name: 'File',
          };
        }
      });

      setUploadedFiles(transformedValue);
      setIsLoaded(true);
    }
  }, [fieldKey, fieldType]);

  // Function to handle file removal
  const handleRemoveFile = (index) => {
    const newUploadedFiles = [...uploadedFiles];
    newUploadedFiles.splice(index, 1);
    setUploadedFiles(newUploadedFiles);

    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete(newUploadedFiles);
    }
  };

  return (
    <div>
      {size === 'small' ? (
        <>
          <IconButton onClick={() => setOpenModal(true)} color="primary">
            {uploadedFiles?.length > 0 ? (
              uploadedFiles[0]?.mimeType?.startsWith('image/') ? (
                <img
                  src={uploadedFiles[0].fileUrl}
                  width={18}
                  height={18}
                  alt="img"
                />
              ) : (
                getFileIcon(uploadedFiles[0]?.mimeType)
              )
            ) : (
              <AddPhotoAlternateIcon />
            )}
          </IconButton>
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="icon-uploader-modal"
            aria-describedby="icon-uploader-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                bgcolor: 'background.paper',
                borderRadius: '10px',
                boxShadow: 24,
                p: 4,
              }}
            >
              <FormControl
                fullWidth
                required={required}
                margin="normal"
                sx={{
                  borderRadius: '10px',
                }}
              >
                <InputLabel
                  shrink={true}
                  required={required}
                  sx={{
                    backgroundColor: isDarkmode
                      ? 'rgb(51,51,51)'
                      : '#FFFFFF !important',
                    padding: '2px 10px 2px 10px',
                    borderRadius: '10px',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDarkmode
                        ? 'rgb(51,51,51)'
                        : '#FFFFFF !important',
                    },
                  }}
                >
                  {label}
                </InputLabel>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed #cccccc',
                    borderRadius: '10px',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: isDragActive
                      ? '#f0f0f0'
                      : 'background.paper',
                    cursor: 'pointer',
                  }}
                >
                  <input {...getInputProps()} />
                  {uploading ? (
                    <CircularProgress />
                  ) : (
                    <>
                      {!uploadedFiles?.length > 0 && (
                        <>
                          <UploadIcon sx={{ fontSize: 25, color: '#999999' }} />
                          <Typography variant="body1" color="textSecondary">
                            {t('dragFropOrClick')}
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                </Box>
              </FormControl>
            </Box>
          </Modal>
        </>
      ) : (
        <FormControl
          fullWidth
          required={required}
          margin="normal"
          sx={{
            borderRadius: '10px',
          }}
        >
          <InputLabel
            shrink={true}
            required={required}
            sx={{
              backgroundColor: isDarkmode
                ? 'rgb(51,51,51)'
                : '#FFFFFF !important',
              padding: '2px 10px 2px 10px',
              borderRadius: '10px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkmode
                  ? 'rgb(51,51,51)'
                  : '#FFFFFF !important',
              },
            }}
          >
            {label}
          </InputLabel>
          <Box
            sx={{
              border: '2px dashed #cccccc',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: isDragActive ? '#f0f0f0' : 'background.paper',
              cursor: 'pointer',
            }}
          >
            {uploadedFiles?.length > 0 && (
              <Avatar
                img={uploadedFiles}
                size="large"
                type={fieldType}
                handleRemoveFile={handleRemoveFile}
              />
            )}
            <Box {...getRootProps()}>
              <input {...getInputProps()} />
              {uploading ? (
                <CircularProgress />
              ) : (
                <>
                  {!uploadedFiles?.length > 0 ? (
                    <>
                      <UploadIcon sx={{ fontSize: 25, color: '#999999' }} />
                      <Typography variant="body1" color="textSecondary">
                        {t('dragFropOrClick')}
                      </Typography>
                    </>
                  ) : (
                    <div className="d-flex middle-content mt-3 align-right">
                      <UploadIcon
                        sx={{
                          fontSize: 25,
                          color: '#999999',
                          marginRight: '10px',
                        }}
                      />
                      <Typography variant="body1" color="textSecondary">
                        {t('add') + ' ' + t('new')}
                      </Typography>
                    </div>
                  )}
                </>
              )}
            </Box>
          </Box>
        </FormControl>
      )}
    </div>
  );
};

export default IconUploader;
