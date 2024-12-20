// Define action types
export const DATA_MAIN = 'DATA_MAIN';

export const mainData = (data) => {
  return (dispatch) => {
    dispatch({
      type: DATA_MAIN,
      payload: data,
    });
  };
};
