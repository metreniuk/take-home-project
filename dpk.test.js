const {
  deterministicPartitionKey,
  TRIVIAL_PARTITION_KEY,
  MAX_PARTITION_KEY_LENGTH,
} = require("./dpk");

describe("deterministicPartitionKey", () => {
  it(`Returns the literal '${TRIVIAL_PARTITION_KEY}' when given no input`, () => {
    const expectedKey = "0";
    const actualKey = deterministicPartitionKey();

    expect(actualKey).toBe(expectedKey);
  });

  it(`Returns the partitionKey from the event if its length is less than ${MAX_PARTITION_KEY_LENGTH}`, () => {
    const expectedKey = "test partition key";
    const event = { partitionKey: expectedKey };
    const actualKey = deterministicPartitionKey(event);

    expect(actualKey).toBe(expectedKey);
  });

  it(`Returns the partitionKey from the event converted to string`, () => {
    const event = { partitionKey: 1231 };
    const expectedKey = "1231";
    const actualKey = deterministicPartitionKey(event);

    expect(actualKey).toBe(expectedKey);
  });

  it(`Returns the hash of the partitionKey from the event if its length is greater than ${MAX_PARTITION_KEY_LENGTH}`, () => {
    const expectedKey = "test key";
    const hashMock = () => expectedKey;
    const testPartitionKey = "*".repeat(MAX_PARTITION_KEY_LENGTH + 1);
    const event = { partitionKey: testPartitionKey };
    const actualKey = deterministicPartitionKey(event, hashMock);

    expect(actualKey).not.toBe(testPartitionKey);
    expect(actualKey.length).toBeLessThan(MAX_PARTITION_KEY_LENGTH);
    expect(actualKey).toBe(expectedKey);
  });

  it(`Returns the hashed event if it doesn't have a partitionKey`, () => {
    const expectedKey = "test key";
    const hashMock = () => expectedKey;
    const event = { randomTestKey: 1231 };
    const actualKey = deterministicPartitionKey(event, hashMock);

    expect(actualKey).toBe(expectedKey);
  });
});
