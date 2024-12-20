import React from 'react';

const EmailVisualCard = ({
  business_entity,
  business_name,
  variable1,
  variable2,
  variable3,
  body,
  variable4,
  name,
  selectLang,
  items,
  actionUrl,
  isInvoiced,
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
            align="left"
            style={{
              wordBreak: 'break-word',
              fontFamily: "'Inter', Helvetica, Arial, sans-serif",
              fontSize: '12px',
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
                  align="left"
                  style={{
                    wordBreak: 'break-word',
                    fontFamily: "'Inter', Helvetica, Arial, sans-serif",
                    fontSize: '12px',
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
                      marginLeft: '10px',
                      paddingTop: '0',
                      paddingBottom: '0',
                      paddingRight: '0',
                      paddingLeft: '0',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <tr>
                      <td
                        className="ms-content-body"
                        style={{
                          wordBreak: 'break-word',
                          fontFamily: "'Inter', Helvetica, Arial, sans-serif",
                          fontSize: '12px',
                          lineHeight: '24px',
                          paddingTop: '40px',
                          paddingBottom: '40px',
                          paddingRight: '20px',
                          paddingLeft: '20px',
                        }}
                      >
                        <img
                          style={{ borderRadius: '100px', height: '40px' }}
                          className="max-width"
                          src={`https://storage.googleapis.com/node-business-logos/${business_entity}.png`}
                          alt=""
                        />

                        <h1
                          style={{
                            marginTop: '10px',
                            color: '#111111',
                            fontSize: '18px',
                            lineHeight: '26px',
                            fontWeight: 600,
                            marginBottom: '24px',
                          }}
                        >
                          {selectLang === 'fr'
                            ? `Bonjour ${name}`
                            : `Hi ${name}`}
                          ,
                        </h1>
                        <table
                          style={{ borderCollapse: 'collapse' }}
                          role="presentation"
                        >
                          <tbody>
                            <tr>
                              <td
                                className="info"
                                style={{
                                  wordBreak: 'break-word',
                                  fontFamily:
                                    "'Inter', Helvetica, Arial, sans-serif",
                                  fontSize: '14px',
                                  lineHeight: '24px',
                                  paddingTop: '20px',
                                  paddingBottom: '20px',
                                  paddingRight: '20px',
                                  paddingLeft: '20px',
                                  borderRadius: '10px',
                                  backgroundColor: '#f4f7fa',
                                }}
                              >
                                <table
                                  style={{ borderCollapse: 'collapse' }}
                                  role="presentation"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          wordBreak: 'break-word',
                                          fontFamily:
                                            "'Inter', Helvetica, Arial, sans-serif",
                                          fontSize: '14px',
                                          lineHeight: '24px',
                                        }}
                                      >
                                        <strong style={{ fontWeight: 600 }}>
                                          {variable3}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          wordBreak: 'break-word',
                                          fontFamily:
                                            "'Inter', Helvetica, Arial, sans-serif",
                                          fontSize: '14px',
                                          lineHeight: '24px',
                                        }}
                                      >
                                        {business_name}:
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: variable2,
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          width="100%"
                          align="left"
                          style={{ borderCollapse: 'collapse' }}
                          role="presentation"
                        >
                          <tbody>
                            <tr>
                              <td
                                align="left"
                                style={{
                                  paddingTop: '30px',
                                  paddingBottom: '30px',
                                  paddingRight: 0,
                                  width: '250px',
                                  paddingLeft: 0,
                                  wordBreak: 'break-word',
                                  fontFamily:
                                    "'Inter', Helvetica, Arial, sans-serif",
                                  fontSize: '14px',
                                  lineHeight: '24px',
                                }}
                              >
                                <table
                                  className="mobile-wide"
                                  border="0"
                                  style={{
                                    borderCollapse: 'collapse',
                                    width: '250px',
                                  }}
                                  role="presentation"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        align="left"
                                        className="btn"
                                        style={{
                                          wordBreak: 'break-word',
                                          fontFamily:
                                            "'Inter', Helvetica, Arial, sans-serif",
                                          fontSize: '14px',
                                          lineHeight: '24px',
                                          backgroundColor: '#f2f2f2',
                                          maxWidth: '250px',
                                          textAlign: 'center',
                                          borderRadius: '3px',
                                        }}
                                      >
                                        <a
                                          href={actionUrl}
                                          target="_blank"
                                          style={{
                                            backgroundColor: '#f2f2f2',
                                            paddingTop: '14px',
                                            paddingBottom: '14px',
                                            paddingRight: '30px',
                                            paddingLeft: '30px',
                                            display: 'inline-block',
                                            color: '#000',
                                            textDecoration: 'none',
                                            width: '250px',
                                            borderRadius: '3px',
                                            WebkitTextSizeAdjust: 'none',
                                            boxSizing: 'border-box',
                                            borderWidth: 0,
                                            fontWeight: 600,
                                            fontSize: '13px',
                                            lineHeight: '21px',
                                            letterSpacing: '0.25px',
                                          }}
                                        >
                                          {isInvoiced
                                            ? selectLang === 'fr'
                                              ? 'Voir les détails'
                                              : 'See details'
                                            : selectLang === 'fr'
                                            ? 'Voir les détails'
                                            : 'See details'}
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          width="100%"
                          style={{ borderCollapse: 'collapse' }}
                        >
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  paddingTop: '20px',
                                  paddingBottom: '20px',
                                  paddingRight: 0,
                                  paddingLeft: 0,
                                  wordBreak: 'break-word',
                                  fontFamily:
                                    "'Inter', Helvetica, Arial, sans-serif",
                                  fontSize: '14px',
                                  lineHeight: '24px',
                                }}
                              >
                                <table
                                  width="100%"
                                  style={{ borderCollapse: 'collapse' }}
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        valign="middle"
                                        style={{
                                          wordBreak: 'break-word',
                                          fontFamily:
                                            "'Inter', Helvetica, Arial, sans-serif",
                                          fontSize: '14px',
                                          lineHeight: '24px',
                                        }}
                                      >
                                        <h3
                                          style={{
                                            marginTop: 0,
                                            color: '#111111',
                                            fontSize: '16px',
                                            lineHeight: '26px',
                                            fontWeight: 600,
                                            marginBottom: '24px',
                                          }}
                                        >
                                          Ref. #{variable1}
                                        </h3>
                                      </td>
                                      <td
                                        align="right"
                                        valign="middle"
                                        style={{
                                          wordBreak: 'break-word',
                                          fontFamily:
                                            "'Inter', Helvetica, Arial, sans-serif",
                                          fontSize: '14px',
                                          lineHeight: '24px',
                                        }}
                                      >
                                        {/* Empty cell for layout */}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  className="table"
                                  width="100%"
                                  style={{ borderCollapse: 'collapse' }}
                                >
                                  <tbody>
                                    <tr>
                                      <th
                                        align="left"
                                        style={{
                                          fontFamily:
                                            "'Inter', Helvetica, Arial, sans-serif",
                                          paddingTop: '10px',
                                          paddingBottom: '10px',
                                          paddingRight: 0,
                                          paddingLeft: 0,
                                          color: '#85878E',
                                          fontSize: '13px',
                                          fontWeight: 600,
                                          lineHeight: '18px',
                                        }}
                                      >
                                        Service
                                      </th>
                                      <th
                                        align="right"
                                        style={{
                                          fontFamily:
                                            "'Inter', Helvetica, Arial, sans-serif",
                                          paddingTop: '10px',
                                          paddingBottom: '10px',
                                          paddingRight: 0,
                                          paddingLeft: 0,
                                          color: '#85878E',
                                          fontSize: '13px',
                                          fontWeight: 600,
                                          lineHeight: '18px',
                                        }}
                                      >
                                        {selectLang === 'fr'
                                          ? 'Détail'
                                          : 'Details'}
                                      </th>
                                    </tr>
                                    {items &&
                                      items.length > 0 &&
                                      items.map((item, index) => (
                                        <tr key={index}>
                                          <td
                                            valign="middle"
                                            style={{
                                              wordBreak: 'break-word',
                                              fontFamily:
                                                "'Inter', Helvetica, Arial, sans-serif",
                                              fontSize: '14px',
                                              lineHeight: '18px',
                                              paddingTop: '14px',
                                              paddingBottom: '14px',
                                              paddingRight: 0,
                                              paddingLeft: 0,
                                              borderTop: '1px solid #e2e8f0',
                                            }}
                                          >
                                            {item.name}
                                          </td>
                                          <td
                                            valign="middle"
                                            align="right"
                                            style={{
                                              wordBreak: 'break-word',
                                              fontFamily:
                                                "'Inter', Helvetica, Arial, sans-serif",
                                              fontSize: '14px',
                                              lineHeight: '24px',
                                              paddingTop: '14px',
                                              paddingBottom: '14px',
                                              paddingRight: 0,
                                              paddingLeft: 0,
                                              borderTop: '1px solid #e2e8f0',
                                            }}
                                          >
                                            <p
                                              style={{
                                                fontSize: '14px',
                                                lineHeight: '15px',
                                              }}
                                            >
                                              {item.variable}
                                            </p>
                                            <p
                                              style={{
                                                fontSize: '10px',
                                                lineHeight: '10px',
                                              }}
                                            >
                                              {item.second}
                                            </p>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {isInvoiced ? (
                          <p
                            style={{
                              color: '#4a5566',
                              marginBottom: '20px',
                              fontSize: '14px',
                              lineHeight: '20px',
                            }}
                          >
                            {selectLang === 'fr'
                              ? `Si vous avez des questions concernant cette facture, répondez simplement à ce courriel ou contactez l'équipe d'assistance de Node pour obtenir de l'aide.`
                              : `If you have any questions about this invoice, simply reply to this email or contact the Node support team for assistance.`}
                          </p>
                        ) : (
                          <p
                            style={{
                              color: '#4a5566',
                              marginBottom: '20px',
                              fontSize: '14px',
                              lineHeight: '20px',
                            }}
                          >
                            {selectLang === 'fr'
                              ? `Si vous avez des questions concernant cette ${variable4}, répondez simplement à ce courriel ou contactez l'équipe d'assistance de Node pour obtenir de l'aide.`
                              : `If you have any questions about this ${variable4}, simply reply to this email or contact the Node support team for assistance.`}
                          </p>
                        )}

                        <p
                          style={{
                            color: '#4a5566',
                            marginTop: '20px',
                            marginBottom: '20px',
                            fontSize: '14px',
                            lineHeight: '20px',
                          }}
                        >
                          {selectLang === 'fr'
                            ? 'Bonne journée!'
                            : 'Have a great day!'}
                          <br />
                          {selectLang === 'fr'
                            ? `L'équipe de ${business_name}`
                            : `The ${business_name} team`}
                        </p>
                        <table
                          width="100%"
                          style={{ borderCollapse: 'collapse' }}
                        >
                          <tbody>
                            <tr>
                              <td
                                height="20"
                                style={{
                                  fontSize: '0px',
                                  lineHeight: '0px',
                                  wordBreak: 'break-word',
                                  fontFamily:
                                    "'Inter', Helvetica, Arial, sans-serif",
                                }}
                              >
                                &nbsp;
                              </td>
                            </tr>
                            <tr>
                              <td
                                height="20"
                                style={{
                                  fontSize: '0px',
                                  lineHeight: '0px',
                                  borderTop: '1px solid #e2e8f0',
                                  wordBreak: 'break-word',
                                  fontFamily:
                                    "'Inter', Helvetica, Arial, sans-serif",
                                }}
                              >
                                &nbsp;
                              </td>
                            </tr>
                          </tbody>
                        </table>
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

export default EmailVisualCard;
