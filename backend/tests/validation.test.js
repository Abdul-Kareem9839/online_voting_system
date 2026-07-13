const test = require("node:test");
const assert = require("node:assert/strict");
const { validateLoginVerifyOtp } = require("../middlewares/validation");

test("validateLoginVerifyOtp accepts email and otp without election_id", () => {
  let nextCalled = false;
  const req = {
    body: {
      email: "voter@example.com",
      otp: "123456",
    },
  };
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  validateLoginVerifyOtp(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});
