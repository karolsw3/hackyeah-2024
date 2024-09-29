import { format } from 'date-fns';
import { XMLBuilder } from 'fast-xml-parser';

// Enums and types for form fields
enum TaxPayerType {
  Person = 'OsobaFizyczna',
  Company = 'OsobaNiefizyczna',
}

enum AddressType {
  Polish = 'AdresPol',
  Foreign = 'AdresZagr',
}

enum TransactionType {
  CarPurchase = 1,
  Loan = 2,
}

enum ObjectLocation {
  NotSpecified = 0,
  PolandTerritory = 1,
  NonPolandTerritory = 2,
}

type Address = {
  type: AddressType;
  country?: string;
  voivodeship?: string;
  county?: string;
  commune?: string;
  city: string;
  street?: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  postalCode?: string;
}

type Person = {
  type: TaxPayerType.Person;
  nip?: string;
  pesel?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: number; // format: YYYY-MM-DD
  fatherName?: string;
  motherName?: string;
}

type Company = {
  type: TaxPayerType.Company;
  nip?: string;
  fullName?: string;
  shortName?: string;
}

type TaxPayer = Person | Company;

type PCCDeclaration = {
  declarationDate?: number; // format: YYYY-MM-DD
  transactionDate?: number; // format: YYYY-MM-DD
  taxOfficeCode?: string;
  taxPayer?: TaxPayer;
  address?: Address;
  transactionType?: TransactionType;
  transactionValue?: number;
  taxAmount?: number;
  transactionDescription?: string; // Brief description of the transaction, if it's a car puchase it should contain: Brand, Model, VIN, Registration number
  objectLocation?: ObjectLocation;
  transactionLocation?: ObjectLocation;
}

// Helper function to create PCC declaration XML
export function createPCCDeclarationXml(declaration: PCCDeclaration): string {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
  });

  const xmlObj = {
    Deklaracja: {
      Naglowek: {
        KodFormularza: {
          '#text': 'PCC-3',
          '@_kodSystemowy': 'PCC-3 (6)',
          '@_kodPodatku': 'PCC',
          '@_rodzajZobowiazania': 'Z',
          '@_wersjaSchemy': '1-0E',
        },
        WariantFormularza: 6,
        CelZlozenia: {
          '#text': 1,
          '@_poz': 'P_6',
        },
        Data: {
          '#text': declaration.transactionDate ? format(declaration.transactionDate, 'yyyy-MM-dd') : undefined,
          '@_poz': 'P_4',
        },
        KodUrzedu: declaration.taxOfficeCode,
      },
      Podmiot1: {
        '@_rola': 'Podatnik',
        ...(
          declaration.taxPayer ? {
            [declaration.taxPayer.type]: createTaxPayerData(declaration.taxPayer),
          } : {}
        ),
        AdresZamieszkaniaSiedziby: {
          '@_rodzajAdresu': 'RAD',
          ...(declaration.address ? { [declaration.address.type]: createAddressData(declaration.address) } : {}),
        },
      },
      PozycjeSzczegolowe: {
        P_7: declaration.taxPayer?.type,
        P_20: 1,
        P_21: declaration.objectLocation,
        P_22: declaration.transactionLocation,
        P_23: declaration.transactionDescription,
        ...getTransactionDetails(declaration),
        P_46: declaration.taxAmount,
        P_53: declaration.taxAmount,
      },
      Pouczenia: 1,
    },
  };

  return builder.build(xmlObj);
}

// Helper function to create taxPayer data
function createTaxPayerData(taxPayer: TaxPayer): object {
  if (taxPayer.type === TaxPayerType.Person) {
    return {
      NIP: taxPayer.nip,
      PESEL: taxPayer.pesel,
      ImiePierwsze: taxPayer.firstName,
      Nazwisko: taxPayer.lastName,
      DataUrodzenia: taxPayer.dateOfBirth ? format(taxPayer.dateOfBirth, 'yyyy-MM-dd') : undefined,
      ImieOjca: taxPayer.fatherName,
      ImieMatki: taxPayer.motherName,
    };
  } else {
    return {
      NIP: taxPayer.nip,
      PelnaNazwa: taxPayer.fullName,
      SkroconaNazwa: taxPayer.shortName,
    };
  }
}

// Helper function to create address data
function createAddressData(address: Address): object {
  const commonFields = {
    KodKraju: address.country,
    Miejscowosc: address.city,
    Ulica: address.street,
    NrDomu: address.buildingNumber,
    NrLokalu: address.apartmentNumber,
    KodPocztowy: address.postalCode,
  };

  if (address.type === AddressType.Polish) {
    return {
      ...commonFields,
      Wojewodztwo: address.voivodeship,
      Powiat: address.county,
      Gmina: address.commune,
    };
  } else {
    return commonFields;
  }
}

// Helper function to get transaction details
function getTransactionDetails(declaration: PCCDeclaration): object {
  switch (declaration.transactionType) {
    case TransactionType.CarPurchase:
      return {
        P_26: declaration.transactionValue, // taxBase
        P_27: declaration.taxAmount, // calculatedTax
      };
    case TransactionType.Loan:
      return {
        P_31: declaration.transactionValue, // taxBase
        P_32: 0.5, // taxRate
        P_33: declaration.taxAmount, // calculatedTax
      };
    default:
      return {};
  }
}
