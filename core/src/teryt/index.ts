import csv2json from 'csvtojson';
import Fuse from 'fuse.js';
import path from 'path';

export const getVoivodeshipName = async (voivodeshipCode: number): Promise<string | null> => {
  const data = await csv2json({ delimiter: ';' }).fromFile(path.join(__dirname, 'terc.csv'))
  const voivodeship = data.find(e => parseInt(e.WOJ) === voivodeshipCode && e.NAZWA_DOD === 'województwo') as {
    WOJ: string;
    POW: string;
    GMI: string;
    RODZ: string;
    NAZWA: string;
    NAZWA_DOD: string;
    STAN_NA: string;
  }
  return voivodeship?.NAZWA ?? null;
}

export const findVoivodeshipCode = async (voivodeshipText: string): Promise<number | null> => {
  const data = await csv2json({ delimiter: ';' }).fromFile(path.join(__dirname, 'terc.csv'))
  const voivodeships = data.filter(e => e.NAZWA_DOD === 'województwo') as {
    WOJ: string;
    POW: string;
    GMI: string;
    RODZ: string;
    NAZWA: string;
    NAZWA_DOD: string;
    STAN_NA: string;
  }[]
  const fuse = new Fuse(voivodeships, {
    includeScore: true,
    keys: ['NAZWA']
  });
  const results = fuse.search(voivodeshipText)
  const result = results.sort((a, b) => {
    if (!a.score) {
      return 1;
    }
    if (!b.score) {
      return -1;
    }
    return a.score - b.score;
  })[0]?.item
  if (!result) return null;
  return parseInt(result.WOJ);
};

export const getCountyName = async (voivodeshipCode: number, countyCode: number): Promise<string | null> => {
  const data = await csv2json({ delimiter: ';' }).fromFile(path.join(__dirname, 'terc.csv'))
  const county = data.find(e => parseInt(e.WOJ) === voivodeshipCode && parseInt(e.POW) === countyCode && e.NAZWA_DOD === 'powiat') as {
    WOJ: string;
    POW: string;
    GMI: string;
    RODZ: string;
    NAZWA: string;
    NAZWA_DOD: string;
    STAN_NA: string;
  }
  return county?.NAZWA ?? null;
}

export const findCountyCode = async (voivodeshipCode: number, countyText: string): Promise<number | null> => {
  const data = await csv2json({ delimiter: ';' }).fromFile(path.join(__dirname, 'terc.csv'))
  const counties = data.filter(e => parseInt(e.WOJ) === voivodeshipCode && e.NAZWA_DOD === 'powiat') as {
    WOJ: string;
    POW: string;
    GMI: string;
    RODZ: string;
    NAZWA: string;
    NAZWA_DOD: string;
    STAN_NA: string;
  }[]
  const fuse = new Fuse(counties, {
    includeScore: true,
    keys: ['NAZWA']
  });
  const results = fuse.search(countyText)
  const result = results.sort((a, b) => {
    if (!a.score) {
      return 1;
    }
    if (!b.score) {
      return -1;
    }
    return a.score - b.score;
  })[0]?.item
  if (!result) return null;
  return parseInt(result.POW);
}

export const getCommuneName = async (voivodeshipCode: number, countyCode: number, communeCode: number): Promise<string | null> => {
  const data = await csv2json({ delimiter: ';' }).fromFile(path.join(__dirname, 'terc.csv'))
  const commune = data.find(e => (
    parseInt(e.WOJ) === voivodeshipCode &&
    parseInt(e.POW) === countyCode &&
    parseInt(e.GMI) === communeCode &&
    e.NAZWA_DOD.includes('gmina')
  )) as {
    WOJ: string;
    POW: string;
    GMI: string;
    RODZ: string;
    NAZWA: string;
    NAZWA_DOD: string;
    STAN_NA: string;
  }
  return commune?.NAZWA ?? null;
}

export const findCommuneCode = async (voivodeshipCode: number, countyCode: number, communeText: string): Promise<number | null> => {
  const data = await csv2json({ delimiter: ';' }).fromFile(path.join(__dirname, 'terc.csv'))
  const communes = data.filter(e => (
    parseInt(e.WOJ) === voivodeshipCode &&
    parseInt(e.POW) === countyCode &&
    e.NAZWA_DOD.includes('gmina')
  )) as {
    WOJ: string;
    POW: string;
    GMI: string;
    RODZ: string;
    NAZWA: string;
    NAZWA_DOD: string;
    STAN_NA: string;
  }[]
  const fuse = new Fuse(communes, {
    includeScore: true,
    keys: ['NAZWA']
  });
  const results = fuse.search(communeText)
  const result = results.sort((a, b) => {
    if (!a.score) {
      return 1;
    }
    if (!b.score) {
      return -1;
    }
    return a.score - b.score;
  })[0]?.item
  if (!result) return null;
  return parseInt(result.GMI);
}
