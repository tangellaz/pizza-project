export const resolve = async(promise: Promise<string|null>) => {
  type resolvedType = {
    data: string | null,
    error: string | null
  }

  const resolved:resolvedType = {
    data: null,
    error: null
  }

  try {
    resolved.data = await promise
  } catch(e: any) {
    resolved.error = e
  }

  return resolved
}