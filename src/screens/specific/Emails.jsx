import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { htmlToText } from 'html-to-text';
import { useDispatch } from 'react-redux';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import DOMPurify from 'dompurify';
import GeneralText from '../../stories/general-components/GeneralText';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';

const Emails = () => {
  const { t, i18n } = useTranslation();
  const [emails, setEmails] = useState([]);
  const dispatch = useDispatch();
  const [selectedThread, setSelectedThread] = useState(null);

  const threads = emails.reduce((acc, email) => {
    if (!acc[email.thread_id]) {
      acc[email.thread_id] = [];
    }
    acc[email.thread_id].push(email);
    return acc;
  }, {});

  const grantId = '';

  const startAuth = async () => {
    try {
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `connectors-getEmails?grantId=${grantId}`,
      });
      setEmails(response.data);
    } catch (error) {
      console.error('Error getting business data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  useEffect(() => {
    startAuth();
  }, []);

  const Email = ({ email }) => {
    let bodyText = htmlToText(email.body);
    bodyText = bodyText.replace(/\[https?:\/\/[^\s\]]+\]/g, '');
    return (
      <div style={{ witdh: '100%' }}>
        <ListItem
          button
          divider
          onClick={() => setSelectedThread(email?.thread_id)}
        >
          <div style={{ overflow: 'auto' }}>
            <h2>{email.subject}</h2>
            <h3> {email?.from[0]?.name}</h3>
            <div
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {bodyText}
            </div>
          </div>
        </ListItem>
      </div>
    );
  };

  return (
    <MainLayoutV2 pageTitle={t('master')} elementId="node">
      <div className="d-flex">
        <div className="col-4" style={{ overflow: 'auto' }}>
          <Block height={1} heightPercentage={82}>
            {' '}
            <div>
              <List>
                {Object.keys(threads)?.flatMap((threadId, index) => (
                  <Email key={threadId} email={threads[threadId][0]} />
                ))}
              </List>
            </div>
          </Block>
        </div>
        <div className="col-8" style={{ paddingLeft: '25px' }}>
          <Block height={1} heightPercentage={82}>
            <div>
              {selectedThread &&
                threads[selectedThread].map((email, index) => {
                  const sanitizedBody = DOMPurify.sanitize(email.body);
                  return (
                    <div key={email.id}>
                      <Accordion key={index}>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls={`panel${index}-content`}
                          id={`panel${index}-header`}
                        >
                          <Typography>Thread {index + 1}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div>
                            <GeneralText
                              text={email.subject}
                              subtext={email.from}
                            />
                            <div>{sanitizedBody}</div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  );
                })}
            </div>
          </Block>
        </div>
      </div>
    </MainLayoutV2>
  );
};

export default Emails;
