import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '../stories/general-components/Button';
import { useSelector } from 'react-redux';
import ModalSmallHoriz from './Base/ModalSmallHoriz';
import { DialogContent } from '@material-ui/core';
import { motion } from 'framer-motion';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import { Box } from '@mui/material';

const GradientIconWrapper = ({ svgPath, size = 14, ...props }) => {
  const svgIcon = `<svg width="100px" height="100px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">

      <stop offset="30%" style="stop-color:rgb(227, 216, 14);"/>
      <stop offset="55%" style="stop-color:rgb(128,255,255,0.4);"/>
      <stop offset="80%" style="stop-color:rgb(14,21,227);"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad1)" d="M50,10 L10,50 L20,90 L50,70 L80,90 L90,50 Z" />
  <path fill="none" stroke="rgb(255,255,255)" stroke-width="4" d="M25,25 L50,50 L75,25 M50,50 L50,75" />
  
</svg>`;
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgIcon)}`;

  return (
    <Box
      {...props}
      sx={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: `url("${dataUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
};

const ModalGemini = (props) => {
  const { t } = useTranslation();
  const { item } = props;
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [proposal, setProposal] = useState('');

  const onConfirm = () => {
    props.handleConfirm(proposal);
    props.modalCloseHandler();
  };

  const { rephrase, addData, name, profileDetails } = item;

  const businessPreference = useSelector((state) => state.core.businessData);

  const fetchData = async () => {
    setSuggestion('');
    setProposal('');
    setLoading(true);
    try {
      const textSuggestion = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `public/ai`,
        noAuth: true,
        body: {
          prompt: !rephrase
            ? `Après un service rendu chez ${businessPreference?.name}. J'aurais besoin d'aider pour améliorer le descriptif de mon item sur la facture afin de mieux expliquer au client. Le service rendu est : ${name} et est en liaison directe avec ${profileDetails}. J'aimerais une courte réponse d'une phrase ou deux sans markdown, sans inclure le nom de l'element lié et sans inclure le nom de l'entreprise (car ces détails sont déja présents sur la facture du client). Suggère-moi un descriptif explicatif adapté:`
            : `Suite à un service rendu chez ${businessPreference?.name}. J'aurais besoin d'aide pour améliorer le descriptif de mon item sur la facture afin de mieux expliquer au client. Le service rendu est : ${name} et est en liaison directe avec ${profileDetails}. J'aimerais une courte réponse d'une phrase ou deux sans markdown, sans inclure le nom de l'element lié et sans inclure le nom de l'entreprise (car ces détails sont déja présents sur la facture du client). Un collègue à aussi ajouté cette note: ${rephrase}. Suggère-moi une nouvelle phrase:`,
          contact: 'Client',
          business: businessPreference?.name,
          details: addData,
          generationConfig: {
            temperature: 0.3,
            topp: 0.4,
            topk: 20,
            tokens: parseInt(2056),
          },
        },
      });

      setSuggestion(textSuggestion?.generatedContent);

      // Process paymentsData as needed for your application
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    if (rephrase || addData || name) {
      fetchData();
    }
  }, [rephrase]);

  useEffect(() => {
    if (suggestion) {
      setProposal(suggestion);
      setLoading(false);
    }
  }, [suggestion]);

  return (
    <div>
      <ModalSmallHoriz {...props}>
        <div
          style={{ minWidth: '600px' }}
          className=" align-c align-items-center"
        >
          <DialogContent>
            <div className="align-c" style={{ maxWidth: '590px' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className={loading && 'spin-ai'}
              >
                <GradientIconWrapper size={38} />
              </motion.div>
            </div>
            <div
              style={{ maxWidth: '500px' }}
              className="d-flex align-c mb-4 mt-5"
            >
              {proposal}
            </div>
          </DialogContent>
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm}
            disabled={loading}
            label={t('replace')}
          />
        </div>
      </ModalSmallHoriz>
    </div>
  );
};

export default ModalGemini;
