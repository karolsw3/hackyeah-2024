import { XMLBuilder } from 'fast-xml-parser';
import { findCommuneCode, findCountyCode, findVoivodeshipCode, getCommuneName, getCountyName, getVoivodeshipName } from '../teryt';
import { add } from 'date-fns';

// Enums and types for form fields
enum TaxPayerType {
  Person = 'OsobaFizyczna',
  Company = 'OsobaNiefizyczna',
}

enum TaxPayerDeclarationType {
  SOLIDARITY = '1', // Partial car ownership
  OTHER = '5' // Other
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
  town: string;
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
  dateOfBirth?: string; // format: YYYY-MM-DD
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
  declarationDate?: string; // format: YYYY-MM-DD
  transactionDate?: string; // format: YYYY-MM-DD
  taxOfficeCode?: string;
  taxPayer?: TaxPayer;
  address?: Address;
  transactionType?: TransactionType;
  transactionValue?: number;
  taxAmount?: number;
  transactionDescription?: string; // Brief description of the transaction, if it's a car puchase it should contain: Brand, Model, VIN, Registration number
  objectLocation?: ObjectLocation;
  transactionLocation?: ObjectLocation;
  taxPayerDeclarationType?: TaxPayerDeclarationType;
  termsAccepted?: boolean;
}

// Helper function to create PCC declaration XML
export async function createPCCDeclarationXml(declaration: PCCDeclaration): Promise<string> {
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
          '#text': declaration.transactionDate,
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
          ...(declaration.address ? { [declaration.address.type]: await createAddressData(declaration.address) } : {}),
        },
      },
      PozycjeSzczegolowe: {
        P_7: declaration.taxPayerDeclarationType,
        P_20: 1,
        P_21: declaration.objectLocation,
        P_22: declaration.transactionLocation,
        P_23: declaration.transactionDescription,
        ...getTransactionDetails(declaration),
        P_46: declaration.taxAmount,
        P_53: declaration.taxAmount,
      },
      Pouczenia: declaration.termsAccepted ? 1 : 0,
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
      DataUrodzenia: taxPayer.dateOfBirth,
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
async function createAddressData(address: Address): Promise<object> {
  let voivodeship: string | null | undefined = address.voivodeship;
  let county: string | null | undefined = address.county;
  let commune: string | null | undefined = address.commune;
  if (address.voivodeship) {
    const voivodeshipCode = await findVoivodeshipCode(address.voivodeship);
    if (voivodeshipCode) {
      voivodeship = await getVoivodeshipName(voivodeshipCode);
      if (address.county) {
        const countyCode = await findCountyCode(voivodeshipCode, address.county);
        if (countyCode) {
          county = await getCountyName(voivodeshipCode, countyCode);
          if (address.commune) {
            const communeCode = await findCommuneCode(voivodeshipCode, countyCode, address.commune);
            if (communeCode) {
              commune = await getCommuneName(voivodeshipCode, countyCode, communeCode);
            }
          }
        }
      }
    }
  }

  const commonFields = {
    KodKraju: address.country,
    Miejscowosc: address.town,
    Ulica: address.street,
    NrDomu: address.buildingNumber,
    NrLokalu: address.apartmentNumber,
    KodPocztowy: address.postalCode,
  };

  if (address.type === AddressType.Polish) {
    return {
      ...commonFields,
      Wojewodztwo: voivodeship?.toUpperCase(),
      Powiat: county?.toUpperCase(),
      Gmina: commune?.toUpperCase()
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
