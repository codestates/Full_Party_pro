import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux'
import Party from '../pages/Party';
import { AppState } from '../reducers';
import { SearchDispatchType, SEARCH_BY_KEYWORD, SEARCH_BY_TAG } from "./searchType";

export const searchParty = (userId: number, word: string, region?: string, searchBy?: string) => async (dispatch: Dispatch<SearchDispatchType>) => {
  if(searchBy === 'byKeyword') {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/search?keyword=${word}&region=${region}&userId=${userId}`)
    const party = res.data.result;

    const parsedLatlng = party.map((item: any) => JSON.parse(item.latlng));

    let parties = [];
    for (let i = 0; i < party.length; i++) {
      parties[i] = { ...party[i], latlng: parsedLatlng[i] };
    }
    const payload = { parties };

    dispatch({
      type: SEARCH_BY_KEYWORD,
      payload
    });
  }
  else if(searchBy === 'byTag') {
    const res = await axios.get(`${process.env.REACT_APP_CLIENT_URL}/search?tagName=${word}&region=${region}&userId=${userId}`)
    const party = res.data.result;
    const parsedLatlng = res.data.result.map((item: any) => JSON.parse(item.latlng));
    let parties = [];
    for (let i = 0; i < party.length; i++) {
      parties[i] = { ...party[i], ...parsedLatlng[i] };
    }
    const payload = { parties };

    dispatch({
      type: SEARCH_BY_TAG,
      payload
    });
  }
}