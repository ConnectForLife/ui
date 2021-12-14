export interface IDrugList {
  display: string;
  uuid: string;
  abbreviation: string;
  concept: {
    uuid: string;
    display: string;
  };
}

export interface IDrugsState {
  loading: boolean;
  drugsList: IDrugList[];
}
