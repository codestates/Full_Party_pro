import axios from 'axios';
import { useSelector } from 'react-redux';
import { Dispatch } from 'redux'
import Party from '../pages/Party';
import { AppState } from '../reducers';
import { SearchDispatchType, SEARCH_BY_KEYWORD, SEARCH_BY_TAG } from "./searchType";

export const searchParty = (word: string, userId?:number, region?: string, searchBy?: string) => async (dispatch: Dispatch<SearchDispatchType>) => {
  if(searchBy === 'byKeyword') {
    const res = await axios.get(`${process.env.REACT_APP_CLIENT_URL}/search?keyword=${word}&region=${region}&userId=${userId}`)
    const party = res.data.result

    dispatch({
      type: SEARCH_BY_KEYWORD,
      payload: {
        parties: party
      }
    })
  }
  else if(searchBy === 'byTag') {
    const res = await axios.get(`${process.env.REACT_APP_CLIENT_URL}/search?tagName=${word}&region=${region}&userId=${userId}`)
    const party = res.data.result

    dispatch({
      type: SEARCH_BY_TAG,
      payload: {
        parties: party
      }
    })
  }
}