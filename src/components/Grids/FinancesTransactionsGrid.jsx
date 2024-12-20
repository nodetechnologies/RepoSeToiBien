import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import moment from 'moment/moment';
import { financesTransactionsColumns } from './AllGridColumns';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import loadingAnimation from '../../lotties/pulse.json';

const FinancesTransactionsGrid = ({ list, activeModule }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [payments, setPayments] = useState();
  const { structureId } = useParams();

  const [rows, setRows] = useState();
  const [loading] = useState(false);

  // Set options for Lottie animation
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    setPayments(list);
  }, [list, activeModule]);

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const nameStatus0 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 0)?.['label_' + currentLang];

  const nameStatus1 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 1)?.['label_' + currentLang];

  const nameStatus2 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 2)?.['label_' + currentLang];

  const paymentResolver = {
    Payment: {
      transactionType: (payment) => {
        switch (payment) {
          case 0:
            return nameStatus0;
          case 1:
            return nameStatus1;
          case 2:
            return nameStatus2;
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
          case 29:
            return `${t('fundsRefund')}`;
          case 19:
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

  //main driver that puts each data field into relevant columns
  useEffect(() => {
    if (payments?.length) {
      let tempData = payments?.map((payment) => {
        // Ensure payment.transactionType is the expected code to be resolved
        const transactionType = paymentResolver.Payment.transactionType(
          payment.type
        );

        return {
          id: payment?.id,
          key: payment?.txnId,
          cardId:
            payment?.dependencyDetails?.id ||
            payment?.id ||
            payment?.cardId ||
            '',
          structureId: payment?.dependencyDetails?.structureIdentifiant,
          balance: Number(payment?.finances?.balance / 10000 || 0),
          date: `${moment
            .unix(
              payment?.transactionDate?.seconds ||
                payment?.transactionDate?._seconds ||
                payment?.billingDate?._seconds ||
                payment?.billingDate?.seconds ||
                payment?.invoiceDate?._seconds ||
                payment?.invoiceDate?.seconds ||
                payment?.timeStamp?._seconds ||
                payment?.timeStamp?.seconds
            )
            .format('DD-MM-YYYY')}`,
          type: transactionType,
          typeLetter: payment?.name || '',
          amount:
            Number(payment?.finances?.subtotal / 10000 || 0) ||
            Number(payment?.subtotal / 10000 || 0) ||
            Number(payment?.finances?.amount / 10000 || 0),
          cardNumber: payment?.accountId,
          txnId: payment?.saleCC?.txnId || '',
        };
      });

      setRows(tempData);
    }
  }, [payments, t]);

  const handleCellClick = (event) => {
    if (event.row?.cardId)
      window.open(
        `/app/element/cardsinvoiced/${event.row.structureId}/${event.row?.cardId}`,
        '_blank'
      );
  };

  return (
    <>
      {loading ? (
        <div
          className="row"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '65vh',
          }}
        >
          <Lottie options={lottieOptions} height={160} width={160} />
        </div>
      ) : (
        <div className="row hei-page">
          {/* <div className="col-3 hei-9 mt-1">
            <div className="mb-3">
              <Typography fontWeight={600} fontSize={20}>
                {t('transactionsReport')}
              </Typography>
              <Typography fontWeight={400} fontSize={10}>
                {t('transactionsReportDesc')}{' '}
                {moment(startDate).format('DD MMM YYYY')} {t('to')}{' '}
                {moment(endDate).format('DD MMM YYYY')}
              </Typography>
            </div>
            <TableContainer elevation={0} component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight={600} fontSize={11}>
                        {t('paymentType')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600} fontSize={11}>
                        {t('amount')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalsArray &&
                    totalsArray.map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{paymentResolver(key) || key}</TableCell>
                        <TableCell>{formatNumberCanadian(value)}$</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight={600} fontSize={11}>
                        {t('total')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600} fontSize={11}>
                        {formatNumberCanadian(finalTotal)}$
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div> */}
          <div className="col-12  mt-2">
            <div style={{ height: '78vh', width: '100%' }}>
              <DataGridPro
                rows={rows ? rows : []}
                columns={financesTransactionsColumns}
                pagination
                rowHeight={35}
                disableRowSelectionOnClick
                onCellClick={handleCellClick}
                sx={{ border: 0 }}
                // localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FinancesTransactionsGrid;
