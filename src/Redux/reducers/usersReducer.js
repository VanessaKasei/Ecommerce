// userReducer.js
const initialState = {
    userId: null,
    role: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER_ID':
        return {
          ...state,
          userId: action.payload.userId, // Make sure this is correctly set
          role: action.payload.role,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  