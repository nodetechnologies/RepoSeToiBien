import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import chroma from 'chroma-js';
import AvatarMUI from '@mui/material/Avatar';
import {
  Badge,
  Box,
  Button,
  Dialog,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

const AvatarMUIWithMotion = motion(AvatarMUI);

const Avatar = ({
  size,
  img,
  prefix,
  name,
  userId,
  type,
  label,
  handleRemoveFile,
  blockWith,
}) => {
  const businessPreference = useSelector((state) => state.core.businessData);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [openedFile, setOpenedFile] = useState(null);

  const { t } = useTranslation();

  function stringToColor(name) {
    const mainColor = businessPreference?.mainColor || '#000'; // Default to '#000' if undefined
    const baseColor = chroma.valid(mainColor) ? mainColor : '#000';
    const colors = chroma.scale(['black', baseColor]).mode('lch').colors(19);

    let hash = 0;
    if (name) {
      // Check if name is not undefined
      for (let i = 0; i < name?.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
    }
    const index = Math.abs(hash) % colors?.length;
    return colors[index];
  }

  const handleOpen = (url, mimeType) => {
    setOpenedFile({ url, mimeType });
    setOpen(true);
  };

  const handleClose = () => {
    setOpenedFile(null);
    setOpen(false);
  };

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

    if (imagePathUrl.includes('docs.google.com/document')) {
      return 'application/vnd.google-apps.document';
    }

    if (imagePathUrl.includes('docs.google.com/spreadsheets')) {
      return 'application/vnd.google-apps.spreadsheet';
    }
  }

  function validateIfPrivate(imagePathUrl) {
    if (!imagePathUrl) {
      return false;
    }
    //check if valide url
    try {
      new URL(imagePathUrl);
    } catch (error) {
      return false;
    }

    const url = new URL(imagePathUrl);
    const pathname = url.pathname;
    const pathSegments = pathname.split('/');
    const indexOfPrivate = pathSegments.includes('private');

    if (indexOfPrivate) {
      return true;
    } else {
      return false;
    }
  }

  function cleanFileName(fileName) {
    let decoded = decodeURIComponent(fileName);
    decoded = decoded
      .replace(/â/g, '’')
      .replace(/â/g, 'a')
      .replace(/Ì/g, '́')
      .replace(//g, 'é')
      .replace(/%20/g, ' ');

    return decoded;
  }

  const getImgData = async (imagePath) => {
    try {
      const isPrivate = validateIfPrivate(imagePath);
      const fileName = imagePath?.split('/').pop();
      const transitName = fileName?.split('-')[1];
      const finalFileName = cleanFileName(transitName);
      if (isPrivate) {
        const imgData = await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `coreMulti/protected-file`,
          body: {
            filePath: imagePath,
          },
          options: {
            responseType: 'blob',
          },
        });
        const objectUrl = URL.createObjectURL(imgData);
        const mimeType = imgData.type;

        return {
          objectUrl,
          mimeType,
          isPrivate: true,
          fileName: finalFileName,
        };
      } else {
        const objectUrl = imagePath;
        const mimeType = findMime(imagePath);

        if (mimeType === 'application/vnd.google-apps.document') {
          return {
            objectUrl: imagePath,
            mimeType,
            isPrivate: false,
            fileName: finalFileName,
          };
        }

        if (mimeType === 'application/vnd.google-apps.spreadsheet') {
          return {
            objectUrl: imagePath,
            mimeType,
            isPrivate: false,
            fileName: finalFileName,
          };
        }
        return {
          objectUrl,
          mimeType,
          isPrivate: false,
          fileName: finalFileName,
        };
      }
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  };

  function stringAvatar(name) {
    if (!name) return {}; // Return an empty object if name is undefined
    const color = stringToColor(name);
    return {
      sx: {
        bgcolor: color,
        backgroundImage: `radial-gradient(circle, ${chroma(color).brighten(
          0.5
        )} 0%, ${color} 30%, ${chroma(color).darken(0.7)} 100%)`,
        maxWidth: `${size === 'xsm' ? '20px' : '30px !important'}`,
        maxHeight: `${size === 'xsm' ? '20px' : '30px !important'}`,
        fontSize: `${size === 'xsm' ? '0.6rem' : '0.8rem !important'}`,
        borderRadius: '50%',
      },
      children: `${name?.split(' ')?.[0]?.[0]}${name?.split(' ')?.[1]?.[0]}`,
    };
  }

  useEffect(() => {
    let isMounted = true;
    const fetchFiles = async () => {
      const fileArray = Array.isArray(img) ? img : [img];

      const fileDataArray = await Promise.all(
        fileArray.map(async (file) => {
          if (file) {
            return await getImgData(file?.fileUrl || file);
          }
        })
      );

      if (isMounted) {
        setFiles(fileDataArray.filter(Boolean));
      }
    };

    fetchFiles();

    return () => {
      isMounted = false;
      files.forEach((file) => {
        if (file?.objectUrl && file.objectUrl.startsWith('blob:')) {
          URL.revokeObjectURL(file.objectUrl);
        }
      });
    };
  }, [img, type]);

  const prefixColor = 'transparent';

  return (
    <>
      {open && openedFile && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <div className="align-c px-5 py-5">
            {openedFile?.mimeType &&
            openedFile.mimeType.startsWith('image/') ? (
              <img
                src={openedFile?.url}
                alt={name}
                style={{
                  width: 'auto',
                  height: '100%',
                  maxHeight: '70vh',
                  border: 'none',
                  borderRadius: '10px',
                }}
              />
            ) : openedFile.mimeType === 'application/pdf' ? (
              <div>
                <iframe
                  src={openedFile?.url}
                  title="PDF"
                  style={{
                    height: '70vh',
                    maxHeight: '70vh',
                    width: '100%',
                    border: 'none',
                    borderRadius: '10px',
                  }}
                />
              </div>
            ) : openedFile.mimeType &&
              openedFile.mimeType.startsWith('text/') ? (
              <div>
                <iframe
                  src={openedFile?.url}
                  title="Text"
                  style={{
                    height: '70vh',
                    maxHeight: '70vh',
                    width: '100%',
                    border: 'none',
                    borderRadius: '10px',
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = openedFile.url;
                    link.download = `file.${
                      openedFile.mimeType?.split('/')[1] || 'txt'
                    }`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  {t('download')}
                </Button>
              </div>
            ) : (
              <div>
                <Typography variant="body1">
                  File preview is not available.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = openedFile.url;
                    link.download = `file.${
                      openedFile.mimeType?.split('/')[1] || 'txt'
                    }`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  {t('download')}
                </Button>
              </div>
            )}
          </div>
        </Dialog>
      )}

      <div className="d-flex">
        {img === 103120 || img === '103120' || img === undefined ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <AvatarMUIWithMotion
              {...stringAvatar(name || 'N D')}
              whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, rotateZ: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </div>
        ) : (
          <div>
            <Tooltip title={name || ''}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  mt: 1,
                }}
              >
                {files?.length > 0 ? (
                  files?.map((file, index) => {
                    const { objectUrl, mimeType, fileName } = file;

                    // Determine the file type
                    const fileType = mimeType ? mimeType.split('/')[0] : null;
                    const fileExtension = mimeType
                      ? mimeType.split('/')[1]
                      : null;

                    const endFileType = mimeType
                      ? mimeType.split('/')[1]
                      : null;

                    let content;
                    if (fileType === 'image' || endFileType === 'image') {
                      content = (
                        <AvatarMUI
                          key={index}
                          onClick={() => handleOpen(objectUrl, mimeType)}
                          sx={{
                            bgcolor: `${prefixColor}20`,
                            borderRadius:
                              size === 'large' ? '10px !important' : '50%',
                            maxWidth: `${
                              size === 'xsm'
                                ? '20px'
                                : size === 'large'
                                ? '40px !important'
                                : '30px !important'
                            }`,
                            maxHeight: `${
                              size === 'xsm'
                                ? '20px'
                                : size === 'large'
                                ? '40px !important'
                                : '30px !important'
                            }`,
                          }}
                          src={
                            objectUrl || '/assets/v3/img/empty-state-light.png'
                          }
                          alt={name}
                        />
                      );
                    } else if (
                      fileExtension === 'pdf' ||
                      endFileType === 'pdf'
                    ) {
                      content = (
                        <AvatarMUI
                          key={index}
                          onClick={() => handleOpen(objectUrl, mimeType)}
                          sx={{
                            bgcolor: `${prefixColor}20`,
                            borderRadius:
                              size === 'large' ? '10px !important' : '50%',
                            maxWidth: `${
                              size === 'xsm'
                                ? '20px'
                                : size === 'large'
                                ? '40px !important'
                                : '30px !important'
                            }`,
                            maxHeight: `${
                              size === 'xsm'
                                ? '20px'
                                : size === 'large'
                                ? '40px !important'
                                : '30px !important'
                            }`,
                          }}
                          alt={name}
                        >
                          <PictureAsPdfIcon />
                        </AvatarMUI>
                      );
                    } else if (fileType === 'text' || endFileType === 'text') {
                      content = (
                        <AvatarMUI
                          key={index}
                          onClick={() => handleOpen(objectUrl, mimeType)}
                          sx={{
                            bgcolor: `${prefixColor}20`,
                            borderRadius:
                              size === 'large' ? '10px !important' : '50%',
                            maxWidth: `${
                              size === 'xsm'
                                ? '20px'
                                : size === 'large'
                                ? '40px !important'
                                : '30px !important'
                            }`,
                            maxHeight: `${
                              size === 'xsm'
                                ? '20px'
                                : size === 'large'
                                ? '40px !important'
                                : '30px !important'
                            }`,
                          }}
                        >
                          <DescriptionIcon />
                        </AvatarMUI>
                      );
                    } else {
                      content = (
                        <AvatarMUI
                          key={index}
                          onClick={() => handleOpen(objectUrl, mimeType)}
                          sx={{
                            bgcolor: `${prefixColor}20`,
                            borderRadius:
                              size === 'large' ? '10px !important' : '50%',
                            maxWidth: `${
                              size === 'xsm'
                                ? '20px'
                                : size === 'large'
                                ? '40px !important'
                                : '30px !important'
                            }`,
                            maxHeight: `${
                              size === 'xsm'
                                ? '20px'
                                : size === 'large'
                                ? '40px !important'
                                : '30px !important'
                            }`,
                          }}
                        >
                          <InsertDriveFileIcon />
                        </AvatarMUI>
                      );
                    }
                    return (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '40px',
                          marginRight: '10px',
                          maxWidth: blockWith ? blockWith : '100%',
                        }}
                      >
                        <div className="d-flex">
                          {content}
                          {label && (
                            <div
                              style={{
                                marginBottom: '2px',
                                marginLeft: '10px',
                                paddingTop: '5px',
                              }}
                            >
                              <Typography
                                fontSize="11px"
                                fontWeight={500}
                                color="#000000"
                                sx={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '100%',
                                }}
                              >
                                {fileName}
                              </Typography>
                              <Typography
                                fontSize="8.5px"
                                fontWeight={300}
                                color="#69696980"
                                variant="caption"
                                sx={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '100%',
                                }}
                              >
                                {label}
                              </Typography>
                            </div>
                          )}
                        </div>
                        {handleRemoveFile && (
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFile(index)}
                            sx={{
                              position: 'absolute',
                              top: -10,
                              right: -10,
                              backgroundColor: 'rgba(255,255,255,0.7)',
                              '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.9)',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    );
                  })
                ) : (
                  <AvatarMUI
                    sx={{
                      bgcolor: `${prefixColor}20`,
                      borderRadius:
                        size === 'large' ? '10px !important' : '50%',
                      maxWidth: `${
                        size === 'xsm'
                          ? '20px'
                          : size === 'large'
                          ? '50px !important'
                          : '30px !important'
                      }`,
                      maxHeight: `${
                        size === 'xsm'
                          ? '20px'
                          : size === 'large'
                          ? '50px !important'
                          : '30px !important'
                      }`,
                    }}
                    src={'/assets/v3/img/empty-state-light.png'}
                    alt={name}
                  />
                )}
              </Box>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
};

export default Avatar;
