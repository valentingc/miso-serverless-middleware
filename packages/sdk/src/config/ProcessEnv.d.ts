declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    MISO_HOST_PORT?: string;
    MISO_HOST_IP?: string;
    MISO_REPLICA_ID?: string;
    MISO_NODE_NAME?: string;
    MISO_FUNCTION_NAME?: string;
  }
}
