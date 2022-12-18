const crypto = require("crypto");

/**
 * Refactoring:
 *
 * - Extracted the hashing function to make it easier to test
 * - The base case uses the hashing function to create the partition key
 * - Each edge case is extracted to a guard statement
 * - Prefer to not edge cases that have similar conditions but still are different
 *
 */

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

function deterministicPartitionKey(event, hashKeyFn = hashKey) {
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  if (
    event.partitionKey &&
    typeof event.partitionKey === "string" &&
    event.partitionKey.length < MAX_PARTITION_KEY_LENGTH
  ) {
    return event.partitionKey;
  }

  if (
    event.partitionKey &&
    JSON.stringify(event.partitionKey).length < MAX_PARTITION_KEY_LENGTH
  ) {
    return JSON.stringify(event.partitionKey);
  }

  const hashableData = event.partitionKey ?? event;
  const stringifiedData =
    typeof hashableData !== "string"
      ? JSON.stringify(hashableData)
      : hashableData;

  return hashKeyFn(stringifiedData);
}

function hashKey(key) {
  return crypto.createHash("sha3-512").update(key).digest("hex");
}

module.exports = {
  deterministicPartitionKey,
  TRIVIAL_PARTITION_KEY,
  MAX_PARTITION_KEY_LENGTH,
};
