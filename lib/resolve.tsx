export const resolve = async (promise: Promise<Response>) => {
  type resolvedType = {
    data: Response | null;
    error: any;
  };

  const resolved: resolvedType = {
    data: null,
    error: null,
  };

  try {
    resolved.data = await promise;
  } catch (e: any) {
    resolved.error = e;
  }

  return resolved;
};
