import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CompareGrid = ({ contentName }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const softwareFunctionalities = {
    node: [
      t('selfCheckIn'),
      t('sitesOverview'),
      t('mobileAppBusiness'),
      t('inventoryManagement'),
      t('maintenanceManagement'),
      t('tasksManagement'),
      t('teamCollaboration'),
      t('bookingRegistration'),
      t('interactiveMap'),
      t('portalFree'),
      t('allInOneMobileApp'),
      t('emailsPushNotif'),
      t('infosCustomization'),
      t('dynamicPrices'),
      t('onSiteAddOns'),
      t('creditCardFessDiscount'),
      t('discountsAutomated'),
      t('reportsOverview'),
      t('optionsVariants'),
      t('realTimeFunctionality'),
      t('accessMulti'),
      t('multiLanguages'),
    ],

    others: [
      t('interactiveMap'),
      t('bookingRegistration'),
      t('sitesOverview'),
      t('multiLanguages'),
      t('dynamicPrices'),
      t('onSiteAddOns'),
      t('reportsOverview'),
      t('accessMulti'),
    ],
  };

  const functionalities = {
    Operation: [
      t('selfCheckIn'),
      t('sitesOverview'),
      t('maintenanceManagement'),
      t('inventoryManagement'),
      t('tasksManagement'),
      t('teamCollaboration'),
      t('bookingRegistration'),
      t('interactiveMap'),
    ],
    Clients: [
      t('portalFree'),
      t('allInOneMobileApp'),
      t('emailsPushNotif'),
      t('infosCustomization'),
    ],
    Finances: [
      t('dynamicPrices'),
      t('onSiteAddOns'),
      t('creditCardFessDiscount'),
      t('discountsAutomated'),
      t('reportsOverview'),
      t('optionsVariants'),
    ],
    Admin: [t('realTimeFunctionality'), t('accessMulti'), t('multiLanguages')],
  };

  const softwares = ['node', 'others'];

  return (
    <Grid container spacing={2}>
      {Object.entries(functionalities).map(([section, funcs], sectionIndex) => (
        <Grid item xs={12} key={sectionIndex}>
          <TableContainer elevation={0} component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{section}</TableCell>
                  {softwares?.map((software, index) => (
                    <TableCell key={index} align="center">
                      <img
                        src={`/assets/website/softwares/${software}.png`}
                        alt={software}
                        height="50px"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {funcs.map((functionality, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {functionality}
                    </TableCell>
                    {softwares.map((software, softwareIndex) => (
                      <TableCell key={softwareIndex} align="left">
                        {
                          softwareFunctionalities[software]?.includes(
                            functionality
                          ) ? (
                            <div className="mx-3">
                              <CheckCircleIcon color="success" />
                            </div>
                          ) : // Uncomment below line to show 'not available' icon
                          // <CancelIcon color="disabled" />
                          null // Or leave the cell empty
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      ))}
    </Grid>
  );
};

export default CompareGrid;
