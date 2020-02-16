import axios, { AxiosResponse, AxiosError } from "axios";

export type NameApiResponse = {
  err: number;
  name: string[][];
};

export function fetchName(dataCount: number) {
  return axios.get<string>(
    `https://green.adam.ne.jp/roomazi/cgi-bin/randomname.cgi?n=${dataCount}`
  );
}

export function decode(result: string): NameApiResponse {
  const _result = result.replace("callback(", "").replace(")", "");
  const resultJson = JSON.parse(_result);
  if (!("err" in resultJson) || !("name" in resultJson)) {
    throw Error("レスポンスエラー");
  }
  if (resultJson.err === 1) {
    throw Error("err = 1 異常あり");
  }
  return resultJson;
}

export async function getName(dataCount: number) {
  const response = await fetchName(dataCount).catch((error: AxiosError) => {
    throw Error("fetch name api error");
  });
  const data = decode(response.data);
  return {
    ...data,
    name: data.name.map(nameSet => {
      return nameSet.map(name => name.split(" "));
    })
  }.name;
}
