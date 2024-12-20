//utilities
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { db } from '../../firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  where,
  collection,
  writeBatch,
  query,
  serverTimestamp,
} from 'firebase/firestore';

//components
import GeneralText from '../../stories/general-components/GeneralText';
import ButtonCircle from '../../stories/general-components/ButtonCircle';

import { Divider, Tooltip } from '@mui/material';
import MaintenanceVehiculeData from './MaintenanceVehiculeData';

const VehicleDetails = ({ isTablet }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const businessFirebaseID = localStorage.getItem('businessId');

  const singleCardDetails = useSelector(
    (state) => state.element.singleElementDetails
  );

  const profileData = useSelector(
    (state) => state.element.singleProfileDetails
  );

  const [maintenanceData, setMaintenanceData] = useState({
    tires: [],
    brakes: {},
  });

  const [selectedHealth, setSelectedHealth] = useState(null);
  const [toBeUpdate, setToBeUpdate] = useState({
    brakes: false,
    tires: false,
  });
  const [odometer, setOdometer] = useState();
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({});
  const [tabValue, setTabValue] = useState(0);

  const getTiresValue = (type) => {
    const found = maintenanceData?.tires?.find(
      (tireObj) => tireObj.type === type
    );
    return found || {};
  };

  const [brakeConditions, setBrakeConditions] = useState({
    FLB: 0,
    RRB: 0,
  });

  const initialTireWearSummer = getTiresValue('SUMMER');
  const initialTireWearWinter = getTiresValue('WINTER');

  const [tireWearSummer, setTireWearSummer] = useState({
    FLT: parseInt(initialTireWearSummer.FLT) || 0,
    FRT: parseInt(initialTireWearSummer.FRT) || 0,
    RLT: parseInt(initialTireWearSummer.RLT) || 0,
    RRT: parseInt(initialTireWearSummer.RRT) || 0,
    type: 'SUMMER',
  });

  const [tireWearWinter, setTireWearWinter] = useState({
    FLT: parseInt(initialTireWearWinter.FLT) || 0,
    FRT: parseInt(initialTireWearWinter.FRT) || 0,
    RLT: parseInt(initialTireWearWinter.RLT) || 0,
    RRT: parseInt(initialTireWearWinter.RRT) || 0,
    type: 'WINTER',
  });

  useEffect(() => {
    const initialTireWearSummer = getTiresValue('SUMMER');
    const initialTireWearWinter = getTiresValue('WINTER');

    setTireWearSummer({
      FLT: parseInt(initialTireWearSummer.FLT) || 0,
      FRT: parseInt(initialTireWearSummer.FRT) || 0,
      RLT: parseInt(initialTireWearSummer.RLT) || 0,
      RRT: parseInt(initialTireWearSummer.RRT) || 0,
      type: 'SUMMER',
    });

    setTireWearWinter({
      FLT: parseInt(initialTireWearWinter.FLT) || 0,
      FRT: parseInt(initialTireWearWinter.FRT) || 0,
      RLT: parseInt(initialTireWearWinter.RLT) || 0,
      RRT: parseInt(initialTireWearWinter.RRT) || 0,
      type: 'WINTER',
    });

    setBrakeConditions({
      FLB: parseInt(maintenanceData?.brakes?.FLB) || 0,
      RRB: parseInt(maintenanceData?.brakes?.RRB) || 0,
    });

    setSelectedHealth(maintenanceData?.battery);
  }, [maintenanceData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleButtonClick = (health) => {
    saveData(health);
    setSelectedHealth(health);
  };

  const dataItems = Object.entries(profileData?.data || {});

  //edit vehicle data
  const handleFieldValueChange = (key, newValue) => {
    setFormData({
      ...formData,
      [key]: newValue,
    });
  };

  const saveFieldValue = async (key) => {
    const profileRef = doc(
      db,
      'users',
      singleCardDetails?.targetId,
      'connections',
      `${singleCardDetails?.targetId}${businessFirebaseID}`,
      'profiles',
      profileData?.id
    );

    try {
      let isOdometerChanged = false;
      const docSnap = await getDoc(profileRef);
      const dataToUpdate = {};
      dataToUpdate[`data.${key}`] = formData[key];
      let newOdometer = odometer;

      if (key === 'odometer') {
        newOdometer = formData[key];
        isOdometerChanged = true;
      }

      dataToUpdate['data.odometer'] = newOdometer;

      if (docSnap.exists()) {
        await updateDoc(profileRef, dataToUpdate);
      } else {
        await setDoc(profileRef, dataToUpdate, { merge: true });
      }
      if (isOdometerChanged) {
        const cardRef = doc(db, 'cards', singleCardDetails?.id);
        await updateDoc(cardRef, {
          'targetProfile.currentMetric': parseInt(
            newOdometer || profileData?.data?.odometer
          ),
        });

        const cardPassesRef = collection(cardRef, 'passes');
        const q = query(cardPassesRef, where('type', '==', 'CARD_EVENT'));

        const batch = writeBatch(db);

        // Update the card document
        batch.update(cardRef, {
          lastUpdate: serverTimestamp(),
        });
        // Get documents and update each one
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const docRef = doc.ref;
          // Here, include the fields you want to update in each CARD_EVENT document
          batch.update(
            docRef,
            {
              card: {
                id: singleCardDetails?.id,
                profile: singleCardDetails?.targetProfile?.name,
                client: singleCardDetails?.targetDetails?.name,
                searchId: singleCardDetails?.searchId,
                name: singleCardDetails?.name,
                currentMetric: parseInt(newOdometer),
                tags: singleCardDetails?.tags || [],
              },
            },
            { merge: true }
          );
        });

        // Commit the batch
        await batch.commit();
      }
      setEditField(null);
    } catch (error) {
      console.error('Error updating profile field:', error);
    }
  };

  const saveData = async (selectedHealthData) => {
    const profileRef = doc(
      db,
      'users',
      singleCardDetails?.targetId,
      'connections',
      `${singleCardDetails?.targetId}${businessFirebaseID}`,
      'profiles',
      profileData?.id
    );

    try {
      const docSnap = await getDoc(profileRef);

      const updatePayload = {
        'data.maintenance.tires': [tireWearSummer, tireWearWinter],
        'data.maintenance.brakes': brakeConditions,
      };

      if (selectedHealthData || selectedHealth) {
        updatePayload['data.maintenance.battery'] =
          selectedHealthData || selectedHealth;
      }

      if (docSnap.exists()) {
        await updateDoc(profileRef, updatePayload);
      } else {
        await setDoc(profileRef, updatePayload, { merge: true });
      }

      // Update UI accordingly
      setToBeUpdate({
        brakes: false,
        tires: false,
      });
    } catch (error) {
      console.error('Error updating or creating profile data:', error);
    }
  };

  //populates the local state with tires, brakes and volt
  useEffect(() => {
    if (profileData?.data) {
      setMaintenanceData(profileData?.data?.maintenance);
      setOdometer(profileData?.data?.odometer);
    }
  }, [profileData]);

  return (
    <div>
      <div className="d-flex mt-4">
        <div style={{ paddingRight: '25px' }} className="col-7">
          <MaintenanceVehiculeData />

          <Divider component={'div'} />
        </div>
        <div className="col-5">
          <div className="hei-7 " id="listOfData">
            {dataItems
              .filter(
                ([key]) =>
                  ![
                    'exterior_color',
                    'interior_trim',
                    'colors',
                    'equipment',
                    'maintenance',
                    'attribute1',
                    'type',
                    'targetId',
                    'profileType',
                    'attribute2',
                    'data',
                    'userId',
                    'date',
                    'timeStamp',
                    'businessId',
                    'attribute3',
                    'uniqueAttribute',
                    'avatar',
                    'odometerChanged',
                    'warranties',
                    'curb_weight_manual',
                    'serial',
                    'cargo_length',
                    'optional_seating',
                    'passenger_volume',
                    'cargo_volume',
                    'standard_towing',
                    'cardId',
                    'cardNumber',
                    'id',
                    'maximum_towing',
                    'standard_payload',
                    'maximum_payload',
                    'maximum_gvwr',
                  ].includes(key)
              )
              .map(([key, value], index) => (
                <div className="row" key={index}>
                  <div className="col-5 mt-2">
                    <GeneralText
                      text={`${t(key)}:`}
                      primary={true}
                      fontSize="11px"
                      size="medium"
                    />
                  </div>

                  {editField === key ? (
                    <>
                      <div className="col-7 d-flex middle-content">
                        <div className="col-10 mt-2">
                          {/* <Input
                            value={profileData.data[key]}
                            primary={true}
                            type="text"
                            variant="standard"
                            margin="none"
                            size="small"
                            name={key}
                            onChange={(e) =>
                              handleFieldValueChange(key, e.target.value)
                            }
                          /> */}
                        </div>
                        <div className="col-1 mx-3">
                          <ButtonCircle
                            onClick={() => saveFieldValue(key)}
                            color="black"
                            icon="SaveOutlined"
                            size="sm"
                            primary={false}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-7 d-flex">
                        <div className="col-10 mt-2">
                          <GeneralText
                            text={`${
                              typeof value === 'object'
                                ? JSON.stringify(value, null, 2)
                                : value
                            }`}
                            primary={true}
                            fontSize="11px"
                            size="bold"
                          />
                        </div>
                        <div className="col-1 mx-3">
                          <ButtonCircle
                            onClick={() => setEditField(key)}
                            color="black"
                            icon="DriveFileRenameOutlineOutlined"
                            size="sm"
                            primary={false}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <hr></hr>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
