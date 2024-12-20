import nodeAxiosFirebase from './nodeAxiosFirebase';

const getSearchResults = async ({
  searchValue,
  t,
  currentLang,
  structureId,
  dispatch,
}) => {
  try {
    const services = await nodeAxiosFirebase({
      t,
      method: 'POST',
      url: `coreMulti/list`,
      body: {
        query: searchValue,
        lang: currentLang,
        structureId: structureId,
      },
    });
    return services?.hits;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export default getSearchResults;
