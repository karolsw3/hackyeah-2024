export interface PccTaxDeclaration {
  agreementDate?: number;
  taxOfficeNumber?: number;
  taxPayer?: TaxPayer;
  objectTaxation?: TaxationObject;
  objectLocation?: ObjectLocation;
  transactionLocation?: ObjectLocation;
  objectDescription?: string;
  objectPrice?: number; // If it's a car it should contain - Brand, Model, Year, VIN, Registration Number, Mileage
  numberOfAttachedForms?: number;
  type?: PccTaxDeclarationType;
}

export enum PccTaxDeclarationType {
  CAR = 'CAR',
  MONEY_LENDING = 'MONEY_LENDING',
}

type TaxPayerAddress = {
  country: string;
  voivodeship: string;
  district: string;
  commune: string;
  street: string;
  houseNumber: number;
  flatNumber?: number;
  city: string;
  postalCode: string;
} | {
  country: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: number;
  flatNumber?: number;
}

interface TaxPayer {
  type: TaxPayerType;
  pesel: number;
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  fatherName?: string;
  motherName?: string;
  address: Partial<TaxPayerAddress>;
}

enum TaxPayerType {
  SOLIDARITY = 1,
  OTHER = 5,
}

enum TaxationObject {
  Umowa = 1, // Only supported now
  ZmianaUmowy = 2,
  OrzeczenieSaduLubUgoda = 3,
  Inne = 4,
}

enum ObjectLocation {
  NotSpecified = 0,
  PolandTerritory = 1,
  NonPolandTerritory = 2,
}
