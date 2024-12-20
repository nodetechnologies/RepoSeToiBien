import React from 'react';

const EmailVisual = ({
  business_entity,
  business_name,
  user_name,
  user_title,
  selectLang,
  user_phone,
  website,
  body,
}) => {
  return (
    <div>
      <table
        className="ms-body"
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          marginTop: '0',
          marginBottom: '0',
          marginRight: '0',
          marginLeft: '0',
          paddingTop: '0',
          paddingBottom: '0',
          paddingRight: '0',
          paddingLeft: '0',
        }}
      >
        <tr>
          <td
            align="center"
            style={{
              wordBreak: 'break-word',
              fontFamily: "'Inter', Helvetica, Arial, sans-serif",
              fontSize: '14px',
              lineHeight: '24px',
            }}
          >
            <table
              className="ms-container"
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              style={{
                borderCollapse: 'collapse',
                width: '100%',
                marginTop: '0',
                marginBottom: '0',
                marginRight: '0',
                marginLeft: '0',
                paddingTop: '0',
                paddingBottom: '0',
                paddingRight: '0',
                paddingLeft: '0',
              }}
            >
              <tr>
                <td
                  align="center"
                  style={{
                    wordBreak: 'break-word',
                    fontFamily: "'Inter', Helvetica, Arial, sans-serif",
                    fontSize: '14px',
                    lineHeight: '24px',
                  }}
                >
                  <table
                    className="ms-content"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                    style={{
                      borderCollapse: 'collapse',
                      width: '95%',
                      marginTop: '0',
                      marginBottom: '0',
                      marginRight: '0',
                      marginLeft: '0',
                      paddingTop: '0',
                      paddingBottom: '0',
                      paddingRight: '0',
                      paddingLeft: '0',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '6px',
                    }}
                  >
                    <tr>
                      <td
                        className="ms-content-body"
                        style={{
                          wordBreak: 'break-word',
                          fontFamily: "'Inter', Helvetica, Arial, sans-serif",
                          fontSize: '14px',
                          lineHeight: '24px',
                          paddingTop: '40px',
                          paddingBottom: '40px',
                          paddingRight: '20px',
                          paddingLeft: '20px',
                        }}
                      >
                        <p
                          style={{
                            color: '#4a5566',
                            marginBottom: '20px',
                            marginRight: '0',
                            marginLeft: '0',
                            fontSize: '12px',
                            lineHeight: '28px',
                          }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: body }} />
                        </p>
                        <table
                          width="100%"
                          style={{ borderCollapse: 'collapse' }}
                        >
                          <tr>
                            <td
                              height="5"
                              style={{
                                fontSize: '0px',
                                lineHeight: '0px',
                                borderTopWidth: '1px',
                                borderTopStyle: 'solid',
                                borderTopColor: '#e2e8f0',
                                wordBreak: 'break-word',
                                fontFamily:
                                  "'Inter', Helvetica, Arial, sans-serif",
                              }}
                            >
                              &nbsp;
                            </td>
                          </tr>
                        </table>
                        <img
                          style={{ borderRadius: '100px' }}
                          height="45px"
                          src={`https://storage.googleapis.com/node-business-logos/${business_entity}.png`}
                          alt="Logo"
                        />
                        <p
                          style={{
                            color: '#4a5566',
                            marginTop: '20px',
                            marginBottom: '20px',
                            marginRight: '0',
                            marginLeft: '0',
                            fontSize: '13px',
                            lineHeight: '28px',
                          }}
                        >
                          <p
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              lineHeight: 0.4,
                            }}
                          >
                            {' '}
                            {user_name}
                          </p>
                          <p
                            style={{
                              fontWeight: 500,
                              fontSize: 12,
                              lineHeight: 0.4,
                            }}
                          >
                            {' '}
                            {user_title}
                          </p>
                          <p style={{ fontWeight: 500, fontSize: 12 }}>
                            {' '}
                            {business_name}
                          </p>
                          <p
                            style={{
                              fontWeight: 300,
                              fontSize: 11,
                              lineHeight: 0.4,
                            }}
                          >
                            {' '}
                            {user_phone}
                          </p>
                          <p
                            style={{
                              fontWeight: 500,
                              fontSize: 11,
                              lineHeight: 0.4,
                            }}
                          >
                            {website}
                          </p>
                        </p>
                        <table
                          width="100%"
                          style={{ borderCollapse: 'collapse' }}
                        >
                          <tr>
                            <td
                              height="5"
                              style={{
                                fontSize: '0px',
                                lineHeight: '0px',
                                borderTopWidth: '1px',
                                borderTopStyle: 'solid',
                                borderTopColor: '#e2e8f0',
                                wordBreak: 'break-word',
                                fontFamily:
                                  "'Inter', Helvetica, Arial, sans-serif",
                              }}
                            >
                              &nbsp;
                            </td>
                          </tr>
                        </table>
                        <p
                          className="small"
                          style={{
                            color: '#4a556680',
                            marginTop: '20px',
                            marginBottom: '20px',
                            marginRight: '0',
                            marginLeft: '0',
                            fontSize: '10px',
                            lineHeight: '12px',
                          }}
                        >
                          © 2024 - Ce courriel est envoyé à partir de Node. Le
                          contenu de cet e-mail est confidentiel et destiné
                          uniquement au destinataire spécifié dans le message.
                          Il est strictement interdit de partager toute partie
                          de ce message avec un tiers, sans l'accord écrit de
                          l'expéditeur. Si vous avez reçu ce message par erreur,
                          veuillez répondre à ce message et demander sa
                          suppression, afin que nous puissions nous assurer
                          qu'une telle erreur ne se reproduise pas à l'avenir.
                          This email is sent from Node.The content of this email
                          is confidential and intended for the recipient
                          specified in message only. It is strictly forbidden to
                          share any part of this message with any third party,
                          without a written consent of the sender. If you
                          received this message by mistake, please reply to this
                          message and follow with its deletion, so that we can
                          ensure such a mistake does not occur in the future
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default EmailVisual;
