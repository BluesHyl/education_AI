/**
 * 指数退避重试机制
 * @param operation 需要重试的操作
 * @param maxRetries 最大重试次数
 * @param initialDelay 初始延迟时间(ms)
 * @returns Promise<T>
 */
export const exponentialBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let retries = 0;
  let delay = initialDelay;

  const execute = async (): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }

      retries++;
      delay *= 2; // 指数增加延迟时间

      await new Promise((resolve) => setTimeout(resolve, delay));
      return execute();
    }
  };

  return execute();
};
