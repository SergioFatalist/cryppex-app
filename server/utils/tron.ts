import { TronWeb } from "tronweb";
import type { AxiosRequestHeaders } from "axios";

interface Headers extends AxiosRequestHeaders {
  "TRON-PRO-API-KEY": string;
}

const config = useRuntimeConfig();

const tron = new TronWeb({
  fullHost: config.tron.fullHost,
  privateKey: config.tron.privateKey,
  headers: config.tron.apiKey
    ? <Headers>{
        "TRON-PRO-API-KEY": config.tron.apiKey,
      }
    : undefined,
});

export default tron;
