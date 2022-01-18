import { SEARCH_BY_KEYWORD, searchByTagDispatch, Search, SearchDispatchType, SEARCH_BY_TAG } from "../actions/searchType";

interface InitialState {
  parties: any[]
}

const initialState: InitialState = {
  parties: []
}

const searchReducer = (state = initialState, action: SearchDispatchType): InitialState => {
  switch (action.type) {
    case SEARCH_BY_KEYWORD:
      return {
        parties: action.payload.parties
      }

    case SEARCH_BY_TAG:
      return {
        parties: action.payload.parties
      }

    default:
      return state;
  }
}

export default searchReducer;