// Libraries
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

// Components
import GeneralText from '../../../stories/general-components/GeneralText';

const CardItems = ({ items, card, includeGroupsTotal }) => {
  const { t } = useTranslation();
  const [groupedItems, setGroupedItems] = useState([]);
  const safeItems = Object?.values(items);
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (safeItems) {
      const orderedItems = safeItems?.sort((a, b) => {
        //order with order field
        if (a.order < b.order) {
          return -1;
        }
        if (a.order > b.order) {
          return 1;
        }
        return 0;
      });

      const grouped =
        safeItems &&
        orderedItems?.reduce((acc, item) => {
          const groupKey = item?.group || 'other'; // Default group if not specified
          if (!acc[groupKey]) {
            acc[groupKey] = { services: [], others: [] };
          }
          if (item.isService) {
            acc[groupKey].services.push(item);
          } else {
            acc[groupKey].others.push(item);
          }
          return acc;
        }, {});

      // Sort each group internally
      Object.values(grouped).forEach((group) => {
        group.services.sort((a, b) => a.name.localeCompare(b.name));
        group.others.sort((a, b) => a.name.localeCompare(b.name));
      });

      // Flatten groups into a sorted array
      const sortedItems = Object.entries(grouped).map(([groupKey, group]) => ({
        groupKey,
        items: [...group.services, ...group.others],
      }));

      setGroupedItems(sortedItems);
    }
  }, [items]);

  return (
    <>
      {isXsScreen ? (
        <Grid container spacing={2}>
          {groupedItems?.map(({ groupKey, items }) =>
            items
              ?.sort((a, b) => {
                if (
                  a.hookedWith.startsWith('services') &&
                  b.hookedWith.startsWith('articles')
                ) {
                  return -1;
                } else if (
                  a.hookedWith.startsWith('articles') &&
                  b.hookedWith.startsWith('services')
                ) {
                  return 1;
                } else {
                  return 0;
                }
              })
              .map((item, index) => (
                <Grid item xs={12} key={item.itemId || index}>
                  <GeneralText
                    fontSize="11px"
                    size="bold"
                    color="black"
                    text={item?.name?.split('(')[0]}
                    primary={false}
                  />
                  <Typography variant="body2" fontSize="11px" color="black">
                    {item?.sku}
                  </Typography>
                  <div className="d-flex">
                    <Typography
                      className="col-3"
                      variant="body2"
                      fontSize="11px"
                      color="black"
                    >
                      {' '}
                      {(item?.finances?.unity / 10000)?.toFixed(2) + ' $'}
                    </Typography>
                    <Typography
                      className="col-3"
                      variant="body2"
                      color="black"
                      fontSize="11px"
                    >
                      {item?.quantity?.toFixed(2)}
                    </Typography>
                    <Typography
                      fontWeight={500}
                      fontSize="11px"
                      color="black"
                      className="col-6 align-right"
                      variant="body2"
                    >
                      {(item?.finances?.subtotal / 10000)?.toFixed(2) + ' $'}
                    </Typography>
                  </div>

                  <Typography
                    fontSize="11px"
                    sx={{ marginTop: '5px' }}
                    variant="body2"
                    color="black"
                  >
                    {item?.finances?.options?.map((option, index) => (
                      <div className="fs-11 d-flex">
                        <p className="fs-11 fw-600"> {t('optionAdded')}: </p>
                        <p className="fs-11 mx-2">
                          {' ' +
                            option?.name +
                            ' (+' +
                            (option?.price / 10000)?.toFixed(2) +
                            ' $)'}
                        </p>
                      </div>
                    ))}
                  </Typography>
                  {item?.finances?.fees !== 0 &&
                    item?.finances?.fees !== NaN && (
                      <Typography
                        fontSize="11px"
                        sx={{ marginTop: '5px' }}
                        variant="body2"
                        color="black"
                      >
                        <div className="fs-11 d-flex">
                          <p className="fs-11 fw-600"> {t('specialFees')}: </p>
                          <p className="fs-11 mx-2">
                            {' ' +
                              ' (+' +
                              ((item?.finances?.fees || 0) / 10000)?.toFixed(
                                2
                              ) +
                              ' $)'}
                          </p>
                        </div>
                      </Typography>
                    )}
                  <Typography
                    sx={{ marginTop: '5px' }}
                    fontSize="11px"
                    variant="body2"
                    color="black"
                  >
                    {item?.description}
                  </Typography>
                  <Divider component="div" />
                </Grid>
              ))
          )}
        </Grid>
      ) : (
        <TableContainer>
          <Table
            sx={{ backgroundColor: '#FFF' }}
            aria-label="invoice items"
            size="small"
          >
            <TableHead sx={{ backgroundColor: '#FFF' }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: '11px',
                    py: 1.5,
                  }}
                  colSpan={3}
                >
                  <GeneralText
                    fontSize="11px"
                    size="medium"
                    text={t('name')}
                    primary={false}
                    color="black"
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                    color: 'black',
                  }}
                  colSpan={2}
                >
                  <GeneralText
                    fontSize="11px"
                    size="medium"
                    text={t('reference')}
                    primary={false}
                    color="black"
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                    color: 'black',
                  }}
                  colSpan={1}
                >
                  <GeneralText
                    fontSize="11px"
                    size="medium"
                    text={t('unity')}
                    primary={false}
                    color="black"
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                  }}
                  colSpan={1}
                >
                  <GeneralText
                    fontSize="11px"
                    size="medium"
                    text={t('quantity')}
                    primary={false}
                    color="black"
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                  }}
                  colSpan={1}
                >
                  {' '}
                  <GeneralText
                    fontSize="11px"
                    size="medium"
                    text={t('total')}
                    primary={false}
                    color="black"
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedItems?.map(({ groupKey, items }) => (
                <>
                  {items
                    ?.sort((a, b) => {
                      if (
                        a.hookedWith?.startsWith('services') &&
                        b.hookedWith?.startsWith('articles')
                      ) {
                        return -1;
                      } else if (
                        a.hookedWith?.startsWith('articles') &&
                        b.hookedWith?.startsWith('services')
                      ) {
                        return 1;
                      } else {
                        return 0;
                      }
                    })
                    ?.map((item, index) => (
                      <>
                        <TableRow key={item?.id || index}>
                          <TableCell
                            colSpan={3}
                            sx={{
                              maxWidth: '350px',
                              border:
                                item?.description &&
                                item?.description !== '-' &&
                                0,
                            }}
                            component="th"
                            scope="row"
                          >
                            <GeneralText
                              fontSize="11px"
                              size="bold"
                              text={item?.name?.split('(')[0]}
                              primary={false}
                              color="black"
                            />
                            {item?.finances?.options?.length > 0 && (
                              <>
                                {item?.finances?.options?.map(
                                  (option, index) => (
                                    <div>
                                      <GeneralText
                                        fontSize="11px"
                                        size="medium"
                                        text={option?.name || ''}
                                        primary={false}
                                        color="black"
                                      />
                                    </div>
                                  )
                                )}
                              </>
                            )}
                            {item?.description && item?.description !== '-' && (
                              <GeneralText
                                fontSize="10.5px"
                                size="regular"
                                text={item?.description}
                                primary={false}
                                color="#696969"
                              />
                            )}
                          </TableCell>

                          <TableCell
                            colSpan={2}
                            sx={{
                              border:
                                item?.description &&
                                item?.description !== '-' &&
                                0,
                            }}
                          >
                            <GeneralText
                              fontSize="11px"
                              size="medium"
                              text={item?.sku}
                              primary={false}
                              color="black"
                            />
                          </TableCell>

                          <TableCell
                            colSpan={1}
                            sx={{
                              border:
                                item?.description &&
                                item?.description !== '-' &&
                                0,
                            }}
                          >
                            <GeneralText
                              fontSize="11px"
                              size="regular"
                              text={
                                (
                                  item?.finances?.options?.reduce(
                                    (acc, option) =>
                                      acc + (option?.price / 10000 || 0),
                                    0
                                  ) +
                                  item?.finances?.unity / 10000
                                )?.toFixed(2) + '$'
                              }
                              primary={false}
                              color="black"
                            />
                          </TableCell>
                          <TableCell
                            colSpan={1}
                            sx={{
                              border:
                                item?.description &&
                                item?.description !== '-' &&
                                0,
                            }}
                          >
                            <GeneralText
                              fontSize="11px"
                              size="regular"
                              text={item?.quantity}
                              primary={false}
                              color="black"
                            />
                          </TableCell>
                          <TableCell
                            colSpan={1}
                            sx={{
                              border:
                                item?.description &&
                                item?.description !== '-' &&
                                0,
                            }}
                          >
                            <GeneralText
                              fontSize="11px"
                              size="regular"
                              text={`${(
                                item?.finances?.subtotal / 10000
                              )?.toFixed(2)}$`}
                              primary={false}
                              color="black"
                            />
                          </TableCell>
                        </TableRow>

                        {item?.finances?.fees !== 0 &&
                          item?.finances?.fees !== NaN && (
                            <TableRow>
                              <TableCell sx={{ border: 0 }} colSpan={8}>
                                <Typography
                                  fontSize="10px"
                                  fontWeight={400}
                                  color="black"
                                  sx={{ marginTop: '-10px' }}
                                >
                                  <div className="fs-11 d-flex">
                                    <p className="fs-11 fw-600">
                                      {' '}
                                      {t('specialFees')}:
                                    </p>
                                    <p className="fs-11 mx-2">
                                      {' '}
                                      {' ' +
                                        ' (+' +
                                        (
                                          (item?.finances?.fees || 0) / 10000
                                        )?.toFixed(2) +
                                        ' $)'}{' '}
                                      {!card?.isInvoiced && '*'}
                                    </p>
                                  </div>
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                      </>
                    ))}
                  {includeGroupsTotal && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        {' '}
                        <Typography
                          fontSize="11px"
                          fontWeight={400}
                          color="#69696980"
                        >
                          <GeneralText
                            fontSize="11px"
                            size="regular"
                            text={t('subtotalOfGroup')}
                            primary={false}
                            color="#69696990"
                          />
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={3}>
                        {' '}
                        <Typography
                          fontSize="11px"
                          fontWeight={400}
                          color="#69696980"
                        >
                          <GeneralText
                            fontSize="11px"
                            size="regular"
                            text={
                              items?.[0]?.targetProfileName ||
                              items?.[0]?.targetProfileDetails?.name ||
                              ''
                            }
                            primary={false}
                            color="#69696990"
                          />
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={1}>
                        <Typography
                          fontSize="11px"
                          fontWeight={400}
                          color="#69696980"
                        >
                          <GeneralText
                            fontSize="11px"
                            size="regular"
                            text={items?.reduce(
                              (acc, item) => acc + item?.quantity,
                              0
                            )}
                            primary={false}
                            color="#69696990"
                          />
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={1}>
                        <Typography
                          fontSize="11px"
                          fontWeight={400}
                          color="#69696980"
                        >
                          <GeneralText
                            fontSize="11px"
                            size="regular"
                            text={`${items
                              ?.reduce(
                                (acc, item) =>
                                  acc + item?.finances?.subtotal / 10000,
                                0
                              )
                              ?.toFixed(2)}$`}
                            primary={false}
                            color="#69696990"
                          />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell
                      sx={{ height: '20px', border: 0 }}
                      colSpan={5}
                    ></TableCell>
                  </TableRow>
                </>
              ))}

              <TableRow style={{ marginTop: '10px' }}>
                <TableCell colSpan={6} sx={{ border: 0 }}></TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                  }}
                >
                  <GeneralText
                    fontSize="11px"
                    size="regular"
                    color="black"
                    text={t('subtotal')}
                    primary={false}
                  />
                </TableCell>
                <TableCell>
                  <GeneralText
                    fontSize="11px"
                    color="black"
                    size="regular"
                    text={`${(card?.finances?.subtotal / 10000)?.toFixed(2)}$`}
                    primary={false}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} sx={{ border: 0 }}></TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                  }}
                >
                  <GeneralText
                    fontSize="11px"
                    size="regular"
                    color="black"
                    text={card?.businessData?.taxIdName || t('tax1')}
                    primary={false}
                  />
                </TableCell>
                <TableCell>
                  {' '}
                  <GeneralText
                    fontSize="11px"
                    size="regular"
                    color="black"
                    text={`${(card?.finances?.tax1 / 10000)?.toFixed(2)}$`}
                    primary={false}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} sx={{ border: 0 }}></TableCell>
                <TableCell
                  sx={{
                    fontSize: '11px',
                  }}
                >
                  <GeneralText
                    fontSize="11px"
                    size="regular"
                    color="black"
                    text={card?.businessData?.taxIdNameSecond || t('tax2')}
                    primary={false}
                  />
                </TableCell>
                <TableCell>
                  {' '}
                  <GeneralText
                    fontSize="11px"
                    color="black"
                    size="regular"
                    text={`${(card?.finances?.tax2 / 10000)?.toFixed(2)}$`}
                    primary={false}
                  />
                </TableCell>
              </TableRow>
              {card?.finances?.fees !== 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ border: 0 }}></TableCell>
                  <TableCell>
                    <GeneralText
                      fontSize="11px"
                      size="regular"
                      color="black"
                      text={t('fees')}
                      primary={false}
                    />
                  </TableCell>
                  <TableCell>
                    <GeneralText
                      fontSize="11px"
                      color="black"
                      size="regular"
                      text={`${(card?.finances?.fees / 10000)?.toFixed(2)}$`}
                      primary={false}
                    />
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell colSpan={6} sx={{ border: 0 }}></TableCell>
                <TableCell>
                  <GeneralText
                    fontSize="11px"
                    size="medium"
                    color="black"
                    text={t('total')}
                    primary={false}
                  />
                </TableCell>
                <TableCell>
                  {' '}
                  <GeneralText
                    fontSize="11px"
                    size="medium"
                    color="black"
                    text={`${(card?.finances?.total / 10000)?.toFixed(2)}$`}
                    primary={false}
                  />
                </TableCell>
              </TableRow>
              {card?.isInvoiced && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ border: 0 }}></TableCell>
                  <TableCell sx={{ border: 0 }}>
                    <GeneralText
                      fontSize="11px"
                      size="regular"
                      color="black"
                      text={t('balance')}
                      primary={false}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0 }}>
                    {' '}
                    <GeneralText
                      fontSize="11px"
                      size="regular"
                      color="black"
                      text={`${(card?.finances?.balance / 10000)?.toFixed(2)}$`}
                      primary={false}
                    />
                  </TableCell>
                </TableRow>
              )}
              {groupedItems?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('empty')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {!card?.isInvoiced && (
            <p className="fs-10 mt-3">
              *Si applicable, les frais spéciaux et taxes supplémentaires seront
              calculées sur la facture finale.
            </p>
          )}
        </TableContainer>
      )}
    </>
  );
};

export default CardItems;
