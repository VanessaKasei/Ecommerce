const loginUser = (userId, role) => {
    return {
      type: 'SET_USER_ID',
      payload: { id: userId, role: role }, // Structure matches your reducer
    };
  };