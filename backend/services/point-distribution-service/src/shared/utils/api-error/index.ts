export const ApiError = (statusCode: number, message: string) => {
    const err = new Error(message);
    Object.assign(err, { statusCode });
    return err as Error & { statusCode: number };
};
