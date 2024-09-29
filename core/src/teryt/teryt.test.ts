import { expect, test } from "bun:test";
import { findCommuneCode, findCountyCode, findVoivodeshipCode, getCommuneName, getCountyName, getVoivodeshipName  } from ".";

test("małopolskie voivodeship", async () => {
  const code = await findVoivodeshipCode("małopolskie");
  expect(code).toBe(12);
  const name = await getVoivodeshipName(code!);
  expect(name).toBe("MAŁOPOLSKIE");
});

test("dolnośląskie voivodeship", async () => {
  const code = await findVoivodeshipCode("dolnośląskie");
  expect(code).toBe(2);
  const name = await getVoivodeshipName(code!);
  expect(name).toBe("DOLNOŚLĄSKIE");
});

test("wadowicki county", async () => {
  const code = await findCountyCode(12, "wadowicki");
  expect(code).toBe(18);
  const name = await getCountyName(12, code!);
  expect(name).toBe("wadowicki");
});

test("lanckorona commune", async () => {
  const code = await findCommuneCode(12, 18, "lanckorona");
  expect(code).toBe(4);
  const name = await getCommuneName(12, 18, code!);
  expect(name).toBe("Lanckorona");
});
