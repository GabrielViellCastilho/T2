export interface CountryData {
  name: string | null;
  cca2: string | null;
  currencySymbol: string | null;
  subregion: string | null;
  language: string | null;
  population: number | null;
  flagUrl: string | null;
  gdpPerCapita: number | null;
  inflation: number | null;
}

export interface Currency {
  symbol?: string;
  name?: string;
}

export async function getInflationByCountry(countryCode: string): Promise<number | null> {
  try {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/FP.CPI.TOTL.ZG?format=json&per_page=1`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Error fetching inflation data:", response.status);
      return null;
    }

    const json = await response.json();

    const dataList = json[1];
    if (!dataList || dataList.length === 0) return null;

    const value = dataList[0].value;

    if (value === null || value === undefined) return null;

    return Number(value.toFixed(2));
  } catch (error) {
    console.error("Request error in getInflationByCountry:", error);
    return null;
  }
}

export async function getGdpPerCapitaByCountry(countryCode: string): Promise<number | null> {
  try {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.PCAP.CD?format=json&per_page=1`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Error fetching GDP per capita:", response.status);
      return null;
    }

    const json = await response.json();

    const dataArray = json[1];
    if (!dataArray || dataArray.length === 0) {
      console.error("No GDP per capita data found for this country.");
      return null;
    }

    const value = dataArray[0].value;
    if (value === null || value === undefined) {
      console.error("GDP per capita value is null or undefined.");
      return null;
    }

    return Number((value as number).toFixed(2));
  } catch (error) {
    console.error("Request error in getGdpPerCapitaByCountry:", error);
    return null;
  }
}

export async function getCountryData(countryName: string): Promise<CountryData | null> {
  try {
    const countryRes = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (!countryRes.ok) throw new Error("Country not found");

    const countryJson = await countryRes.json();
    const country = countryJson[0];

    const name = country?.name?.common ?? null;
    const cca2 = country?.cca2 ?? null;

    // Currency
    let currencySymbol: string | null = null;
    if (country?.currencies && typeof country.currencies === "object") {
      const currencyValues: Currency[] = Object.values(country.currencies) as Currency[];
      if (currencyValues.length > 0 && currencyValues[0]?.symbol) {
        currencySymbol = currencyValues[0].symbol ?? null;
      }
    }

    // Language
    let language: string | null = null;
    if (country?.languages && typeof country.languages === "object") {
      const languageValues = Object.values(country.languages);
      if (languageValues.length > 0 && typeof languageValues[0] === "string") {
        language = languageValues[0];
      }
    }

    const subregion = country?.subregion ?? null;
    const population = country?.population ?? null;
    const flagUrl = country?.flags?.png ?? null;

    // GDP per capita
    let gdpPerCapita: number | null = null;
    if (cca2) {
      const gdpRes = await fetch(
        `https://api.worldbank.org/v2/country/${cca2}/indicator/NY.GDP.PCAP.CD?format=json&per_page=1`
      );
      const gdpJson = await gdpRes.json();
      const gdpValue = gdpJson?.[1]?.[0]?.value ?? null;
      gdpPerCapita = gdpValue !== null ? Number(gdpValue.toFixed(2)) : null;
    }

    // Inflation
    let inflation: number | null = null;
    if (cca2) {
      const inflationRes = await fetch(
        `https://api.worldbank.org/v2/country/${cca2}/indicator/FP.CPI.TOTL.ZG?format=json&per_page=1`
      );
      const inflationJson = await inflationRes.json();
      const inflationValue = inflationJson?.[1]?.[0]?.value ?? null;
      inflation = inflationValue !== null ? Number(inflationValue.toFixed(2)) : null;
    }

    return {
      name,
      cca2,
      currencySymbol,
      subregion,
      language,
      population,
      flagUrl,
      gdpPerCapita,
      inflation,
    };
  } catch (error) {
    console.error("Error fetching country data:", error);
    return null;
  }
}