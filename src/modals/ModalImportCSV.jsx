import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Button from '../stories/general-components/Button';
import ModalHuge from './Base/ModalHuge';
import Select from '../stories/general-components/Select';
import GeneralText from '../stories/general-components/GeneralText';
import { Divider } from '@material-ui/core';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';

const ModalImportCSV = ({ modalCloseHandler, isOpen, fieldsStructure }) => {
  const { t, i18n } = useTranslation();
  const { structureId } = useParams();
  const [loading, setLoading] = useState(false);

  const onConfirm = () => {
    handleImportData();
    modalCloseHandler();
  };

  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [match, setMatch] = useState({});
  const [text, setText] = useState('');

  useEffect(() => {
    setFields(fieldsStructure);
  }, [fieldsStructure]);

  const handleFile = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  const handleImportData = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business-importData`,
        body: {
          match: match,
          data: data,
          structureId: structureId,
          language: i18n.language,
        },
      });
      setText(t('importedData'));
    } catch (error) {
      console.error('Error importing data:', error);
    }
  };

  return (
    <ModalHuge
      fullWidth
      isOpen={isOpen}
      maxWidth={'lg'}
      modalCloseHandler={modalCloseHandler}
      title={t('importData') + ' CSV'}
    >
      {text ? (
        <div className="row align-c p-5">{text}</div>
      ) : (
        <div className="row align-c p-5">
          {data?.length === 0 && (
            <div className="align-c mb-5">
              <input type="file" onChange={handleFile} />
            </div>
          )}
          {data?.length > 0 && (
            <div className="row">
              {Object.entries(data[0]).map(([key, value], index) => (
                <div>
                  <div className="row middle-content mb-1" key={index}>
                    <div className="col-6">
                      <GeneralText
                        primary={true}
                        text={key}
                        fontSize="11px"
                        size="regular"
                      />
                      <GeneralText
                        primary={true}
                        text={value}
                        fontSize="15px"
                        size="bold"
                      />
                    </div>
                    <div className="col-4">
                      <Select
                        label={t('match')}
                        value={match?.[key]?.structureValue}
                        onChange={(e, value) => {
                          setMatch(
                            fields?.map((field) =>
                              field.value === value
                                ? {
                                    ...field,
                                    structureKey: key,
                                    structureValue: value,
                                  }
                                : field
                            )
                          );
                        }}
                        selections={
                          fields?.map((structure) => ({
                            label: structure?.name,
                            value: structure?.value,
                            id: structure?.value,
                          })) || []
                        }
                      />
                    </div>
                    <div className="col-2">
                      <Select
                        fullWidth
                        noEmpty
                        label={t('type')}
                        value={match?.[key]?.type}
                        selections={[
                          {
                            id: 'text',
                            label: t('text'),
                            value: 'text',
                          },
                          {
                            id: 'number',
                            label: t('number'),
                            value: 'number',
                          },
                          {
                            id: 'date',
                            label: t('date'),
                            value: 'date',
                          },
                          {
                            id: 'boolean',
                            label: t('boolean'),
                            value: 'boolean',
                          },
                        ]}
                        onChange={(e, id) =>
                          setMatch(
                            fields.map((field) =>
                              field.id === id
                                ? {
                                    ...field,
                                    type: e.target.value,
                                  }
                                : field
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                  <Divider component="div" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-3">
            <Button
              variant="contained"
              color="primary"
              onClick={onConfirm}
              disabled={loading}
              label={t('import') + ' CSV'}
            />
          </div>
        </div>
      )}
    </ModalHuge>
  );
};

export default ModalImportCSV;
