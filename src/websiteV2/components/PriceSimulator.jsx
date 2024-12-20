import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Slider,
  Grid,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Divider,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  CheckCircleOutlineOutlined,
  LeaderboardOutlined,
  SaveAltOutlined,
  SearchOutlined,
  ShowChartOutlined,
  TollOutlined,
} from '@mui/icons-material';
import ListItemText from '@mui/material/ListItemText';
import colorGenerator from '../../utils/colorGenerator';

const PriceSimulator = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const mainColor = theme.palette.primary.main || '#1604DD';
  const { search } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [operations, setOperations] = useState(20000);
  const [searches, setSearches] = useState(1000);
  const [emails, setEmails] = useState(1000);
  const [term, setTerm] = useState('projet');
  const [storage, setStorage] = useState(10);
  const [clients, setClients] = useState(250);
  const [connectors, setConnectors] = useState(1);

  const basePricePlan1 = 79.95;
  const basePricePlan2 = 199.95;

  const handleOpen = () => {
    navigate('/contact');
  };

  const ultraLightColor = colorGenerator(mainColor, 0.2, 0.1, 1, false);

  const costPerThousandOpsPlan1 = 1.0;
  const costPerThousandOpsPlan2 = 0.92;
  const costPerThousandSearches = 1.5;
  const costPerThousandEmails = 1.0;
  const costPerGBStorage = 1.0;

  const calculateCost = (
    basePrice,
    includedOps,
    costPerThousandOps,
    searches,
    costPerThousandSearches,
    emails,
    costPerThousandEmails,
    storage,
    costPerGBStorage
  ) => {
    const extraOps = Math.max(operations - includedOps, 0);
    const searchesCost = (searches / 1000) * costPerThousandSearches;
    const emailsCost = (emails / 1000) * costPerThousandEmails;
    const storageCost = storage * costPerGBStorage;
    return (
      basePrice +
      (extraOps / 1000) * costPerThousandOps +
      searchesCost +
      emailsCost +
      storageCost
    );
  };

  const totalCostPlan1 = calculateCost(
    basePricePlan1,
    20000,
    costPerThousandOpsPlan1,
    searches,
    costPerThousandSearches,
    emails,
    costPerThousandEmails,
    storage,
    costPerGBStorage
  );

  const totalCostPlan2 = calculateCost(
    basePricePlan2,
    100000,
    costPerThousandOpsPlan2,
    searches,
    costPerThousandSearches,
    emails,
    costPerThousandEmails,
    storage,
    costPerGBStorage
  );

  const adjustedOperations = operations / (1 + 0.2 * connectors);
  const estimatedEmails = Math.round(emails / 1.3 / clients);
  const employeesEstimate = Math.round((adjustedOperations / 70000) * 6) * 152;
  const photoEstimate = storage * 250;
  const cardsOps = Math.round(operations / clients / 200);

  const getStatusText = () => {
    if (cardsOps <= 0) {
      return t('insufisantData');
    } else if (cardsOps <= 1) {
      return t('utilisationNormale');
    } else {
      return t('grandeUtilisation');
    }
  };

  return (
    <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
      <Box flex={3} py={5} mt={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <InputLabel>{t('termHowTo')}</InputLabel>

              <Select
                sx={{
                  borderRadius: '10px',
                }}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                label={t('termHowTo')}
              >
                <MenuItem key={'p'} value={'projet'}>
                  {t('projectsManagement')}
                </MenuItem>
                <MenuItem key={'c'} value={'contact'}>
                  {t('clientsManagement')}
                </MenuItem>
                <MenuItem key={'a'} value={'élément'}>
                  {t('everythingManagement')}
                </MenuItem>
                <MenuItem key={'r'} value={'élément'}>
                  {t('crmManagement')}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': {
                  borderRadius: '10px',
                },
              }}
              variant="outlined"
              label={
                term.charAt(0).toUpperCase() +
                term.slice(1) +
                ' - ' +
                'Nombre traité mensuellement'
              }
              value={clients}
              onChange={(e) => setClients(Number(e.target.value))}
              type="number"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>
                {t('Nombre de logiciels externes connectés')}
              </InputLabel>
              <Select
                sx={{
                  borderRadius: '10px',
                }}
                label={t('Nombre de logiciels externes connectés')}
                value={connectors}
                onChange={(e) => setConnectors(Number(e.target.value))}
              >
                {[...Array(11).keys()].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid mt={3} mb={2} item xs={12} md={3}>
            <Tooltip title={t('operationsTooltip')} placement="right" arrow>
              <span>
                <div className="d-flex middle-content  align-c">
                  <ShowChartOutlined fontSize="10px" />
                  <Typography
                    fontWeight={600}
                    px={1}
                    color={isDarkMode ? 'white' : 'black'}
                  >
                    {t('operations')}
                  </Typography>
                </div>
              </span>
            </Tooltip>
            <Typography
              fontWeight={500}
              fontSize={10}
              gutterBottom
              color={isDarkMode ? 'white' : 'black'}
            >
              {operations}
            </Typography>
            <Slider
              value={operations}
              onChange={(e, value) => setOperations(value)}
              min={10000}
              max={500000}
              step={5000}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid mt={3} mb={2} item xs={12} md={3}>
            <div className="d-flex middle-content align-c">
              <SearchOutlined fontSize="10px" />
              <Typography
                fontWeight={600}
                px={1}
                color={isDarkMode ? 'white' : 'black'}
              >
                {t('searches')}
              </Typography>
            </div>
            <Typography
              fontWeight={500}
              fontSize={10}
              gutterBottom
              color={isDarkMode ? 'white' : 'black'}
            >
              {searches}
            </Typography>
            <Slider
              value={searches}
              onChange={(e, value) => setSearches(value)}
              min={0}
              max={10000}
              step={100}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid mt={3} mb={2} item xs={12} md={3}>
            <Tooltip title={t('creditTooltip')} placement="right" arrow>
              <span>
                <div className="d-flex middle-content  align-c">
                  <TollOutlined fontSize="10px" />
                  <Typography
                    fontWeight={600}
                    px={1}
                    color={isDarkMode ? 'white' : 'black'}
                  >
                    {t('toolsData')}
                  </Typography>
                </div>
              </span>
            </Tooltip>
            <Typography
              fontWeight={500}
              fontSize={10}
              gutterBottom
              color={isDarkMode ? 'white' : 'black'}
            >
              {emails}
            </Typography>
            <Slider
              value={emails}
              onChange={(e, value) => setEmails(value)}
              min={0}
              max={10000}
              step={100}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid mt={3} mb={2} item xs={12} md={3}>
            <div className="d-flex middle-content align-c">
              <SaveAltOutlined fontSize="10px" />
              <Typography
                fontWeight={600}
                px={1}
                color={isDarkMode ? 'white' : 'black'}
              >
                {t('data')}
              </Typography>
            </div>
            <Typography
              fontWeight={500}
              fontSize={10}
              gutterBottom
              color={isDarkMode ? 'white' : 'black'}
            >
              {storage + ' GB'}
            </Typography>
            <Slider
              value={storage}
              onChange={(e, value) => setStorage(value)}
              min={0}
              max={100}
              step={10}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                padding: 3,
                marginTop: 3,
                borderRadius: '10px',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
              }}
            >
              <Typography variant="h6">Flash</Typography>
              <Typography fontSize={24} fontWeight={600}>
                {totalCostPlan1.toFixed(2)}$
              </Typography>
              <Typography mb={3}>Coût approximatif mensuel</Typography>
              <div className="d-flex middle-content px-3">
                <CheckCircleOutlineOutlined color="success" />{' '}
                <ListItemText
                  primary="20 000 opérations incluses"
                  primaryTypographyProps={{
                    fontSize: '11px',
                    textAlign: 'left',
                    paddingLeft: '8px',
                  }}
                />
              </div>
              <Divider component="div" />
              <div className="d-flex middle-content px-3">
                <CheckCircleOutlineOutlined color="success" />{' '}
                <ListItemText
                  primary="Structures et modules illimités"
                  primaryTypographyProps={{
                    fontSize: '11px',
                    textAlign: 'left',
                    paddingLeft: '8px',
                  }}
                />
              </div>
              <Divider component="div" />
              <div className="d-flex middle-content px-3">
                <CheckCircleOutlineOutlined color="success" />{' '}
                <ListItemText
                  primary="Nombre d'utilisateurs illimité"
                  primaryTypographyProps={{
                    fontSize: '11px',
                    textAlign: 'left',
                    paddingLeft: '8px',
                  }}
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                padding: 3,
                marginTop: 3,
                borderRadius: '10px',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
              }}
            >
              <Typography variant="h6">Rise</Typography>
              <Typography fontSize={24} fontWeight={600}>
                {totalCostPlan2.toFixed(2)}$
              </Typography>
              <Typography mb={3}>Coût approximatif mensuel</Typography>
              <div className="d-flex middle-content px-3">
                <CheckCircleOutlineOutlined color="success" />{' '}
                <ListItemText
                  primary="Tous les éléments du plan Flash"
                  primaryTypographyProps={{
                    fontSize: '11px',
                    textAlign: 'left',
                    paddingLeft: '8px',
                  }}
                />
              </div>
              <Divider component="div" />
              <div className="d-flex middle-content px-3">
                <CheckCircleOutlineOutlined color="success" />{' '}
                <ListItemText
                  primary="100 000 opérations incluses"
                  primaryTypographyProps={{
                    fontSize: '11px',
                    textAlign: 'left',
                    paddingLeft: '8px',
                  }}
                />
              </div>
              <Divider component="div" />
              <div className="d-flex middle-content px-3">
                <CheckCircleOutlineOutlined color="success" />{' '}
                <ListItemText
                  primary="Espaces de travail Nodies"
                  primaryTypographyProps={{
                    fontSize: '11px',
                    textAlign: 'left',
                    paddingLeft: '8px',
                  }}
                />
              </div>
              <Divider component="div" />
              <div className="d-flex middle-content px-3">
                <CheckCircleOutlineOutlined color="success" />{' '}
                <ListItemText
                  primary="Accès au Node AI"
                  primaryTypographyProps={{
                    fontSize: '11px',
                    textAlign: 'left',
                    paddingLeft: '8px',
                  }}
                />
              </div>
              <Divider component="div" />
              <div className="d-flex middle-content px-3">
                <CheckCircleOutlineOutlined color="success" />{' '}
                <ListItemText
                  primary="Croisement de données"
                  primaryTypographyProps={{
                    fontSize: '11px',
                    textAlign: 'left',
                    paddingLeft: '8px',
                  }}
                />
              </div>

              <Divider component="div" />
              <div className="d-flex middle-content px-3">
                <CheckCircleOutlineOutlined color="success" />{' '}
                <ListItemText
                  primary="Outils et rapports"
                  primaryTypographyProps={{
                    fontSize: '11px',
                    textAlign: 'left',
                    paddingLeft: '8px',
                  }}
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                padding: 3,
                marginTop: 3,
                borderRadius: '10px',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
              }}
            >
              <Typography variant="h6">Entreprise</Typography>
              <Typography fontSize={22} fontWeight={600}>
                {t('contactUs')}
              </Typography>
              <Typography>{t('limitlessFlexibility')}</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpen}
                sx={{ marginTop: 3, borderRadius: '20px' }}
              >
                {t('contactUs')}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box flex={1} py={1} mt={0} ml={isMobile ? 0 : 5}>
        <Paper
          elevation={0}
          sx={{
            padding: 3,
            backgroundColor: ultraLightColor,
            marginTop: '70px',
            borderRadius: '10px',
          }}
        >
          {' '}
          <LeaderboardOutlined color="primary" fontSize="large" />
          <Typography variant="h6" fontWeight={600} gutterBottom mb={2}>
            {t('previsions')}
          </Typography>
          <Divider component="div" />
          <Typography fontSize={14} fontWeight={600} mt={2}>
            {t('hoursUsage')}
          </Typography>
          <Typography
            color={
              employeesEstimate > 0.99
                ? isDarkMode
                  ? 'white'
                  : 'black'
                : 'black'
            }
            fontWeight={employeesEstimate > 0.99 ? 400 : 500}
          >
            {employeesEstimate > 0.99 && employeesEstimate}{' '}
            {employeesEstimate > 0.99 &&
              (employeesEstimate === 1 ? 'heure' : 'heures')}{' '}
            {employeesEstimate > 0.99 && t('usageData')}
            {employeesEstimate < 0.99 && t('insufisantData')}{' '}
          </Typography>
          <Typography
            fontSize={10}
            fontWeight={300}
            color={cardsOps > 0.99 ? (isDarkMode ? 'white' : 'black') : 'black'}
          >
            {'Basé sur une moyenne des sessions sur le réseau'}
          </Typography>
          <Tooltip title={t('elementUsageTooltip')} placement="right" arrow>
            <span>
              <Typography mt={3} fontSize={14} fontWeight={600}>
                {t('elementUsage') + ' ' + term}
              </Typography>
              <Typography
                color={
                  cardsOps > 0.99 ? (isDarkMode ? 'white' : 'black') : 'black'
                }
                fontWeight={cardsOps > 0.99 ? 400 : 500}
              >
                {getStatusText(cardsOps)}{' '}
              </Typography>
            </span>
          </Tooltip>
          <Tooltip title={t('cardsOpsTooltip')} placement="right" arrow>
            <span>
              <Typography fontSize={14} fontWeight={600} mt={3}>
                {t('emails')}
              </Typography>
              <Typography
                color={
                  estimatedEmails > 0.99
                    ? isDarkMode
                      ? 'white'
                      : 'black'
                    : 'black'
                }
                fontWeight={estimatedEmails > 0.99 ? 400 : 500}
              >
                {estimatedEmails > 0.99 && 'Approx.'}{' '}
                {estimatedEmails > 0.99 && estimatedEmails.toLocaleString()}{' '}
                {estimatedEmails < 0.99 && t('insufisantData')}{' '}
                {estimatedEmails > 0.99 &&
                  'envois' + ' ' + t('perVisit') + ' ' + term}
              </Typography>
            </span>
          </Tooltip>
          <Tooltip title={t('nodeAITooltip')} placement="right" arrow>
            <span>
              <Typography fontSize={14} fontWeight={600} mt={3}>
                {t('nodeAI') + ' - AI'}
              </Typography>
              <Typography
                color={
                  estimatedEmails > 0.99
                    ? isDarkMode
                      ? 'white'
                      : 'black'
                    : 'black'
                }
                fontWeight={estimatedEmails > 0.99 ? 400 : 500}
              >
                {estimatedEmails * 120 > 0.99 &&
                  (estimatedEmails * 120).toLocaleString()}{' '}
                {estimatedEmails * 120 > 0.99 && 'requêtes mensuelles'}
              </Typography>
            </span>
          </Tooltip>
          <Typography fontSize={14} fontWeight={600} mt={3}>
            {t('storageData')}
          </Typography>
          <Typography>
            {t('about')} {photoEstimate} pièces jointes/photos
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default PriceSimulator;
