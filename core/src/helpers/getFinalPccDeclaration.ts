import { format } from "date-fns/format";
import { PccTaxDeclaration, PccTaxDeclarationType } from "../interfaces/PccTaxDeclaration.interface";

// TODO: Add missing attributes from XML

const TAX_RATE_BY_TYPE: Record<PccTaxDeclarationType, number> = {
  [PccTaxDeclarationType.CAR]: 0.02,
  [PccTaxDeclarationType.MONEY_LENDING]: 0.005,
}

export const getFinalPccDeclarationJson = ({
  agreementDate,
  taxOfficeNumber,
  taxPayer,
  objectTaxation,
  objectLocation,
  transactionLocation,
  objectDescription,
  objectPrice,
  numberOfAttachedForms,
  type
}: PccTaxDeclaration) => {
  const Naglowek = {
    KodFormularza: "PCC-3",
    WariantFormularza: 6,
    CelZlozenia: 1,
    Data: agreementDate ? format(agreementDate, "yyyy-MM-dd") : null,
    KodUrzedu: taxOfficeNumber,
  };

  const OsobaFizyczna = taxPayer && {
    PESEL: taxPayer.pesel,
    ImiePierwsze: taxPayer.firstName,
    Nazwisko: taxPayer.lastName,
    DataUrodzenia: format(taxPayer.dateOfBirth, "yyyy-MM-dd"),
    ImieOjca: taxPayer.fatherName || "",
    ImieMatki: taxPayer.motherName || "",
  };

  let addressKey: null | "AdresZagr" | "AdresPol" = null;
  let address: any = null;

  if (taxPayer?.address) {
    addressKey = "country" in taxPayer.address ? "AdresZagr" : "AdresPol";
    if (
      'voivodeship' in taxPayer.address &&
      'district' in taxPayer.address &&
      'commune' in taxPayer.address &&
      taxPayer.address.country === "PL"
    ) {
      address = {
        KodKraju: "PL",
        Wojewodztwo: taxPayer.address.voivodeship,
        Powiat: taxPayer.address.district,
        Gmina: taxPayer.address.commune,
        Ulica: taxPayer.address.street,
        NrDomu: taxPayer.address.houseNumber,
        NrLokalu: taxPayer.address.flatNumber,
        Miejscowosc: taxPayer.address.city,
        KodPocztowy: taxPayer.address.postalCode,
      }
    } else {
      address = {
        KodKraju: taxPayer.address.country,
        KodPocztowy: taxPayer.address.postalCode,
        Miejscowosc: taxPayer.address.city,
        Ulica: taxPayer.address.street,
        NrDomu: taxPayer.address.houseNumber,
        NrLokalu: taxPayer.address.flatNumber,
      }
    }
  }

  const declaration: any = {
    Deklaracja: {
      Naglowek,
      Podmiot1: {
        OsobaFizyczna,
      },
      PozycjeSzczegolowe: {
        P_4: agreementDate ? format(agreementDate, "yyyy-MM-dd") : null,
        P_6: 1,
        P_7: taxPayer?.type,
        P_20: objectTaxation,
        P_21: objectLocation,
        P_22: transactionLocation,
        P_23: objectDescription,
        P_62: numberOfAttachedForms,
      },
      Pouczenia: 1,
    },
  };

  if (type && objectPrice) {
    const TAX_RATE = TAX_RATE_BY_TYPE[type];
    const calculatedTax = objectPrice * TAX_RATE;
    const totalTax = calculatedTax;
    const taxToBePaid = totalTax;
    declaration.Deklaracja.PozycjeSzczegolowe.P_24 = objectPrice;
    declaration.Deklaracja.PozycjeSzczegolowe.P_25 = calculatedTax;
    declaration.Deklaracja.PozycjeSzczegolowe.P_46 = totalTax;
    declaration.Deklaracja.PozycjeSzczegolowe.P_53 = taxToBePaid;
  }

  if (addressKey && address) {
    declaration.Deklaracja.Podmiot1[addressKey] = address
  }

  return declaration;
};
