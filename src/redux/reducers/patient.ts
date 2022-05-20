import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';
import { DEFAULT_PAGE_SIZE } from '../page.util';

export const ACTION_TYPES = {
  SEARCH_PATIENTS: 'patient/SEARCH_PATIENTS',
  GET_PATIENT: 'patient/GET_PATIENT',
  RESET_PATIENTS: 'patient/RESET_PATIENTS',
  GET_PATIENT_RELATIONSHIPS: 'patient/GET_PATIENT_RELATIONSHIPS',
  GET_PATIENT_LINKED_REGIMENS: 'patient/GET_PATIENT_LINKED_REGIMENS'
};

const initialState = {
  loading: false,
  patients: [],
  patient: null,
  patientRelationships: null,
  errorMessage: '',
  currentPage: 0,
  totalCount: 0,
  hasNext: false,
  hasPrev: false,
  q: '',
  patientLinkedRegimens: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_PATIENT_RELATIONSHIPS):
      return {
        ...state,
        patientRelationships: null
      };
    case REQUEST(ACTION_TYPES.SEARCH_PATIENTS):
      return {
        ...state,
        loading: true,
        q: action.meta.q
      };
    case FAILURE(ACTION_TYPES.SEARCH_PATIENTS):
      return {
        ...initialState,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.SEARCH_PATIENTS):
      const links = action.payload.data.links;
      const page = action.meta.currentPage || 0;
      const patients = action.payload.data.results || [];
      if (action.meta.q === state.q) {
        return {
          ...initialState,
          patients: page === 0 ? patients : [...state.patients, ...patients],
          hasNext: links && !!links.find(link => link.rel === 'next'),
          hasPrev: links && !!links.find(link => link.rel === 'prev'),
          totalCount: action.payload.data.totalCount,
          currentPage: action.meta.currentPage
        };
      } else {
        return { ...state };
      }
    case SUCCESS(ACTION_TYPES.GET_PATIENT):
      return {
        ...state,
        patient: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.GET_PATIENT_RELATIONSHIPS):
      return {
        ...state,
        patientRelationships: action.payload.data.results
      };
    case SUCCESS(ACTION_TYPES.GET_PATIENT_LINKED_REGIMENS):
      return {
        ...state,
        patientLinkedRegimens: action.payload.data
      };
    case ACTION_TYPES.RESET_PATIENTS:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// actions
export const search = (q, page = 0, limit = DEFAULT_PAGE_SIZE) => {
  const requestUrl = `/openmrs/ws/rest/v1/patient?q=${q || ''}&startIndex=${page * limit}&limit=${limit}&v=full&totalCount=true`;
  return {
    type: ACTION_TYPES.SEARCH_PATIENTS,
    payload: axios.get(requestUrl),
    meta: {
      q,
      currentPage: page
    }
  };
};

const PATIENT_CUSTOM_REPRESENTATION = `patientId,uuid,identifiers,person:(gender,age,birthdate,birthdateEstimated,preferredAddress,preferredName,attributes),attributes:(value,attributeType:(name))`;

export const getPatient = id => {
  const requestUrl = `/openmrs/ws/rest/v1/patient/${id}?v=custom:(${PATIENT_CUSTOM_REPRESENTATION})`;
  return {
    type: ACTION_TYPES.GET_PATIENT,
    payload: axios.get(requestUrl)
  };
};

export const getPersonRelationships = id => {
  const requestUrl = `/openmrs/ws/rest/v1/relationship?v=default&person=${id}`;
  return {
    type: ACTION_TYPES.GET_PATIENT_RELATIONSHIPS,
    payload: axios.get(requestUrl)
  };
};

export const getPatientLinkedRegimens = () => {
  const requestUrl = '/openmrs/ws/cfl/regimens/patient-info';
  return {
    type: ACTION_TYPES.GET_PATIENT_LINKED_REGIMENS,
    payload: axios.get(requestUrl)
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET_PATIENTS
});

export default reducer;
