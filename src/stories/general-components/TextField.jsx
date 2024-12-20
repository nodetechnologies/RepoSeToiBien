import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MaskedInput from 'react-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';
import { useTheme } from '@mui/material/styles';
import MUITextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import Visibility from '@mui/icons-material/Visibility';
import {
  CheckCircle,
  ColorLens,
  Comment,
  CreditCard,
  Email,
  InfoOutlined,
  Link,
  Map,
  Phone,
  Search,
  Send,
  VisibilityOff,
  VpnKeyOutlined,
} from '@mui/icons-material';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
} from '@mui/material';
import Popper from '@mui/material/Popper';
import MainSearch from '../../components/@generalComponents/layout/MainSearch/MainSearch';
import { toast } from 'react-toastify';

const TextMaskCustom = (props) => {
  const { inputRef, mask, ...other } = props;
  const handleClick = (event) => {
    event.target.setSelectionRange(0, 0);
  };
  const emailMaskDefault = [
    /[a-zA-Z0-9._%+-]/,
    /[a-zA-Z0-9._%+-]/,
    /[a-zA-Z0-9._%+-]/,
    /[a-zA-Z0-9._%+-]/,
    /[a-zA-Z0-9._%+-]/,
    /[a-zA-Z0-9._%+-]/,
    /[a-zA-Z0-9._%+-]/,
    /[a-zA-Z0-9._%+-]/,
    /[a-zA-Z0-9._%+-]/,
    /[a-zA-Z0-9._%+-]/,
    '@',
    /[a-zA-Z0-9.-]/,
    /[a-zA-Z0-9.-]/,
    /[a-zA-Z0-9.-]/,
    '.',
    /[a-zA-Z]/,
    /[a-zA-Z]/,
  ];

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        if (typeof inputRef === 'function') {
          inputRef(ref ? ref.inputElement : null);
        }
      }}
      mask={mask === emailMaskDefault ? emailMask : mask}
      onClick={handleClick}
      placeholderChar={'\u2000'}
      showMask
    />
  );
};

export const TextField = ({
  variant = 'outlined',
  onChange,
  onBlur,
  type,
  mask,
  value,
  valueSer,
  size,
  help,
  validation,
  toReset,
  isLoading,
  transform,
  dontAllowSlash,
  staticField,
  allowMention,
  onChangeServer,
  fieldType,
  handleKeyPress,
  ref,
  ...props
}) => {
  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructures = useSelector(
    (state) => state.core.businessStructure
  )?.structures;
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';

  const { t } = useTranslation();
  let maskArray = mask;

  // Only transform if mask is a string
  if (typeof mask === 'string') {
    let maskString = mask || '';
    maskArray = maskString?.slice(1, -1)?.split(', ');

    maskArray = maskArray?.map((item) => {
      if (item?.startsWith('/') && item?.endsWith('/')) {
        return new RegExp(item?.slice(1, -1));
      }
      if (item?.startsWith("'") && item?.endsWith("'")) {
        return item.slice(1, -1);
      }
      return item;
    });
  }

  // Initialize the input value
  const [valueServer, setValueServer] = useState(valueSer || '');
  const currentPath = window.location.pathname;

  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isValidated, setIsValidate] = useState(false);
  const [clicked, setClicked] = useState(false);

  const currentPageTitle = document.title;

  const handleCopy = () => {
    let finalHelp = help?.startsWith('ID') ? help?.split('ID: ')[1] : help;
    navigator.clipboard.writeText(finalHelp);
    toast.success(t('copied'));
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (toReset) {
      setValueServer('');
    }
  }, [toReset]);

  const onChangeField = (event) => {
    const { value: updatedValue } = event.target;

    let newEvent = event;

    if (
      event?.target?.value?.includes('/') &&
      !allowMention &&
      dontAllowSlash &&
      (fieldType === 'text' || fieldType === 'string')
    ) {
      newEvent = {
        target: {
          value: event.target.value.replace(/\//g, ''),
        },
      };
      setError('/');
    } else {
      setError('');
    }

    // Trigger onChange event
    onChange(newEvent, fieldType, null, null);

    // Check if the last word starts
    const lastWord = updatedValue.split(/\s+/).pop();
    if (lastWord && lastWord.startsWith('@') && allowMention) {
      setAnchorEl(event.target);
      setOpenPopper(true);
    } else {
      setOpenPopper(false);
    }

    // Mention Replacement
    let updatedServerValue = updatedValue;
    const storedMentions = [];

    for (const mention of mentionSuggestions) {
      const {
        name,
        startIndex,
        path,
        structureId,
        documentId,
        collectionField,
      } = mention;

      // Add mention to the storage
      storedMentions.push({ name, startIndex, path });

      // Replace in the serverValue
      updatedServerValue = updatedServerValue.replace(
        `@${name}`,
        `<a id=${documentId} path=${path} structure=${structureId} from=${currentPath} collection=${collectionField} title=${currentPageTitle}> @${name} </a>`
      );
    }

    setValueServer(updatedServerValue);
    if (onChangeServer) {
      onChangeServer(updatedServerValue, fieldType, storedMentions);
    }
  };

  const handleStructureSelect = (elementCollection, elementId) => {
    setSelectedCategory({ id: elementId, collection: elementCollection });
    setOpen(true);
    setOpenPopper(false);
  };

  const handleElementSelect = (elementPath, elementname) => {
    const updatedValue = value?.replace(/@[^\s]*\s?$/, ` @${elementname} `);
    onChange({ target: { value: updatedValue } }, fieldType, null);
    setValueServer(
      valueServer +
        `<a id=${elementPath
          .split('/')
          .pop()} path=${elementPath} from=${currentPath} structure=${
          selectedCategory?.id
        } collection=${selectedCategory?.collection} > @${elementname} </a>`
    );

    //add to mentions suggestions
    const newMention = {
      name: elementname,
      path: elementPath,
      structureId: selectedCategory?.id,
      documentId: elementPath.split('/').pop(),
      collectionField: selectedCategory?.collection,
    };
    setMentionSuggestions((prevSuggestions) => [
      ...prevSuggestions,
      newMention,
    ]);

    handleClose();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const transformValue = (value) => {
    if (transform === 'uppercase') {
      return value.toUpperCase();
    } else if (transform === 'lowercase') {
      return value.toLowerCase();
    } else if (transform === 'capitalize') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  };

  useEffect(() => {
    if (validation !== 'none' && validation !== null) {
      try {
        // Ensure validation is a valid regex string
        const regex = new RegExp(validation);
        const isValid = regex.test(value);
        setIsValidate(isValid);
      } catch (e) {
        console.error('Invalid regex:', validation, e);
        setIsValidate(false);
      }
    }
    if (transform && value) {
      const transformedValue = transformValue(value);
      onChange({ target: { value: transformedValue } }, fieldType, null);
    }
  }, [value]);

  let transformedText = '';

  if (validation) {
    transformedText = validation
      .replace(/\\d\{(\d+)\}/g, (_, n) => '#'.repeat(n))
      .replace(/[\^$\\]/g, '');
  }

  return (
    <div>
      <Dialog style={{ zIndex: 100000 }} open={open} onClose={handleClose}>
        <DialogContent>
          <div style={{ width: '450px', padding: '20px', height: '450px' }}>
            <MainSearch
              fromExternal
              setClicked={setClicked}
              clicked={clicked}
              structureIden={selectedCategory?.id}
              onSelectReturn={handleElementSelect}
              structureCollection={selectedCategory?.collection}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Popper
        open={openPopper}
        anchorEl={anchorEl}
        style={{
          zIndex: 10000,
          backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#fff',
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
          borderRadius: '10px',
        }}
      >
        <List>
          {businessStructures?.map((category) => (
            <ListItem divider dense key={category.id} disablePadding>
              <ListItemButton
                onClick={() =>
                  handleStructureSelect(
                    category?.collectionField,
                    category?.id,
                    'element'
                  )
                }
              >
                <ListItemText primary={category?.name} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem divider dense key={'employees'} disablePadding>
            <ListItemButton
              onClick={() =>
                handleStructureSelect(
                  'employees',
                  businessPreference?.id,
                  'tag'
                )
              }
            >
              <ListItemText primary={t('teamMembers')} />
            </ListItemButton>
          </ListItem>
        </List>
      </Popper>
      {type === 'cc' ? (
        <MUITextField
          variant={variant}
          {...props}
          InputLabelProps={{
            shrink: true,
          }}
          ref={ref}
          onChange={(event) => onChangeField(event, fieldType)}
          onBlur={onBlur && ((event) => onBlur(event, fieldType))}
          margin="normal"
          mask={maskArray}
          helperText={
            <span className="fs-10" onClick={handleCopy}>
              {help}
            </span>
          }
          type={type}
          error={props.error}
          onKeyDown={(event) =>
            handleKeyPress && handleKeyPress(event, fieldType)
          }
          value={value || ''}
          InputProps={{
            inputComponent: TextMaskCustom,
            inputProps: { mask: maskArray },
            endAdornment: (
              <InputAdornment sx={{ marginRight: '-4px' }} position="end">
                <CreditCard />
              </InputAdornment>
            ),
          }}
          sx={{
            'MuiFormControl-root': {
              width: '100%',
            },
            '.MuiInputBase-input': {
              height: staticField ? '30px' : '42px',
              padding: '2px 10px 2px 10px',
              fontSize: size === 'small' ? '11px' : '13px',
            },
            '& .MuiFormLabel-root': {
              backgroundColor: isDarkmode && 'rgb(51,51,51)',
              padding: '2px 10px 2px 10px',
              borderRadius: '10px',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              '&.Mui-focused fieldset': {
                borderColor: businessPreference?.mainColor || '#000',
                boxShadow: `0 0 0 0.2rem ${
                  businessPreference?.mainColor + '20'
                }`,
              },
            },
          }}
        />
      ) : type === 'password' ? (
        <MUITextField
          variant={variant}
          {...props}
          ref={ref}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => onChangeField(event, fieldType)}
          onBlur={onBlur && ((event) => onBlur(event, fieldType))}
          margin="normal"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleKeyPress && handleKeyPress(e);
            }
          }}
          type={showPassword ? 'text' : 'password'}
          error={props.error}
          helperText={
            <span className="fs-10" onClick={handleCopy}>
              {help}
            </span>
          }
          value={staticField ? '' : value}
          InputProps={{
            endAdornment: (
              <InputAdornment sx={{ marginRight: '-4px' }} position="end">
                {showPassword ? (
                  <VisibilityOff
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  />
                ) : (
                  <Visibility
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  />
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            'MuiFormControl-root': {
              width: '100%',
            },
            '.MuiInputBase-input': {
              height: staticField ? '30px' : size === 'small' ? '34px' : '42px',
              padding: '2px 10px 2px 10px',
              fontSize: size === 'small' ? '11px' : '13px',
            },
            '& .MuiFormLabel-root': {
              backgroundColor: isDarkmode && 'rgb(51,51,51)',
              padding: '2px 10px 2px 10px',
              borderRadius: '10px',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              '&.Mui-focused fieldset': {
                borderColor: businessPreference?.mainColor || '#000',
                boxShadow: `0 0 0 0.2rem ${
                  businessPreference?.mainColor + '20'
                }`,
              },
            },
          }}
        />
      ) : type === 'codeAccess' ? (
        <MUITextField
          variant={variant}
          {...props}
          ref={ref}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => onChangeField(event, fieldType)}
          onBlur={onBlur && ((event) => onBlur(event, fieldType))}
          margin="normal"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleKeyPress && handleKeyPress(e);
            }
          }}
          type={'text'}
          error={props.error}
          helperText={
            <span className="fs-10" onClick={handleCopy}>
              {help}
            </span>
          }
          value={staticField ? '' : value}
          InputProps={{
            endAdornment: (
              <InputAdornment sx={{ marginRight: '-4px' }} position="end">
                <VpnKeyOutlined />
              </InputAdornment>
            ),
          }}
          sx={{
            'MuiFormControl-root': {
              width: '100%',
            },
            '.MuiInputBase-input': {
              height: staticField ? '30px' : size === 'small' ? '34px' : '42px',
              padding: '2px 10px 2px 10px',
              fontSize: size === 'small' ? '11px' : '13px',
            },
            '& .MuiFormLabel-root': {
              backgroundColor: isDarkmode && 'rgb(51,51,51)',
              padding: '2px 10px 2px 10px',
              borderRadius: '10px',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              '&.Mui-focused fieldset': {
                borderColor: businessPreference?.mainColor || '#000',
                boxShadow: `0 0 0 0.2rem ${
                  businessPreference?.mainColor + '20'
                }`,
              },
            },
          }}
        />
      ) : validation !== null &&
        validation !== 'none' &&
        validation !== '' &&
        (fieldType === 'text' || fieldType === 'string') ? (
        <MUITextField
          variant={variant}
          {...props}
          ref={ref}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => onChangeField(event, fieldType)}
          onBlur={onBlur && ((event) => onBlur(event, fieldType))}
          margin="normal"
          type={'text'}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleKeyPress && handleKeyPress(e);
            }
          }}
          error={props?.error || error === '/'}
          helperText={help || error === '/' ? t('barNotAllow') : ''}
          value={staticField ? '' : value}
          InputProps={{
            inputComponent: mask && TextMaskCustom,
            inputProps: { mask: mask && maskArray },
            endAdornment: (
              <InputAdornment sx={{ marginRight: '-4px' }} position="end">
                {isValidated ? (
                  <CheckCircle color="success" />
                ) : (
                  <Tooltip title={transformedText}>
                    <InfoOutlined color="error" />
                  </Tooltip>
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            'MuiFormControl-root': {
              width: '100%',
            },
            '.MuiInputBase-input': {
              height: staticField ? '30px' : size === 'small' ? '34px' : '42px',
              padding: '2px 10px 2px 10px',
              fontSize: size === 'small' ? '11px' : '13px',
            },
            '& .MuiFormLabel-root': {
              backgroundColor: isDarkmode && 'rgb(51,51,51)',
              padding: '2px 10px 2px 10px',
              borderRadius: '10px',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              '&.Mui-focused fieldset': {
                borderColor: businessPreference?.mainColor || '#000',
                boxShadow: `0 0 0 0.2rem ${
                  businessPreference?.mainColor + '20'
                }`,
              },
            },
          }}
        />
      ) : (
        <MUITextField
          variant={variant}
          {...props}
          ref={ref}
          helperText={
            <span className="fs-10" onClick={handleCopy}>
              {help}
            </span>
          }
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => onChangeField(event, fieldType)}
          onBlur={onBlur && ((event) => onBlur(event, fieldType))}
          margin="normal"
          type={type}
          error={props.error}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleKeyPress(e);
            }
          }}
          value={staticField ? '' : value}
          InputProps={{
            inputComponent: mask && TextMaskCustom,
            inputProps: { mask: mask && maskArray },
            endAdornment: (
              <InputAdornment sx={{ marginRight: '-4px' }} position="end">
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : type === 'number' ? (
                  <NumbersOutlinedIcon />
                ) : type === 'search' ? (
                  <Search />
                ) : type === 'geo' ? (
                  <Map />
                ) : type === 'color' ? (
                  <ColorLens />
                ) : type === 'url' ? (
                  <Link />
                ) : type === 'phone' ? (
                  <Phone />
                ) : type === 'email' ? (
                  <Email />
                ) : type === 'comment' ? (
                  <Comment />
                ) : type === 'message' ? (
                  <Send />
                ) : (
                  <TextFieldsOutlinedIcon />
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            'MuiFormControl-root': {
              width: '100%',
            },
            '.MuiInputBase-input': {
              height: staticField ? '30px' : size === 'small' ? '34px' : '42px',
              padding:
                size === 'small' ? '0 10px 0  10px' : '2px 10px 2px 10px',
              boxSizing: 'border-box',
              fontSize: size === 'small' ? '11px' : '13px',
            },
            '& .MuiFormLabel-root': {
              backgroundColor: isDarkmode && 'rgb(51,51,51)',
              padding: size === 'small' ? '0 10px' : '2px 10px 2px 10px',
              marginTop: size === 'small' ? (value ? '0px' : '-7px') : '',
              borderRadius: '10px',
              color: type === 'color' && '#000',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              '&.Mui-focused fieldset': {
                borderColor: businessPreference?.mainColor || '#000',
                boxShadow: `0 0 0 0.2rem ${
                  businessPreference?.mainColor + '20'
                }`,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default TextField;
