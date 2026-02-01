declare namespace NodeJS {
  interface Process {
    client: boolean
    server: boolean
  }
}

declare const process: Process

