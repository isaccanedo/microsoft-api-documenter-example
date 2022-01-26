/**
 * Does xyz
 * @returns {Promise<{
 *   pass: number,
 *   fail: number
 * }>}
 */
export async function run() {
  return Promise.resolve({
    pass: 1,
    fail: 3,
  })
}
