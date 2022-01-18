export const SEARCH_BY_KEYWORD = 'SEARCH_BY_KEYWORD'
export const SEARCH_BY_TAG = 'SEARCH_BY_TAG'

export type Search = {
  parties: any[]
}

export interface searchByKeywordDispatch{
  type: typeof SEARCH_BY_KEYWORD
  payload: Search
}

export interface searchByTagDispatch {
  type: typeof SEARCH_BY_TAG
  payload: Search
}

export type SearchDispatchType = searchByKeywordDispatch | searchByTagDispatch;