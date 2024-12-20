import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { db } from '../../firebase';
import {
  query,
  where,
  getDoc,
  orderBy,
  orderBy as orderByFn,
  doc,
  onSnapshot,
  collection,
  Timestamp,
} from 'firebase/firestore';
import { setGeneralStatus } from './coreAction';

export const FETCH_DATA_BEGIN = 'FETCH_DATA_BEGIN';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
export const FETCH_PASSES_BEGIN = 'FETCH_PASSES_BEGIN';
export const FETCH_PASSES_SUCCESS = 'FETCH_PASSES_SUCCESS';
export const FETCH_PASSES_FAILURE = 'FETCH_PASSES_FAILURE';
export const CLEAR_CARDS = 'CLEAR_CARDS';
export const SET_LAST_DOC = 'SET_LAST_DOC';
export const SET_CURRENT_COLLECTION = 'SET_CURRENT_COLLECTION';
export const CLEAR_ALL_LISTS = 'CLEAR_ALL_LISTS';
export const SEARCH_DATA_SUCCESS = 'SEARCH_DATA_SUCCESS';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';

export const clearAllLists = () => ({
  type: CLEAR_ALL_LISTS,
});

export const setLastDoc = (lastDoc) => ({
  type: SET_LAST_DOC,
  payload: lastDoc,
});

export const setCurrentCollection = (currentCollection, collectionName) => ({
  type: SET_CURRENT_COLLECTION,
  payload: { collection: collectionName, data: currentCollection },
});

export const fetchDataBegin = () => ({
  type: FETCH_DATA_BEGIN,
});

export const fetchDataSuccess = (data, name) => ({
  type: FETCH_DATA_SUCCESS,
  payload: { collection: name, data: data },
});

export const searchDataSuccess = (data, name) => ({
  type: SEARCH_DATA_SUCCESS,
  payload: { collection: name, data: data },
});

export const fetchDataFailure = (error) => ({
  type: FETCH_DATA_FAILURE,
  payload: { error },
});

export const handleListData =
  (
    searchValue = '',
    structureId,
    moduleId,
    lastDoc,
    page,
    pageSize,
    facetKey,
    facet,
    t,
    order,
    orderBy,
    lang,
    start,
    end,
    dateFilter,
    activeSegment,
    activeTab
  ) =>
  async (dispatch) => {
    dispatch(searchValue ? fetchDataBegin() : fetchDataBegin());

    try {
      let data;
      let body = {
        lang: lang || 'fr',
        moduleId: moduleId,
        structureId: structureId,
        activeTab: activeTab,
      };

      if (searchValue && searchValue.trim()) {
        body = {
          ...body,
          query: searchValue,
        };
      }

      if (facet === 0 || (facet !== null && facet !== undefined && facetKey)) {
        body = {
          ...body,
          filter: facetKey,
          filterCondition: '==',
          filterValue:
            facet === 'true' ? true : facet === 'false' ? false : facet,
        };
      }

      if (order && orderBy) {
        body = {
          ...body,
          order: order,
          orderBy: orderBy,
        };
      }

      if (lastDoc && page >= 1) {
        body = {
          ...body,
          startAfter: lastDoc,
        };
      }

      if (activeSegment) {
        body = {
          ...body,
          segmentId: activeSegment,
        };
      }

      if (
        dateFilter &&
        start !== NaN &&
        start !== null &&
        end !== NaN &&
        end !== null &&
        start !== '' &&
        end !== ''
      ) {
        const timeStampFilter = `${dateFilter}:${start} TO ${end}`;
        const numericFilters = [];
        numericFilters.push(timeStampFilter);
        body = {
          ...body,
          numericFilters: start ? numericFilters : null,
        };
      } else if (dateFilter && start !== NaN && start !== null) {
        const startDay = `${start}T00:00:00`;
        const startStamp = new Date(startDay).getTime();
        const endDay = `${end}T23:59:59`;
        const endStamp = new Date(endDay).getTime();
        const timeStampFilter = `${dateFilter}:${startStamp} TO ${endStamp}`;
        const numericFilters = [];
        numericFilters.push(timeStampFilter);
        body = {
          ...body,
          numericFilters: start ? numericFilters : null,
        };
      }

      // Search operation
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreMulti/list`,
        body: body,
      });

      data = response?.hits?.map((doc) => ({
        ...doc,
        path:
          response?.collection === 'connections'
            ? doc?.documentPath || doc?.path
            : response?.collection + '/' + doc?.id,
        id: doc?.id,
      }));

      if (data?.length > 0) {
        const lastVisible = response?.lastVisible;
        dispatch(setLastDoc(lastVisible));
      } else {
        dispatch(setLastDoc(undefined));
      }

      dispatch(fetchDataSuccess(data, response?.collectionField));

      const objectIDsDoc = data?.map((doc) => doc.id);
      const firstTen = objectIDsDoc?.slice(0, 10);
      const hitsTotal = response?.totalHits;

      const collectionDataResponse = {
        name: response?.collectionField,
        nbHits: response?.nbHits || 0,
        nbDocuments: response?.hits?.length || 0,
        totalDocuments: hitsTotal,
        facets: response?.facets,
        activeCollection: response?.collectionField,
        collection: response?.collectionField,
        structureId: structureId,
        header: response?.header,
        summary: response?.summary,
        currentPage: page,
        queryID: response?.queryID,
        objectIDs: firstTen,
      };
      dispatch(
        setCurrentCollection(collectionDataResponse, response?.collectionField)
      );
    } catch (error) {
      console.error('Error fetching data', error);
      dispatch(fetchDataFailure(error));
    }
  };

export const fetchPassesBegin = () => ({
  type: FETCH_PASSES_BEGIN,
});

export const fetchPassesSuccess = (passes) => ({
  type: FETCH_PASSES_SUCCESS,
  payload: { passes },
});

export const fetchPassesFailure = (error) => ({
  type: FETCH_PASSES_FAILURE,
  payload: { error },
});

export const handlePasses =
  (
    searchValue = '',
    structureId,
    startTimestamp,
    endTimestamp,
    facetKey,
    facet,
    t
  ) =>
  async (dispatch) => {
    dispatch(fetchPassesBegin());
    try {
      const businessFirebaseID = localStorage.getItem('businessId');
      const businessRef = doc(db, 'businessesOnNode', businessFirebaseID);

      let passesQuery;
      passesQuery = query(
        collection(db, 'passes'),
        where('ownerId', '==', businessRef),
        where('startDate', '>=', Timestamp.fromMillis(startTimestamp)),
        where('startDate', '<', Timestamp.fromMillis(endTimestamp)),
        orderBy('startDate', 'asc')
      );

      if (facet === 0 || facet) {
        passesQuery = query(passesQuery, where(facetKey, '==', facet));
      }

      const unsubscribe = onSnapshot(passesQuery, (snapshot) => {
        const updatedPasses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          locationId: doc.data().locationId?.id,
          dependencyId: doc.data().dependencyId?.id,
          targetId: doc.data().targetId?.id,
          structureId: doc.data().structureId?.id,
          targetProfileId: doc.data().targetProfileId?.id,
          assignedToId: doc.data().assignedToId?.id,
          ownerId: businessFirebaseID,
          businessId: '',
        }));
        const totalDocuments = snapshot.size;

        dispatch(fetchPassesSuccess(updatedPasses));
        dispatch(
          setCurrentCollection({
            name: 'passes',
            nbDocuments: totalDocuments,
            structureId: structureId,
          })
        );

        return () => {
          unsubscribe();
        };
      });
    } catch (error) {
      console.error('Error fetching passes');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
      dispatch(fetchPassesFailure(error));
    }
  };

export const searchResults = (searchResults) => ({
  type: SEARCH_RESULTS,
  payload: searchResults,
});
