import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useParams } from 'react-router-dom';

//components
import { CircularProgress } from '@mui/material';
import Button from '../../stories/general-components/Button';
import TextField from '../../stories/general-components/TextField';
import Slider from '../../stories/general-components/Slider';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import GeneralText from '../../stories/general-components/GeneralText';
import { AutoAwesomeMosaic } from '@mui/icons-material';
import { toast } from 'react-toastify';
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Blocks from '../../stories/layout-components/Block';

const EmailsCreator = () => {
  const { t } = useTranslation();
  const { businessId } = useParams();
  const navigate = useNavigate();

  const [businessData, setBusinessData] = useState({});
  const [businessDetails, setBusinessDetails] = useState('');
  const [contact, setContact] = useState('');
  const [caract, setCaract] = useState('');
  const [topP, setTopP] = useState(1);
  const [topK, setTopK] = useState(2);
  const [temperature, setTemperature] = useState(2);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [proposal, setProposal] = useState('');

  const fetchData = async () => {
    setEmail('');
    setProposal('');
    setLoading(true);
    try {
      // Create a query against the collection group 'payments'
      const emailSuggestion = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `public/ai`,
        noAuth: true,
        body: {
          prompt:
            'En tant que vendeur pour une compagnie manufacturière de cargo électriques carbo-neutres basée au Québec et agissant dans le secteur récréotouristique pour les campings, écrivez-moi un courriel de premier contact de vente à fort impact avec une tonalité. Initiative: Une solution de vélos triporteurs de cargo pouvant les aider à transporter des gens et du matériel. Objectif : dans lequel nous leur demandons une demande de rendez-vous pour leur présenter envoyant leurs disponibilités dans les prochains jours. Il faut prendre en contexte TOUS les éléments afin de rédiger un courriel personnalisé et adapté à la réalité du camping',
          contact: contact,
          business: businessDetails,
          details: caract,
          generationConfig: {
            temperature: ((temperature * 2.1) / 10)?.toFixed(1),
            topp: ((topP * 2.1) / 10)?.toFixed(1),
            topk: parseInt(topK * 1.7 * 5),
            tokens: parseInt(1024),
          },
        },
      });

      setEmail(emailSuggestion?.generatedContent);

      // Process paymentsData as needed for your application
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };
  useEffect(() => {
    if (email) {
      setProposal(email);
      setLoading(false);
    }
  }, [email]);

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    toast.success(t('copied'));
  };

  return (
    <MainLayoutV2 pageTitle={t('/redactor')}>
      <Blocks height={1} heightPercentage={82}>
        <div className="row mt-4">
          <div
            style={{ paddingRight: '80px', paddingLeft: '15px' }}
            className="col-md-6 px-5 col-12 mt-1  align-left"
          >
            {' '}
            <div>
              <div>
                <Slider
                  label={t('Variability Control')}
                  name="temperature"
                  field={{
                    value: 'temperature',
                  }}
                  selections={[
                    { label: t('Precise'), color: '#4B0082', value: 2 }, // Indigo: Signifies precision and depth
                    {
                      label: t('Moderately Variable'),
                      color: '#FF4500',
                      value: 4,
                    }, // OrangeRed: Indicates a step towards unpredictability
                    {
                      label: t('Balanced Variability'),
                      color: '#FF8C00',
                      value: 6,
                    }, // DarkOrange: A balance between variability and control
                    {
                      label: t('Highly Variable'),
                      color: '#FFD700',
                      value: 8,
                    }, // Gold: High variability with a touch of control
                    {
                      label: t('Max. Randomn.'),
                      color: '#A9A9A9',
                      value: 10,
                    }, // DarkGray: Maximum variability, neutral stance
                  ]}
                  value={temperature}
                  onChange={(type, e) => setTemperature(e)}
                />

                <Slider
                  label={t('Probability Threshold')}
                  name="topP"
                  field={{
                    value: 'topp',
                  }}
                  selections={[
                    {
                      label: t('High Preci.'),
                      color: '#556B2F',
                      value: 2,
                    }, // DarkOliveGreen: High focus, precision
                    {
                      label: t('Moderate Diversity'),
                      color: '#B22222',
                      value: 4,
                    }, // Firebrick: Moderate expansion into diversity
                    {
                      label: t('Balanced Choice'),
                      color: '#FFA07A',
                      value: 6,
                    }, // LightSalmon: A balanced approach in choices
                    {
                      label: t('Wide Selection'),
                      color: '#F0E68C',
                      value: 8,
                    }, // Khaki: Wider selection, openness
                    { label: t('Full Range'), color: '#C0C0C0', value: 10 }, // Silver: Full inclusivity of options
                  ]}
                  value={topP}
                  onChange={(type, e) => setTopP(e)}
                />

                <Slider
                  label={t('Selection Limit')}
                  name="topK"
                  field={{
                    value: 'topk',
                  }}
                  selections={[
                    {
                      label: t('Ultra Focus.'),
                      color: '#483D8B',
                    }, // DarkSlateBlue: Extreme focus, limited selection
                    { label: t('High Focus'), color: '#DC143C', value: 200 }, // Crimson: High focus with a bit more leeway
                    {
                      label: t('Medium Focus'),
                      color: '#FFA500',
                    }, // Orange: Medium range of focus, balanced
                    { label: t('Broad Focus'), color: '#FFD700', value: 600 }, // Gold: Broader consideration, still focused
                    { label: t('Very Broad'), color: '#DAA520', value: 800 }, // Goldenrod: Very broad range, less restrictive
                    {
                      label: t('All-Inclusive'),
                      color: '#D3D3D3',
                    }, // LightGray: All options considered, maximum range
                  ]}
                  value={topK}
                  onChange={(type, e) => setTopK(e)}
                />

                <TextField
                  type={'textarea'}
                  label={t('businessDetails')}
                  name="description"
                  multiline
                  isRequired
                  fullWidth
                  value={businessDetails}
                  onChange={(e) => setBusinessDetails(e.target.value)}
                />
                <TextField
                  type={'textarea'}
                  label={t('contact')}
                  name="description"
                  multiline
                  isRequired
                  fullWidth
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
                <TextField
                  type={'textarea'}
                  label={t('caract')}
                  name="description"
                  multiline
                  isRequired
                  fullWidth
                  value={caract}
                  onChange={(e) => setCaract(e.target.value)}
                />
                {/* <TextField
                  type={'number'}
                  label={t('tokens')}
                  name="tokens"
                  multiline
                  isRequired
                  fullWidth
                  value={tokens}
                  onChange={(e) => setTokens(e.target.value)}
                /> */}
                <Button
                  label={t('generate')}
                  onClick={fetchData}
                  buttonSx={{ mt: 4 }}
                  fullWidth
                />
              </div>
              <div>
                <div
                  className="align-left"
                  style={{
                    marginTop: '30px',
                    display: 'flex',
                  }}
                >
                  {businessData?.fb && (
                    <a
                      href={businessData?.fb}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/assets/website/social/icon-fb-logonode.png"
                        alt="Facebook"
                        style={{
                          width: '28px',
                          height: '28px',
                          marginRight: '10px',
                        }}
                      />
                    </a>
                  )}
                  {businessData?.tk && (
                    <a
                      href={businessData?.tk}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/assets/website/social/icon-tiktok-logonode.png"
                        alt="Twitter"
                        style={{
                          width: '28px',
                          height: '28px',
                          marginRight: '10px',
                        }}
                      />
                    </a>
                  )}
                  {businessData?.ig && (
                    <a
                      href={businessData?.ig}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/assets/website/social/icon-instagram-logonode.png"
                        alt="Instagram"
                        style={{
                          width: '28px',
                          height: '28px',
                          marginRight: '10px',
                        }}
                      />
                    </a>
                  )}
                  {businessData?.lk && (
                    <a
                      href={businessData?.lk}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/assets/website/social/icon-linkedin-logonode.png"
                        alt="LinkedIn"
                        style={{
                          width: '28px',
                          height: '28px',
                          marginRight: '10px',
                        }}
                      />
                    </a>
                  )}
                  {businessData?.yt && (
                    <a
                      href={businessData?.yt}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/assets/website/social/icon-youtube-logonode.png"
                        alt="Youtube"
                        style={{
                          width: '28px',
                          height: '28px',
                          marginRight: '10px',
                        }}
                      />
                    </a>
                  )}
                  {businessData?.website && (
                    <a
                      href={'https://' + businessData?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/assets/website/social/icon-website-logonode.png"
                        alt="Website"
                        style={{
                          width: '28px',
                          height: '28px',
                          marginRight: '10px',
                        }}
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 mb-1 align-left">
            <div
              style={{
                padding: '16px',
                backgroundColor: '#f9f9f9',
                borderRadius: '10px',

                position: 'relative',
                height: '80vh',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                overflow: 'auto',
                wordBreak: 'break-all',
              }}
            >
              <AutoAwesomeMosaic />
              <GeneralText
                text={'Proposition'}
                fontSize="14px"
                size="bold"
                primary={true}
                classNameComponent="mb-2"
              />
              {loading && (
                <CircularProgress
                  size={30}
                  style={{ marginLeft: '50%', marginTop: '30%' }}
                />
              )}
              <div
                className="markdown-content hover"
                onClick={handleCopy}
                style={{
                  color: '#000',
                  fontSize: `13px`,
                }}
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  children={proposal}
                />
              </div>
            </div>
          </div>
        </div>
      </Blocks>
    </MainLayoutV2>
  );
};

export default EmailsCreator;
