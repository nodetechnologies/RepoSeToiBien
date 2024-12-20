import moment from 'moment';
import React from 'react';
import ErrorBoundary from '../../@generalComponents/ErrorBoundary';
import { List, ListItem, ListItemText, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ListItemAvatar } from '@mui/material';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';

const CardPayments = ({ payments }) => {
  const { t } = useTranslation();

  //resolver for payment type
  const paymentResolver = {
    Payment: {
      typeNumber: (payment) => {
        switch (payment.transactionType) {
          case 12:
            return `${t('cashPayment')}`;
          case 10:
            return `${t('creditCardPayment')}`;
          case 22:
            return `${t('cashRefund')}`;
          case 20:
            return `${t('creditCardRefund')}`;
          case 4:
            return `${t('nodeSystemRefund')}`;
          case 5:
            return `${t('nodeSystemRefundCredit')}`;
          case 6:
            return `${t('fundsRefund')}`;
          case 7:
            return `${t('fundsPayment')}`;
          case 13:
            return `${t('otherPayment')}`;
          case 23:
            return `${t('otherRefund')}`;
          case 97:
            return `${t('installmentPayment')}`;
          case 99:
            return `${t('otherRefund')}`;
          case 98:
            return `${t('installmentRefund')}`;
          case 11:
            return `${t('terminalPayment')}`;
          case 21:
            return `${t('terminalRefund')}`;
          default:
            return null;
        }
      },
    },
  };

  const getCardLogo = (cardType) => {
    switch (cardType) {
      case 'visa':
        return '/assets/v2/vectors/cards/visa.svg';
      case 'mastercard':
        return '/assets/v2/vectors/cards/mc.svg';
      case 'amex':
        return '/assets/v2/vectors/cards/amex.svg';
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="mt-1">
        <List dense>
          {payments &&
            [...payments].map((payment, index) => {
              let cardType = 'default';

              const transactionDate = new Date(
                (payment?.timeStamp?.seconds || payment?.timeStamp?._seconds) *
                  1000
              );
              return (
                <div key={index}>
                  <ListItem
                    divider
                    secondaryAction={
                      <>
                        {/* {!isExpense && payment?.amount > 0 && (
                              <ButtonCircle
                                onClick={
                                  payment.isInstallment
                                    ? () => openConfirmCancel(payment)
                                    : () => openRefundModal(payment)
                                }
                                icon={
                                  payment.isInstallment
                                    ? 'DoNotDisturbAltOutlined'
                                    : 'KeyboardReturn'
                                }
                                restrict={['VIEWER', 'STANDARD', 'MANAGER']}
                                tooltip={t('refund')}
                                disabled={payment?.typeNumber === 7}
                                color="black"
                                primary={false}
                              />
                            )} */}
                      </>
                    }
                  >
                    <ListItemText
                      sx={{ minWidth: '90px' }}
                      primary={moment(transactionDate).format('DD MMM YYYY')}
                      secondary={moment(transactionDate).format('HH:mm')}
                    />
                    <ListItemText
                      sx={{ minWidth: '76px' }}
                      primaryTypographyProps={{
                        fontSize: 12,
                        fontWeight: 'medium',
                        lineHeight: '20px',
                      }}
                      secondaryTypographyProps={{
                        fontSize: 10,
                        fontWeight: 'medium',
                        lineHeight: '12px',
                      }}
                      primary={`${(
                        Number(payment?.finances?.amount) / 10000
                      ).toFixed(2)}$`}
                    />
                    <ListItemAvatar
                      sx={{
                        marginRight: '8px',
                        textAlign: 'center',
                      }}
                    >
                      {getCardLogo(cardType) == null ? (
                        <RequestQuoteOutlinedIcon />
                      ) : (
                        <Avatar
                          variant="square"
                          size="small"
                          alt="img"
                          src={getCardLogo(cardType)}
                          sx={{
                            height: '100%',
                            maxHeight: 25,
                          }}
                        />
                      )}
                    </ListItemAvatar>

                    {payment?.typeNumber === 10 ? (
                      <ListItemText
                        primary={`${t('paymentsEach')}${' '}
              ${t(`${payment?.installment?.billingCycle}`)},${' '}
              ${t('fromPayment')}${' '}
              ${moment(payment?.installment?.startDate)
                .locale('fr')
                .format('DD-MMM-YYYY')}${' '}
              ${t('forPayment')}${' '}
              ${payment?.installment?.totalInstallments}${' '}
              ${t('paymentsInst')}${' '}`}
                        primaryTypographyProps={{
                          fontSize: 12,
                        }}
                      />
                    ) : (
                      <ListItemText
                        primary={
                          paymentResolver.Payment.typeNumber(payment) || ''
                        }
                        secondary={payment?.saleCC?.txnId || ''}
                        primaryTypographyProps={{
                          fontSize: 12,
                        }}
                        secondaryTypographyProps={{
                          fontSize: 10,
                        }}
                      />
                    )}
                  </ListItem>
                </div>
              );
            })}
        </List>
      </div>
    </ErrorBoundary>
  );
};
export default CardPayments;
