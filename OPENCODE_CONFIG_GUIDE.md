# Opencode Configuration Guide for Beginners

## AI Agent Prompt For Updating Models

Use this prompt when you want a coding agent to update your local opencode config in `~/.config/opencode/opencode.json`.

```text
Update only `~/.config/opencode/opencode.json`.

Before making any changes, read this guide:
https://raw.githubusercontent.com/truongezgg/agents/refs/heads/main/OPENCODE_CONFIG_GUIDE.md

For general opencode documentation, also use:
https://opencode.ai/docs

For config documentation, also use:
https://opencode.ai/docs/config/

For provider documentation, also use:
https://opencode.ai/docs/providers/

Required workflow:

1. Read "Sample Configuration File".
2. Show all available providers.
3. Under each provider, show all exact model names exactly as written in the provider data.
4. Ask me to reply with one or more exact model names that I want to update.
5. Do not edit anything until I reply.
6. After I reply, check the latest official model data only for the selected model(s).
7. Read my current `~/.config/opencode/opencode.json`.
8. Compare the selected model entries against the official data.
9. Update only the selected model entries in `~/.config/opencode/opencode.json`.
10. Preserve the existing JSON structure, field naming, and formatting style.
11. Do not rename models.
12. Do not guess missing values.
13. If any field cannot be verified from an official source, leave it unchanged and report it.
14. Do not modify any unselected model.
15. Do not edit any other file.

Final response must include:
- selected model names
- what changed
- what was left unchanged because it could not be verified
- any manual follow-up needed
```

## What is Opencode?

Opencode is a powerful CLI tool that helps with software engineering tasks. It connects to various AI models to assist with coding, debugging, and development workflows.

Official docs: https://opencode.ai/docs

Config docs: https://opencode.ai/docs/config/

Providers docs: https://opencode.ai/docs/providers/

## Understanding the Configuration

The configuration file defines which AI models are available to use with opencode. Here's what you need to know:

### Models Available

The configuration contains several AI models from different providers:

#### OpenAI Models
- **gpt-5.4**: Most powerful model with high reasoning capabilities
- **gpt-5.4-mini**: Lighter version of gpt-5.4
- **gpt-5.3-codex**: Optimized for coding tasks
- **gpt-5.1-codex-mini**: Lightweight coding-focused model

#### Anthropic Models
- **claude-opus-4-6-thinking**: High-level reasoning model
- **claude-sonnet-4-6**: Balanced performance model

#### Alibaba/Qwen Models
- **qwen3-coder-plus**: Coding-optimized model
- **qwen3-coder-flash**: Fast coding model

#### Google Models
- **gemini-3.1-pro-high**: High-performance multimodal model
- **gemini-3-flash**: Efficient multimodal model

### Key Configuration Values

Each model has the following properties:

- **Context Limit**: How much information the model can process at once (in tokens)
  - Higher = can work with larger files or more complex conversations
- **Output Limit**: Maximum response length (in tokens)
- **Modalities**: What types of input/output the model supports
  - Text, image, PDF, audio, video (varies by model)

### Reasoning Effort Levels

Many models offer different "thinking effort" levels:
- **Low**: Fastest response, suitable for simple tasks
- **Medium**: Good balance of speed and reasoning
- **High**: More thorough analysis, slower response
- **X-High**: Most comprehensive reasoning, slowest response

### Sample Configuration File

We've provided a sample configuration file called `opencode.sample.json` that includes all available models. You can use this as a starting point:

```json
{
  "models": {
    "gpt-5.4": {
      "name": "gpt-5.4",
      "limit": {
        "context": 1050000,
        "output": 128000
      },
      "modalities": {
        "input": [
          "text",
          "image",
          "pdf"
        ],
        "output": [
          "text"
        ]
      },
      "variants": {
        "low": {
          "reasoningEffort": "low"
        },
        "medium": {
          "reasoningEffort": "medium"
        },
        "high": {
          "reasoningEffort": "high"
        },
        "xhigh": {
          "reasoningEffort": "xhigh"
        }
      }
    },
    "gpt-5.4-mini": {
      "name": "gpt-5.4-mini",
      "limit": {
        "context": 400000,
        "output": 128000
      },
      "modalities": {
        "input": [
          "text",
          "image",
          "pdf"
        ],
        "output": [
          "text"
        ]
      },
      "variants": {
        "low": {
          "reasoningEffort": "low"
        },
        "medium": {
          "reasoningEffort": "medium"
        },
        "high": {
          "reasoningEffort": "high"
        },
        "xhigh": {
          "reasoningEffort": "xhigh"
        }
      }
    },
    "gpt-5.3-codex": {
      "name": "gpt-5.3-codex",
      "limit": {
        "context": 400000,
        "output": 128000
      },
      "modalities": {
        "input": [
          "text",
          "image",
          "pdf"
        ],
        "output": [
          "text"
        ]
      },
      "variants": {
        "low": {
          "reasoningEffort": "low"
        },
        "medium": {
          "reasoningEffort": "medium"
        },
        "high": {
          "reasoningEffort": "high"
        },
        "xhigh": {
          "reasoningEffort": "xhigh"
        }
      }
    },
    "gpt-5.1-codex-mini": {
      "name": "gpt-5.1-codex-mini",
      "limit": {
        "context": 400000,
        "output": 128000
      },
      "modalities": {
        "input": [
          "text",
          "image",
          "pdf"
        ],
        "output": [
          "text"
        ]
      },
      "variants": {
        "low": {
          "reasoningEffort": "low"
        },
        "medium": {
          "reasoningEffort": "medium"
        },
        "high": {
          "reasoningEffort": "high"
        },
        "xhigh": {
          "reasoningEffort": "xhigh"
        }
      }
    },
    "claude-opus-4-6-thinking": {
      "name": "claude-opus-4-6-thinking",
      "limit": {
        "context": 1000000,
        "output": 128000
      },
      "modalities": {
        "input": [
          "text",
          "image",
          "pdf"
        ],
        "output": [
          "text"
        ]
      },
      "variants": {
        "low": {
          "effort": "low"
        },
        "medium": {
          "effort": "medium"
        },
        "high": {
          "effort": "high"
        }
      }
    },
    "claude-sonnet-4-6": {
      "name": "claude-sonnet-4-6",
      "limit": {
        "context": 1000000,
        "output": 64000
      },
      "modalities": {
        "input": [
          "text",
          "image",
          "pdf"
        ],
        "output": [
          "text"
        ]
      },
      "variants": {
        "low": {
          "effort": "low"
        },
        "medium": {
          "effort": "medium"
        },
        "high": {
          "effort": "high"
        }
      }
    },
    "qwen3-coder-plus": {
      "name": "qwen3-coder-plus",
      "limit": {
        "context": 1000000,
        "output": 65536
      },
      "modalities": {
        "input": [
          "text"
        ],
        "output": [
          "text"
        ]
      }
    },
    "qwen3-coder-flash": {
      "name": "qwen3-coder-flash",
      "limit": {
        "context": 1000000,
        "output": 65536
      },
      "modalities": {
        "input": [
          "text"
        ],
        "output": [
          "text"
        ]
      }
    },
    "gemini-3.1-pro-high": {
      "name": "gemini-3.1-pro-high",
      "limit": {
        "context": 1048576,
        "output": 65536
      },
      "modalities": {
        "input": [
          "text",
          "image",
          "audio",
          "video",
          "pdf"
        ],
        "output": [
          "text"
        ]
      },
      "variants": {
        "low": {
          "thinkingLevel": "low"
        },
        "medium": {
          "thinkingLevel": "medium"
        },
        "high": {
          "thinkingLevel": "high"
        }
      }
    },
    "gemini-3-flash": {
      "name": "gemini-3-flash",
      "limit": {
        "context": 1048576,
        "output": 65536
      },
      "modalities": {
        "input": [
          "text",
          "image",
          "audio",
          "video",
          "pdf"
        ],
        "output": [
          "text"
        ]
      },
      "variants": {
        "minimal": {
          "thinkingLevel": "minimal"
        },
        "low": {
          "thinkingLevel": "low"
        },
        "medium": {
          "thinkingLevel": "medium"
        },
        "high": {
          "thinkingLevel": "high"
        }
      }
    }
  }
}
```
