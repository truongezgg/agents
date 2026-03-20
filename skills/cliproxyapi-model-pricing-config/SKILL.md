---
name: cliproxyapi-model-pricing-config
description: Research official API pricing for user-provided models, extract prompt/completion/cache token prices when documented, skip unsupported models, and generate a browser localStorage update script for cli-proxy-model-prices-v2.
metadata: {"clawdbot":{"emoji":"💸","primaryEnv":"","homepage":"","os":["darwin","linux","win32"]}}
---

# CLI Proxy API Model Pricing Config

Use this skill when you need to build or update local model pricing configuration from **official provider pricing documentation**.

The goal is to take a list of model names from the user, research each model on the internet, find official API pricing, normalize it into a shared format, skip anything that cannot be verified, and then generate a script the user can run in the browser console to update local storage.

## What You Must Do

Given model names from the user, you must:

1. Search the web for the model's **official pricing source**
2. Use **provider-owned documentation or pricing pages only**
3. Extract pricing for:
   - input tokens
   - output tokens
   - cached input tokens
4. Normalize the result into this structure:

```json
{
  "model-name": {
    "prompt": 2.5,
    "completion": 15,
    "cache": 0.25
  }
}
```

5. Skip any model if:
   - the model cannot be matched confidently to an official provider listing
   - pricing is only found on third-party sites
   - input or output price is missing
   - cached token price is not documented and cannot be verified officially
6. Generate a JavaScript snippet that writes the final object into browser local storage under this key:

```text
cli-proxy-model-prices-v2
```

## Output Contract

Always return these sections in order:

### 1. Official Sources Checked

For each model, list:
- provider
- official URL used
- whether pricing was found
- brief notes about any ambiguity

### 2. Accepted Models

Return only verified models in this JSON shape:

```json
{
  "model-a": {
    "prompt": 0,
    "completion": 0,
    "cache": 0
  }
}
```

Rules:
- values must be numeric
- do not include currency symbols
- use the official units as token pricing values normally expressed per 1M tokens unless the source clearly specifies something else
- if the source uses a different unit, convert it clearly and state that you converted it
- preserve the exact user-facing model identifier when possible, but only if it maps confidently to the official listing

### 3. Skipped Models

For every skipped model, explain why it was excluded:
- not found in official docs
- cache price missing in official docs
- ambiguous model mapping
- unofficial source only
- pricing page inaccessible or unverifiable

### 4. localStorage Update Script

Generate a ready-to-run browser console script that:
- reads the current value from `localStorage`
- safely parses existing JSON
- merges in the verified models
- writes back to `cli-proxy-model-prices-v2`
- logs the final stored value
- does not erase unrelated existing entries unless the user explicitly asked for replacement

Use this script pattern:

```js
(() => {
  const key = 'cli-proxy-model-prices-v2';

  let current = {};
  try {
    const raw = localStorage.getItem(key);
    current = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to parse existing localStorage value, resetting to empty object.', err);
    current = {};
  }

  const updates = {
    "example-model": {
      prompt: 1,
      completion: 2,
      cache: 0.1
    }
  };

  const next = {
    ...current,
    ...updates
  };

  localStorage.setItem(key, JSON.stringify(next));
  console.log('Updated localStorage key:', key);
  console.log(next);
})();
```

Replace `updates` with the verified pricing data you found.

## Source Quality Rules

Accepted sources:
- official provider pricing pages
- official provider API docs
- official provider model docs that explicitly include pricing

Rejected sources:
- blog posts
- forum discussions
- GitHub issues
- aggregator websites
- AI-generated summaries
- unofficial SDK docs
- screenshots without official page context

If you cannot verify pricing from an official source, skip the model.

## Backup Verification Source

You may use OpenCode Zen as a backup source for discovery, cross-checking, or finding likely official pricing pages:

- OpenCode Zen docs: `https://opencode.ai/docs/zen/`

Rules for using OpenCode Zen:
- use it only as a secondary verification aid
- do not use it as the primary authority when official provider docs are available
- do not accept OpenCode Zen alone as sufficient proof of pricing
- always trace any pricing data back to an official provider-owned or official platform-hosted source before including a model in the final output
- if OpenCode Zen suggests a model or price but you cannot confirm it from an official source, skip that model

## Preferred Official Provider Sources

Use these official provider-owned sources as the first places to check before broader searching.

### OpenAI
- Pricing: `https://platform.openai.com/docs/pricing`
- Models: `https://platform.openai.com/docs/models`
- Docs home: `https://platform.openai.com/docs`

### Anthropic / Claude
- Pricing: `https://docs.anthropic.com/en/docs/about-claude/pricing`
- Models overview: `https://docs.anthropic.com/en/docs/about-claude/models/overview`
- Docs home: `https://docs.anthropic.com/`

### Google Gemini
- Pricing: `https://ai.google.dev/gemini-api/docs/pricing`
- Models: `https://ai.google.dev/gemini-api/docs/models`
- Docs home: `https://ai.google.dev/gemini-api/docs`

### Alibaba Cloud Model Studio
Use Alibaba Cloud Model Studio as an official source for:
- Qwen pricing and model pages
- official hosted pricing pages for third-party models exposed through Model Studio

Recommended official starting points:
- Model list: `https://www.alibabacloud.com/help/en/model-studio/models`
- Billing and pricing docs: `https://www.alibabacloud.com/help/en/model-studio/billing-of-model-studio`

Alibaba Cloud Model Studio is an acceptable official source for these hosted model families when pricing is documented there:
- `Qwen`
- `Kimi`
- `MiniMax`
- `GLM`

## Provider Search Order

When the user gives a model name, check sources in this order:

1. The model provider's official pricing page
2. The model provider's official model documentation
3. If the model is offered through an official first-party platform page with explicit pricing for that hosted model, use that page

Examples:
- OpenAI models -> use OpenAI docs first
- Claude models -> use Anthropic docs first
- Gemini models -> use Google Gemini docs first
- Qwen models -> use Alibaba Cloud Model Studio docs first
- `kimi-*`, `MiniMax-*`, and `glm-*` may be verified from Alibaba Cloud Model Studio when that official page explicitly lists pricing for the hosted model

## Pricing Mode Defaults

Unless the user asks for something else, use:
- standard pricing
- paid tier pricing
- text token pricing
- non-batch pricing
- non-priority pricing
- non-regional uplift pricing
- default context tier or the lowest standard tier clearly listed for the model

If the source only gives multiple tiered prices based on prompt length:
- use the default lowest standard tier only if the skill can clearly justify that choice
- otherwise skip the model and explain that pricing is tiered and ambiguous for normalization

## Pricing Extraction Rules

Map the fields like this:

- `prompt` = input token price
- `completion` = output token price
- `cache` = cached input token price

If an official page uses different wording, map carefully:
- "input" -> `prompt`
- "output" -> `completion`
- "cached input", "cache read", or equivalent -> `cache`

Provider-specific cache mapping:
- OpenAI: use `Cached input`
- Anthropic: use `Cache Hits & Refreshes`
- Google Gemini: use `Context caching price`
- Alibaba Cloud / Qwen: use explicit `context cache`, `cache hit`, or officially documented cached-input discount only if the effective cached token price is stated clearly enough to normalize
- Ignore cache storage-only prices such as hourly cache storage fees
- Ignore cache write prices unless the user explicitly asks for cache write pricing and the output schema is updated accordingly

Do not guess.

If the provider distinguishes between:
- cache write vs cache read
- batch vs standard pricing
- region-specific pricing
- image/audio/token modality pricing

Then use the **default standard text token pricing** unless the user asked for a special mode. If there is no clear standard text price for the requested model, skip it and explain why.

## Model Matching Rules

Users may provide model names in a local alias format. You should:

1. Try to match the exact model name first
2. If no exact match exists, check whether it is clearly an alias to an official model
3. Only accept an alias if the mapping is high confidence
4. If multiple official models could match, treat it as ambiguous and skip

Examples:
- exact official model IDs are preferred
- internal app aliases should not be guessed unless the user explicitly maps them

## Handling Missing Cache Pricing

Cached token pricing is required for inclusion in the final object.

If official documentation includes input and output pricing but does **not** include cached token pricing:
- do not invent or infer it
- do not copy prompt price into cache
- do not estimate a discount
- do not derive cache price from a percentage discount unless the source explicitly provides a directly usable cached-input token rate for the same pricing mode
- skip that model
- explain that cache price was not officially documented

If a provider only documents cache storage pricing, cache write multipliers, or cache discount behavior without a clearly normalizable cached-input token price:
- skip that model
- explain which cache information existed and why it was insufficient

## Data Format

The final accepted object must look like this example:

```json
{
  "gpt-5.4": {
    "prompt": 2.5,
    "completion": 15,
    "cache": 0.25
  },
  "gpt-5.3-codex": {
    "prompt": 14,
    "completion": 1.75,
    "cache": 0.175
  },
  "gpt-5.4-mini": {
    "prompt": 0.175,
    "completion": 4.5,
    "cache": 0.0175
  },
  "claude-opus-4-6-thinking": {
    "prompt": 5,
    "completion": 25,
    "cache": 0.5
  }
}
```

Store it in local storage under:

```text
cli-proxy-model-prices-v2
```

## Working Style

Be concise but precise.

When reporting results:
- include the official source URL for every accepted model
- clearly state when a model was skipped
- never mix verified and unverified entries
- prefer fewer correct entries over more speculative ones

## Recommended Response Template

Use this structure:

```md
## Official Sources Checked

- `model-name` — Provider: `provider-name`
  - Source: `https://official-url`
  - Status: Found / Skipped
  - Notes: brief explanation

## Accepted Models

```json
{
  "model-name": {
    "prompt": 1,
    "completion": 2,
    "cache": 0.1
  }
}
```

## Skipped Models

- `model-name` — reason

## localStorage Update Script

```js
(() => {
  const key = 'cli-proxy-model-prices-v2';

  let current = {};
  try {
    const raw = localStorage.getItem(key);
    current = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to parse existing localStorage value, resetting to empty object.', err);
    current = {};
  }

  const updates = {
    "model-name": {
      prompt: 1,
      completion: 2,
      cache: 0.1
    }
  };

  const next = {
    ...current,
    ...updates
  };

  localStorage.setItem(key, JSON.stringify(next));
  console.log('Updated localStorage key:', key);
  console.log(next);
})();
```
```

## Important Guardrails

- Official sources only
- No guessing
- No estimated cache prices
- Skip unverifiable models
- Merge into existing local storage by default
- Keep numeric values clean and machine-readable
- If all models are skipped, still provide:
  - source-check summary
  - skipped reasons
  - a safe script with an empty `updates` object