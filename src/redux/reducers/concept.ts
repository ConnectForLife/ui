import axios from 'axios';
import { IConceptState } from '../../shared/models/concept';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';

export const ACTION_TYPES = {
  SEARCH_CONCEPTS: 'concept/SEARCH_CONCEPTS',
  RESET_CONCEPTS: 'concept/RESET_CONCEPTS',
  GET_CONCEPT: 'concept/GET_CONCEPT'
};

const initialState: IConceptState = {
  loading: false,
  q: '',
  concepts: [],
  concept: [],
  errorMessage: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_CONCEPTS):
    case REQUEST(ACTION_TYPES.GET_CONCEPT):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_CONCEPTS):
    case FAILURE(ACTION_TYPES.GET_CONCEPT):
      return {
        ...initialState,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.SEARCH_CONCEPTS):
      return {
        ...initialState,
        q: action.meta.q,
        concepts: action.payload.data.results
      };
    case SUCCESS(ACTION_TYPES.GET_CONCEPT):
      return {
        ...state,
        loading: false,
        concept: action.payload.data
      };
    case ACTION_TYPES.RESET_CONCEPTS:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// actions
export const searchConcepts = (q, conceptClasses) => {
  const requestUrl = `/openmrs/ws/rest/v1/conceptsearch?conceptClasses=${conceptClasses}${!!q ? '&q=' + q : ''}`;
  return {
    type: ACTION_TYPES.SEARCH_CONCEPTS,
    payload: axios.get(requestUrl),
    meta: {
      q
    }
  };
};

export const getConcept = (uuid: string, custom?: string) => ({
  type: ACTION_TYPES.GET_CONCEPT,
  payload: axios.get(`/openmrs/ws/rest/v1/concept/${uuid}?v=${custom ? `custom:(${custom})` : 'full'}`)
});

export const reset = () => ({
  type: ACTION_TYPES.RESET_CONCEPTS
});

export default reducer;
