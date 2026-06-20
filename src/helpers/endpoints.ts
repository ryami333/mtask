export type Endpoint<T extends string, A, B> = {
  channel: T;
  handler: (args: A) => Promise<B>;
};

export function createEndpoint<const T extends string, A, B>(
  endpoint: Endpoint<T, A, B>,
) {
  return endpoint;
}

export function createEndpoints<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T extends readonly Endpoint<string, any, any>[],
>(endpoints: T): T {
  return endpoints;
}
