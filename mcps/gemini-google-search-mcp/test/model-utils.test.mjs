import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_MODEL, normalizeModel } from "../model-utils.mjs";

test("uses gemini-3-flash when model is missing", () => {
  assert.equal(normalizeModel(), DEFAULT_MODEL);
  assert.equal(normalizeModel(""), DEFAULT_MODEL);
  assert.equal(normalizeModel("   "), DEFAULT_MODEL);
});

test("preserves explicit model names without preview suffixes", () => {
  assert.equal(normalizeModel("gemini-3-pro"), "gemini-3-pro");
  assert.equal(normalizeModel(" gemini-3-flash "), "gemini-3-flash");
});

test("strips preview suffixes and trailing version tags", () => {
  assert.equal(normalizeModel("gemini-3-flash-preview"), "gemini-3-flash");
  assert.equal(normalizeModel("gemini-3-flash-preview-03-25"), "gemini-3-flash");
  assert.equal(normalizeModel("gemini-2.5-pro-preview-05-20"), "gemini-2.5-pro");
});
