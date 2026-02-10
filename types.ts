
export interface CountryData {
  code: string;
  name: string;
}

export interface CheckResponse {
  available: CountryData[];
  unavailable: CountryData[];
}
