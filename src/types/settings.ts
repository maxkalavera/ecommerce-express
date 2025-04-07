
export default interface Settings {
    ENV: "production" | "development",
  PORT: number;
  DB: {
    URL: string;
    HOST: string;
    NAME: string;
    PORT: number;
    USER: string;
    PASSWORD: string;
  },
  RUNTIME_FOLDER: string;
  DEV_DATA_FOLDER: string;
}