import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import chroma from 'chroma-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@mui/material/styles';
import * as Icons from '@mui/icons-material';
import { Chip, Typography, Tooltip, Switch } from '@mui/material';
import Avatar from './Avatar';

export const GeneralText = ({
  primary,
  size,
  text,
  fontSize,
  style,
  label,
  markdown,
  color,
  beta,
  ui,
  type,
  restrictContent,
  structureId,
  fromMain,
  maxCharacters,
  uppercase,
  layout,
  classNameComponent,
  onClick,
  keyStructure,
  lineHeight,
}) => {
  const mode = primary
    ? 'storybook-text--primary'
    : 'storybook-text--secondary';

  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentlangCode = i18n.language;
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructures = businessStructure?.structures;
  const employees = businessPreference?.employees;
  const locations = businessPreference?.locations;

  const structure = businessStructures?.find((s) => s.id === structureId);

  const fields = structure?.fields;

  function getStatusFromPreferences(statusLabel) {
    //find the field where the dataType is 'status'
    const statusField = fields?.find((field) => field?.typeData === 'status');

    //find the status in the preferences with the field 'selections' under the status
    const status = statusField?.selections?.find(
      (selection) => selection?.value?.toString() === statusLabel?.toString()
    );

    return (
      status?.['label_' + currentlangCode] || status?.label || t('notAvailable')
    );
  }

  function getColorFromPreferences(statusLabel, color, type) {
    //find the field where the dataType is 'status'
    const statusField = fields?.find((field) => field.typeData === 'status');

    //find the status in the preferences with the field 'selections' under the status
    const status = statusField?.selections?.find(
      (selection) =>
        (
          selection?.['label_' + currentlangCode] || selection?.label
        )?.toString() === statusLabel?.toString()
    );

    const colorValue = color || status?.color || theme.palette.primary.main;
    const validColor = chroma.valid(colorValue) ? colorValue : '#000000';
    const lightColor = chroma(validColor).luminance(0.85).hex();

    return lightColor;
  }

  function getIconFromPreferences(statusLabel, typeData) {
    //find the field where the dataType is 'status'
    const priorityField = fields?.find((field) => field?.typeData === typeData);

    //find the status in the preferences with the field 'selections' under the status
    const icon = priorityField?.selections?.find(
      (selection) =>
        (
          selection?.['label_' + currentlangCode] || selection?.label
        )?.toString() === statusLabel?.toString()
    )?.icon;

    return icon;
  }

  function getEmployeeAvatar(employee) {
    const employeeData = employees?.find((emp) => emp.id === employee);
    return employeeData?.avatar;
  }

  function getEmployeeName(employee) {
    const employeeData = employees?.find((emp) => emp.id === employee);
    return (
      employeeData?.publicDisplay?.name ||
      employeeData?.displayName ||
      employeeData?.name
    );
  }

  function getLocationName(location) {
    const locationData = locations?.find((emp) => emp.id === location);
    return locationData?.name || '';
  }

  // Check if dark mode is active
  const isDarkMode = theme.palette.mode === 'dark';

  function CustomLinkRenderer({ href, children }) {
    const isExternalLink = href.startsWith('https://');

    return (
      <a
        href={href}
        target={isExternalLink ? '_blank' : '_self'}
        rel={isExternalLink ? 'noopener noreferrer' : undefined}
        style={{
          color: color === 'white' ? '#FFF' : businessPreference?.mainColor,
          fontSize: fontSize || '11px',
        }}
      >
        {children}
      </a>
    );
  }

  const transformCustomText = (text) => {
    if (typeof text !== 'string') return '';

    // Replace single asterisks with two newlines
    const modifiedText = text?.replace(/(?<!\*)\*(?!\*)/g, '\n\n\n');
    return modifiedText;
  };

  const transformTextBasedOnType = (text, type) => {
    switch (type) {
      case 'money':
        return text === '-' ? '-' : `${text}`;
      case 'status':
        const status = color ? text : getStatusFromPreferences(text);
        return status;
      case 'priority':
        const priority = getStatusFromPreferences(text);
        return priority;
      case 'date':
        const dateFormated =
          text?.seconds || text?._seconds || text
            ? moment
                .unix(text?.seconds || text?._seconds || text / 1000)
                .format('DD MMM YYYY')
            : t('noDate');

        return `${dateFormated}`;
      case 'date-time':
        const dateFormatedTime =
          text?.seconds || text?._seconds || text
            ? moment
                .unix(text?.seconds || text?._seconds || text / 1000)
                .format('DD MMM YYYY HH:mm')
            : t('noDate');
        return `${dateFormatedTime}`;
      case 'assigned':
        const userName = text?.name;
        return `${userName}`;

      default:
        return text;
    }
  };

  const iconMap = getIconFromPreferences(text, type);
  const IconDynamic = Icons[iconMap] || Icons.Error;

  const preprocessLinks = (text) => {
    const textString = typeof text === 'string' ? text : '';

    // Remove all tags except <a>
    const cleanText = textString.replace(/<(?!\/?a\b)[^>]+>/g, '');

    // Process <a> tags
    return cleanText.replace(
      /<a (.*?)>(.*?)<\/a>/g,
      (match, attributes, displayText) => {
        // Extract attributes
        const id = attributes.match(/id=["']?([^"'\s]*)["']?/)?.[1];
        const collection = attributes.match(
          /collection=["']?([^"'\s]*)["']?/
        )?.[1];
        const structure = attributes.match(
          /structure=["']?([^"'\s]*)["']?/
        )?.[1];

        if (collection === 'employees') {
          return `${displayText}`;
        } else {
          // Construct the markdown-compatible link
          const href = `/app/element/${collection}/${structure}/${id}`;
          return `[${displayText}](${href})`;
        }
      }
    );
  };

  const renderContent = () => {
    const validText = typeof text === 'string' ? text : text?.toString();
    let transformedText =
      type === 'date'
        ? text
        : type === 'assigned'
        ? text
        : type === 'tags'
        ? text
        : type === 'date-time'
        ? text
        : transformCustomText(validText);
    transformedText = transformTextBasedOnType(
      transformedText,
      type === 'plainText' ? 'plainText' : type
    );

    if (maxCharacters && transformedText.length > maxCharacters) {
      transformedText = transformedText.substring(0, maxCharacters) + '...';
    }

    const markdownText = preprocessLinks(transformedText);

    if (markdown) {
      return (
        <div
          className="markdown-content"
          style={{
            color: primary
              ? color === 'white'
                ? '#FFF'
                : isDarkMode
                ? '#FFF'
                : '#000'
              : color === 'white'
              ? '#FFF'
              : color || '#000',
            fontSize: `${fontSize}`,
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            children={markdownText}
            components={{
              a: ({ node, ...props }) => (
                <CustomLinkRenderer {...props} transformedText={props.href} />
              ),
            }}
          />
        </div>
      );
    } else if (type === 'status' || ui === 'chip') {
      return (
        <Chip
          size="xsm"
          label={transformedText}
          className={
            color !== 'white'
              ? 'smallChipText middle-content'
              : ' middle-content'
          }
          icon={type === 'status' && <IconDynamic color={color || '#000'} />}
          sx={{
            backgroundColor:
              type === 'status'
                ? getColorFromPreferences(
                    transformedText,
                    color === 'white' ? 'transparent' : color
                  )
                : businessPreference?.mainColor + '10',
            color: color === 'white' ? '#FFF' : color || '#000',
            fontWeight: color === 'white' ? 600 : 400,
            height: color === 'white' ? fontSize : '22px',
            marginTop: color === 'white' ? '0px' : fromMain ? '10px' : '',
            marginBottom: color === 'white' ? '0px' : fromMain ? '0px' : '5px',
            fontSize: color === 'white' ? fontSize : '9px !important',
          }}
        />
      );
    } else if (type === 'boolean') {
      return (
        <Switch
          checked={
            transformedText === 'false'
              ? false
              : transformedText === 'true'
              ? true
              : false
          }
          color="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
          disabled
          className="middle-content"
          sx={{
            marginLeft: '-8px',
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: primary
                ? isDarkMode
                  ? '#FFF'
                  : businessPreference?.mainColor
                : '#FFF',
              width: '38px',
              height: '20px',
            },
            '& .MuiSwitch-thumb': {
              width: '15px',
              height: '15px',
              marginTop: '-9px',
            },
            height: '20px',
            '& .MuiSwitch-track': {
              borderRadius: '20px',
              height: '16px',
              marginTop: '-8px',
            },
            width: '55px',
            maxWidth: '55px',
          }}
        />
      );
    } else if (type === 'tags') {
      let tags = [];
      if (transformedText?.length > 0) {
        tags = transformedText;
      } else {
        tags = [t('noTag'), t('...')];
      }

      const firstTags = restrictContent ? tags?.slice(0, 2) : tags;

      // Ensure firstTags is always an array
      const safeFirstTags = Array.isArray(firstTags) ? firstTags : [];

      return (
        <div>
          {safeFirstTags.map((tag, index) => (
            <Chip
              size="small"
              key={index}
              label={tag}
              className="smallChipTextTags"
              style={{
                backgroundColor: businessPreference?.secColor + '10',
                marginBottom: '5px',
                borderRadius: '7px',
                height: '18px',
                marginRight: '3px',
              }}
            />
          ))}
        </div>
      );
    } else if (keyStructure === 'locationId') {
      return (
        <div
          style={{
            marginTop: fromMain ? '10px' : '-6px',
          }}
          className="d-flex middle-content"
        >
          <div>
            <Icons.PinDropOutlined />
          </div>
          <div
            style={{
              marginTop: '-5px',
              marginLeft: '-3px',
            }}
            className="fs-11"
          >
            {getLocationName(text)}
          </div>
        </div>
      );
    } else if (
      type === 'assigned' ||
      type === 'assignedToId' ||
      type === 'assignedTo'
    ) {
      return (
        <div
          style={{
            marginTop: fromMain ? '10px' : '-6px',
          }}
          className="d-flex middle-content"
        >
          <div>
            <Avatar
              size="xsm"
              img={getEmployeeAvatar(text)}
              alt={getEmployeeName(text)}
              userId={text}
            />
          </div>
          <div
            style={{
              marginTop: '-5px',
              marginLeft: '-3px',
            }}
            className="fs-11"
          >
            {getEmployeeName(text)}
          </div>
        </div>
      );
    } else if (type === 'slider') {
      return (
        <div className="d-flex middle-content">
          <IconDynamic
            htmlColor={color}
            selected={false}
            style={{ fontSize: fontSize || '11px' }}
          />
          <div style={{ fontSize: fontSize || '10px' }} className="px-2">
            {transformedText}
          </div>
        </div>
      );
    } else if (type === 'selection') {
      return (
        <div className="d-flex middle-content">
          <IconDynamic
            htmlColor={color}
            selected={false}
            style={{ fontSize: fontSize || '11px' }}
          />
          <div style={{ fontSize: fontSize || '10px' }} className="px-2">
            {transformedText}
          </div>
        </div>
      );
    } else if (type === 'date' || type === 'date-time') {
      return (
        <div style={{ marginTop: '2px' }} className="d-flex">
          <div style={{ paddingTop: '1px' }}>
            <Icons.CalendarMonthOutlined
              htmlColor={
                layout?.color === 'secColor'
                  ? businessStructure?.secColor
                  : color || '#696969'
              }
              sx={{
                fontSize: fontSize || '10px',
              }}
            />
          </div>
          <div className="px-2">
            <span style={{ fontSize: fontSize || '10px' }}>
              {transformedText}
            </span>
          </div>
        </div>
      );
    } else if (type === 'array') {
      return (
        <div style={{ marginTop: '2px', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {text?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {/* Dynamically generate table data cells based on object values */}
                  {Object.keys(item).map((key, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        borderBottom: '1px solid grey',
                        padding: '8px',
                        fontSize: fontSize || '10px',
                      }}
                    >
                      {typeof item[key] === 'object' && item[key] !== null ? (
                        // Check if item[key] is an array, then map through it
                        Array.isArray(item[key]) ? (
                          item[key]?.map((subItem, subIndex) => (
                            <div key={subIndex}>
                              {/* Render nested object properties */}
                              {Object.keys(subItem).map(
                                (subKey, subColIndex) => (
                                  <div key={subColIndex}>
                                    {subKey}: {subItem[subKey]}
                                  </div>
                                )
                              )}
                            </div>
                          ))
                        ) : (
                          // If it's an object but not an array, render its properties
                          <div>
                            {Object.keys(item[key]).map(
                              (subKey, subColIndex) => (
                                <div className="fs-10" key={subColIndex}>
                                  {subKey}: {item[key][subKey]}
                                </div>
                              )
                            )}
                          </div>
                        )
                      ) : (
                        // Render the value if it's not an object
                        item[key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return transformedText;
    }
  };

  return (
    <>
      <div>
        <div
          style={{
            ...style,
            fontSize: `${fontSize}`,
            color:
              color === 'white'
                ? '#FFF'
                : primary
                ? isDarkMode
                  ? '#FFF'
                  : '#000'
                : color || '#FFF',
            textTransform: `${uppercase ? 'uppercase' : 'none'}`,
            cursor: onClick ? 'pointer' : 'default',
            maxHeight:
              ((type === 'string' || type === 'text') && lineHeight) || null,
            lineHeight:
              ((type === 'string' || type === 'text') && lineHeight) || 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
          }}
          className={[
            'storybook-text',
            `storybook-text--${size}`,
            `${classNameComponent}`,
            mode,
          ].join(' ')}
          onClick={onClick}
          title={text}
        >
          {businessPreference?.preferences?.fieldsView === 'reverse' &&
            label &&
            type !== 'status' && (
              <div style={{ marginTop: '-3px', marginBottom: '2px' }}>
                <Typography
                  fontSize="10.5px"
                  sx={{ marginTop: '-20px' }}
                  fontWeight={300}
                  color={color === 'white' ? '#FFF' : '#696969'}
                  variant="caption"
                >
                  {label}
                </Typography>
              </div>
            )}
          {renderContent()}
          {beta && (
            <Tooltip title={t('betaFunctionLetUsKnow')} placement="bottom">
              <div
                className="d-flex "
                style={{ marginTop: '3px', marginBottom: '2px' }}
              >
                <div>
                  <Icons.TryOutlined color="primary" fontSize="9px" />
                </div>
                <div style={{ marginLeft: '3px', marginTop: '-2px' }}>
                  <Typography
                    fontSize="9px"
                    fontWeight={300}
                    color={businessPreference?.mainColor}
                    variant="caption"
                  >
                    {t('betaFunction')}
                  </Typography>
                </div>
              </div>
            </Tooltip>
          )}
          {businessPreference?.preferences?.fieldsView !== 'reverse' &&
            label &&
            (type !== 'status' || color === 'white') && (
              <div style={{ marginBottom: '2px' }}>
                <Typography
                  variant="caption"
                  fontWeight={400}
                  color={color === 'white' ? '#FFF' : '#69696990'}
                  fontSize={10}
                  sx={{
                    marginTop: '-16px',
                    marginLeft:
                      color === 'white' && type === 'status' ? '23px' : '0px',
                  }}
                >
                  {label}
                </Typography>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default GeneralText;
