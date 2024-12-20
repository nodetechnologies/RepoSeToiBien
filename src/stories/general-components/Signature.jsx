import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Box, FormControl, IconButton, InputLabel } from '@mui/material';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';
import SignaturePad from 'react-signature-canvas';
import { UndoOutlined, SaveOutlined } from '@mui/icons-material';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

export const Signature = ({
  variant = 'outlined',
  label,
  value,
  defaultValue,
  filterValue,
  onChange,
  onBlur,
  staticView,
  noEmpty,
  fieldType,
  ...props
}) => {
  const businessPreference = useSelector((state) => state.core.businessData);
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';

  // Reference for Signature Pad
  const sigPadRef = useRef(null);

  // State to track if there's a signature
  const [isEmpty, setIsEmpty] = useState(true);

  // Function to clear the signature pad
  const clearSignature = () => {
    sigPadRef.current.clear();
    setIsEmpty(true);
  };

  const resetValue = () => {
    onChange('', fieldType, null, null);
  };

  // Function to save the signature and send it to the server
  const saveSignature = async () => {
    const signatureData = await nodeAxiosFirebase({
      t,
      method: 'POST',
      url: `coreSeqV2/upload`,
      body: {
        image: sigPadRef.current.getTrimmedCanvas().toDataURL('image/png'),
      },
    });
    if (!signatureData) {
      clearSignature();
      return;
    }
    onChange(signatureData?.fileUrl, fieldType, null, null);
    onBlur(signatureData?.fileUrl, fieldType, null, null);
  };

  // Handle changes to detect if the pad is empty or not
  const handleEnd = () => {
    setIsEmpty(sigPadRef.current.isEmpty());
  };

  return (
    <ErrorBoundary>
      <Box>
        <FormControl
          fullWidth
          margin="normal"
          sx={{
            border: '1px solid lightgray',
            borderRadius: '10px',
            padding: '10px',
            minHeight: '50px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFFFFF',
            },
          }}
        >
          <InputLabel
            shrink={true}
            error={props.error}
            required={props.required}
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
          {value ? (
            <div>
              <img src={value} alt="Signature" width={200} height={100} />
              <IconButton
                onClick={resetValue}
                disabled={isEmpty}
                sx={{
                  backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFFFFF',
                }}
              >
                <UndoOutlined />
              </IconButton>
            </div>
          ) : (
            <Box
              className="mt-3"
              sx={{
                position: 'relative',
              }}
            >
              <SignaturePad
                ref={sigPadRef}
                canvasProps={{
                  width: 490,
                  height: 200,
                  className: 'sigCanvas',
                  style: {
                    borderRadius: '12px',
                  },
                }}
                onEnd={handleEnd}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                }}
                mt={2}
                display="flex"
                gap={1}
              >
                <IconButton
                  onClick={clearSignature}
                  disabled={isEmpty}
                  sx={{
                    backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFFFFF',
                  }}
                >
                  <UndoOutlined />
                </IconButton>
                <IconButton
                  onClick={saveSignature}
                  disabled={isEmpty}
                  sx={{
                    backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFFFFF',
                  }}
                >
                  <SaveOutlined />
                </IconButton>
              </Box>
            </Box>
          )}
        </FormControl>
      </Box>
    </ErrorBoundary>
  );
};

export default Signature;
