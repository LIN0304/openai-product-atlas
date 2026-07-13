Title: Changelog | OpenAI API

URL Source: https://platform.openai.com/docs/changelog

Published Time: Mon, 13 Jul 2026 08:19:41 GMT

Markdown Content:
### July, 2026

Jul 9

Jul 6

Feature

gpt-realtime-2.1

gpt-realtime-2.1-mini

v1/realtime

Released [GPT-Realtime-2.1](https://platform.openai.com/api/docs/models/gpt-realtime-2.1), an updated realtime reasoning model with improved alphanumeric recognition, silence and noise handling, and interruption behavior. Also released [GPT-Realtime-2.1 mini](https://platform.openai.com/api/docs/models/gpt-realtime-2.1-mini), a faster, lower-cost distilled reasoning model for realtime voice applications.

### June, 2026

Jun 24

Update

chat-latest

Updated the `chat-latest` snapshot, which points to the latest Instant model currently used in ChatGPT. We recommend leveraging [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) for production API usage, but feel free to use this model to test the latest improvements for chat use cases. The underlying model snapshot will be regularly updated. Read more [here](https://developers.openai.com/api/docs/models/chat-latest).

Jun 23

Feature

Released the Safety Usage Dashboard on the OpenAI API platform. The Safety dashboard shows blocked Responses requests based on `safety_identifier` values sent on requests to identify end users. Visit the [Safety dashboard](https://platform.openai.com/usage/safety).

Jun 9

Feature

v1/responses

Web search can now return image results alongside regular text results. Use image search when your application needs current or web-grounded visuals, such as product photos, landmarks, places, events, or visual references. Read more in the [web search guide](https://platform.openai.com/api/docs/guides/tools-web-search).

Jun 5

Update

Released a redesigned navigation for the OpenAI API platform, visit [here](https://platform.openai.com/login).

Jun 4

Feature

omni-moderation-latest

v1/responses

v1/chat/completions

Added moderation scores to the Responses API and Chat Completions API. Pass a `moderation` object in a generation request to receive moderation results for both the model input and generated output in the same response.

Learn more in the [Moderation guide](https://platform.openai.com/api/docs/guides/moderation#moderate-generated-content).

Jun 3

Update

Announced the deprecation of reusable prompt objects, the Evals platform, and Agent Builder. See the [deprecations page](https://platform.openai.com/api/docs/deprecations) for shutdown timelines and migration guidance.

Jun 2

Update

Starting June 2, 2026, eligible container sessions will be billed per minute with a 5-minute minimum, instead of being billed at the full 20-minute session rate. The underlying per-minute rate will remain the same.

This update is intended to make billing more granular for shorter sessions and will lower effective cost for customers.

You can find current built-in tool pricing in our [API pricing docs](https://platform.openai.com/api/docs/pricing#built-in-tools).

Jun 1

Feature

gpt-5.4

gpt-5.5

v1/responses

OpenAI models are now available in Amazon Bedrock through an OpenAI-compatible Responses API endpoint. Supported models and features vary by AWS Region. [Learn more](https://platform.openai.com/api/docs/guides/amazon-bedrock).

### May, 2026

May 29

Update

v1/responses

v1/chat/completions

v1/batch

For organizations without ZDR enabled, `prompt_cache_retention` now defaults to `24h` instead of `in_memory`, enabling extended prompt caching by default. [Learn more](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

May 28

Update

chat-latest

Released `chat-latest` snapshot which points to the latest Instant model currently used in ChatGPT. We recommend leveraging [GPT-5.5](https://platform.openai.com/api/docs/models/gpt-5.5) for production API usage, but feel free to use this model to test the latest improvements for chat use cases. The underlying model snapshot will be regularly updated. Read more [here](https://platform.openai.com/api/docs/models/chat-latest).

May 26

Feature

Released [workload identity federation](https://platform.openai.com/api/docs/guides/workload-identity-federation). Trusted workloads can exchange externally issued identity tokens for short-lived OpenAI access tokens without storing long-lived API keys.

May 26

Update

Added new [Admin API](https://platform.openai.com/api/docs/guides/admin-apis) capabilities for managing spend alerts, model allowlists, data retention settings, and hosted tool permissions, plus querying granular billing line items.

May 19

Feature

Released [Secure MCP Tunnel](https://platform.openai.com/api/docs/guides/secure-mcp-tunnels) for enterprise customers. Secure MCP Tunnel lets supported OpenAI products including ChatGPT web, Codex, Responses API, and AgentKit connect to private or on-prem MCP servers through a customer-hosted `tunnel-client` without exposing those servers to the public internet.

May 19

Update

You can now manage multiple IP allowlists and apply each one at the project level or across the whole organization. To configure them, go to [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

May 12

Update

dall-e-2

dall-e-3

v1/realtime

Deprecated DALL·E model snapshots and the Realtime API Beta.

DALL·E model snapshots `dall-e-2` and `dall-e-3` were deprecated and removed from the API on May 12, 2026. We recommend using `gpt-image-2`, `gpt-image-1`, or `gpt-image-1-mini` instead.

The Realtime API Beta was deprecated and removed from the API on May 12, 2026. If you are still using the beta interface, migrate to the released Realtime API. See [the migration guide](https://platform.openai.com/api/docs/guides/realtime#beta-to-ga-migration) and the full [deprecations page](https://platform.openai.com/api/docs/deprecations).

May 11

Feature

v1/responses

Added `return_token_budget` for the Responses API [web search tool](https://platform.openai.com/api/docs/guides/tools-web-search#run-longer-web-research). Use it to opt in to longer GPT-5+ reasoning web search runs for high-effort research and evaluation workloads.

May 7

May 7

Feature

Released the [OpenAI Developers plugin for Codex](https://developers.openai.com/learn/developers-codex-plugin). This helps you build AI applications and agents in Codex with OpenAI Platform access and OpenAI API setup guidance.

May 6

Update

The updated Agents SDK is now available in TypeScript, with support for sandbox agents and an open-source harness built in. Learn more [here](https://developers.openai.com/api/docs/guides/agents).

May 5

Update

chat-latest

Released `chat-latest` snapshot which points to the latest Instant model currently used in ChatGPT. We recommend leveraging [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) for production API usage, but feel free to use this model to test our latest improvements for chat use cases. The underlying model snapshot will be regularly updated. Read more [here](https://platform.openai.com/api/docs/models/chat-latest).

May 4

Update

Admin APIs are now supported in the OpenAI SDKs for Node, Python, Go, Ruby, and Java. See the [Admin APIs guide](https://platform.openai.com/api/docs/guides/admin-apis) for setup instructions and examples.

### April, 2026

Apr 24

Feature

gpt-5.5

gpt-5.5-pro

v1/responses

v1/chat/completions

v1/batch

Released [GPT-5.5](https://platform.openai.com/api/docs/models/gpt-5.5), a new frontier model for complex professional work, to the Chat Completions and Responses API, and released [GPT-5.5 Pro](https://platform.openai.com/api/docs/models/gpt-5.5-pro) for Responses API requests for tougher problems that benefit from more compute.

GPT-5.5 supports a 1M token context window, image input, structured outputs, function calling, prompt caching, Batch, tool search, built-in computer use, hosted shell, apply patch, Skills, MCP, and web search. Key updates include:

*   Reasoning effort now defaults to `medium`.
*   When `image_detail` is unset or set to `auto`, the model now uses [original behavior](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
*   Caching for GPT-5.5 only works with extended prompt caching. In-memory prompt caching is not supported. Learn more [here](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

Apr 21

Feature

gpt-image-2

v1/images/generations

v1/images/edits

v1/batch

Released [GPT Image 2](https://platform.openai.com/api/docs/models/gpt-image-2), a state-of-the-art image generation model for image generation and editing. GPT Image 2 supports flexible image sizes, high-fidelity image inputs, token-based image pricing, and Batch API support with a 50% discount.

Apr 15

Update

Updated the [Agents SDK](https://platform.openai.com/api/docs/guides/agents) with new capabilities, including:

*   running agents in controlled sandboxes;
*   inspecting and customizing the open-source harness; and
*   controlling when memories are created and where they're stored.

### March, 2026

Mar 17

Feature

gpt-5.4-mini

gpt-5.4-nano

v1/responses

v1/chat/completions

Released [GPT-5.4 mini](https://platform.openai.com/api/docs/models/gpt-5.4-mini) and [GPT-5.4 nano](https://platform.openai.com/api/docs/models/gpt-5.4-nano) to the Chat Completions and Responses API. GPT-5.4 mini brings GPT-5.4-class capabilities to a faster, more efficient model for high-volume workloads, while GPT-5.4 nano is optimized for simple high-volume tasks where speed and cost matter most.

GPT-5.4 mini supports [tool search](https://platform.openai.com/api/docs/guides/tools-tool-search), built-in [computer use](https://platform.openai.com/api/docs/guides/tools-computer-use), and [compaction](https://platform.openai.com/api/docs/guides/compaction). GPT-5.4 nano supports compaction, but does not support tool search or computer use.

Mar 16

Update

gpt-5.3-chat-latest

Updated the [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug to point to the latest model currently used in ChatGPT.

Mar 13

Fix

gpt-5.4

v1/responses

v1/chat/completions

Updated our image encoder to fix a small bug with `input_image` inputs in GPT-5.4. Some image understanding use cases may now see improved quality. No action is required.

Mar 12

Feature

sora-2

sora-2-pro

v1/videos

v1/videos/characters

v1/videos/extensions

v1/batch

Expanded the Sora API with reusable character references, longer generations up to `20` seconds, `1080p` output for `sora-2-pro`, video extensions, and Batch API support for `POST /v1/videos`. `1080p` generations on `sora-2-pro` are billed at `$0.70` per second. Learn more [here](https://platform.openai.com/api/docs/guides/video-generation).

Mar 12

Update

sora-2

sora-2-pro

v1/videos/edits

v1/videos/{video_id}/remix

Added `POST /v1/videos/edits` for editing existing videos. This will replace `POST /v1/videos/{video_id}/remix`, which will be deprecated in `6` months. Learn more [here](https://platform.openai.com/api/docs/guides/video-generation#edit-existing-videos).

Mar 5

Feature

gpt-5.4

gpt-5.4-pro

v1/responses

v1/chat/completions

Released [GPT-5.4](https://platform.openai.com/api/docs/models/gpt-5.4), our newest frontier model for professional work, to the Chat Completions and Responses API, and released [GPT-5.4 Pro](https://platform.openai.com/api/docs/models/gpt-5.4-pro) to the Responses API for tougher problems that benefit from more compute.

Also released:

*   [Tool search](https://platform.openai.com/api/docs/guides/tools-tool-search) in the Responses API, which lets models defer large tool surfaces until runtime to reduce token usage, preserve cache performance, and improve latency.
*   Built-in [Computer use](https://platform.openai.com/api/docs/guides/tools-computer-use) support in GPT-5.4 through the Responses API `computer` tool for screenshot-based UI interaction.
*   A 1M token context window and native [Compaction](https://platform.openai.com/api/docs/guides/compaction) support for longer-running agent workflows.

Mar 3

Feature

gpt-5.3-chat-latest

v1/chat/completions

v1/responses

Released `gpt-5.3-chat-latest` to the Chat Completions and Responses API. This model points to the GPT-5.3 Instant snapshot currently used in ChatGPT. Read more [here](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

### February, 2026

Feb 24

Feature

v1/responses

v1/chat/completions

Expanded `input_file` support to accept more document, presentation, spreadsheet, code, and text file types. Learn more [here](https://platform.openai.com/api/docs/guides/file-inputs).

Feb 24

Feature

v1/responses

Released `phase` to the Responses API. It labels an assistant message as intermediate commentary (`commentary`) or the final answer (`final_answer`). Read more [here](https://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase).

Feb 24

Feature

gpt-5.3-codex

v1/responses

Released `gpt-5.3-codex` to the Responses API. Read more [here](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

Feb 23

Feature

v1/responses

Launched WebSocket mode for the Responses API. Learn more [here](https://platform.openai.com/api/docs/guides/websocket-mode/).

Feb 23

Feature

gpt-realtime-1.5

gpt-audio-1.5

v1/realtime

v1/chat/completions

Released [GPT-Realtime-1.5](https://platform.openai.com/api/docs/models/gpt-realtime-1.5) to the Realtime API.

Released `gpt-audio-1.5` to the Chat Completions API. Read more [here](https://platform.openai.com/api/docs/models/gpt-audio-1.5).

Feb 10

Feature

gpt-image-1.5

gpt-image-1

gpt-image-1-mini

chatgpt-image-latest

v1/batch

[Batch API](https://platform.openai.com/api/docs/guides/batch) is now supported for GPT Image models: `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`, and `gpt-image-1-mini`.

Feb 10

Update

gpt-5.2-chat-latest

Updated the [gpt-5.2-chat-latest](https://platform.openai.com/api/docs/models/gpt-5.2-chat-latest) slug to point to the latest model currently used in ChatGPT.

Feb 10

Feb 10

Feature

v1/responses

Launched support for [Skills](https://platform.openai.com/api/docs/guides/tools-skills) in the Responses API. We support Skills across both local execution and hosted container-based execution.

Feb 10

Feature

v1/responses

Launched a new [Hosted Shell](https://platform.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) tool, as well as support for networking in containers.

Feb 9

Feature

gpt-image-1.5

gpt-image-1

gpt-image-1-mini

chatgpt-image-latest

v1/images/edits

Added support for `application/json` requests on `/v1/images/edits` for GPT image models. JSON requests use `images` (and optional `mask`) with `image_url` or `file_id` references instead of multipart uploads.

Feb 3

Update

gpt-5.2

gpt-5.2-codex

We have optimized our inference stack for API customers and [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) and [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) now run ~40% faster. Model and model weights are unchanged.

### January, 2026

Jan 15

Announcement

Announced [Open Responses](https://www.openresponses.org/): an open-source spec for building multi-provider, interoperable LLM interfaces built on top of the original OpenAI Responses API.

Jan 14

Feature

gpt-5.2-codex

v1/responses

Released `gpt-5.2-codex` to the Responses API. GPT-5.2-Codex is a version of GPT-5.2 optimized for agentic coding tasks in Codex or similar environments. Read more [here](https://platform.openai.com/docs/models/gpt-5.2-codex).

Jan 13

Feature

v1/realtime

Added dedicated SIP IP ranges for Realtime API. `sip.api.openai.com` does GeoIP routing, and will direct SIP traffic to the closest region. [Learn more](https://platform.openai.com/api/docs/guides/realtime-sip#dedicated-sip-ip-ranges).

Jan 13

Update

gpt-realtime-mini

gpt-audio-mini

Updated the [`gpt-realtime-mini`](https://platform.openai.com/api/docs/models/gpt-realtime-mini) and [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) slugs to point to the 2025-12-15 snapshots. If you need the previous model snapshots, use `gpt-realtime-mini-2025-10-06` and `gpt-audio-mini-2025-10-06`.

Jan 13

Update

sora-2

Updated the [sora-2](https://platform.openai.com/docs/models/sora-2) slug to point to `sora-2-2025-12-08`. If you need the previous model snapshot, use `sora-2-2025-10-06`.

Jan 13

Update

gpt-4o-mini-tts

gpt-4o-mini-transcribe

Updated the `gpt-4o-mini-tts` and `gpt-4o-mini-transcribe` slugs to point to the `2025-12-15` snapshots. If you need the previous model snapshots, use `gpt-4o-mini-tts-2025-03-20` and `gpt-4o-mini-transcribe-2025-03-20`. We currently recomend using `gpt-4o-mini-transcribe` over `gpt-4o-transcribe` for the best results.

Jan 9

Fix

gpt-image-1.5

chatgpt-image-latest

Fixed an issue where `gpt-image-1.5` and `chatgpt-image-latest` were incorrectly using high fidelity for image edits through `/v1/images/edits`, even when `fidelity` was explicitly set to `low` (the default).

### December, 2025

Dec 19

Update

gpt-image-1.5

chatgpt-image-latest

Added `gpt-image-1.5` and `chatgpt-image-latest` to the Responses API image generation tool.

Dec 16

Dec 15

Feature

gpt-realtime-mini

gpt-audio-mini

gpt-4o-mini-transcribe

gpt-4o-mini-tts

Released four new dated audio snapshots. These updates deliver reliability, quality, and voice fidelity improvements for real-time, voice-driven applications. Read more [here](https://platform.openai.com/blog/updates-audio-models).

*   gpt-realtime-mini-2025-12-15
*   gpt-audio-mini-2025-12-15
*   gpt-4o-mini-transcribe-2025-12-15
*   gpt-4o-mini-tts-2025-12-15

This launch also includes support for [Custom voices](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) for eligible customers.

Dec 11

Feature

gpt-5.2

gpt-5.2-chat-latest

v1/responses

v1/chat/completions

Released [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2), the newest flagship model in the GPT-5 model family. GPT-5.2 shows improvements over the previous GPT-5.1 in:

*   General intelligence
*   Instruction following
*   Accuracy and token efficiency
*   Multimodality—especially vision
*   Code generation—especially front-end UI creation
*   Tool calling and context management in the API
*   Spreadsheet understanding and creation.

What's new in 5.2 is a new xhigh reasoning effort level, concise reasoning summaries, and new context management using compaction.

Dec 11

Feature

v1/responses/compact

Released [client-side compaction](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced). For long-running conversations with the Responses API, you can use the `/responses/compact` endpoint to shrink the context you send with each turn.

Dec 4

Feature

gpt-5.1-codex-max

v1/responses

Released `gpt-5.1-codex-max` to the Responses API. GPT-5.1-Codex is our most intelligent coding model optimized for long-horizon, agentic coding tasks. Read more [here](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

### November, 2025

Nov 20

Feature

v1/realtime

Added support for DTMF key presses in the Realtime API. You can now receive DTMF events while using a Realtime sideband connection. See [docs here](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) for more information.

Nov 13

Feature

gpt-5.1

gpt-5.1-codex

gpt-5.1-chat-latest

gpt-5.1-codex-mini

v1/responses

v1/chat/completions

Released [GPT-5.1](https://platform.openai.com/api/docs/models/gpt-5.1), the newest flagship model in the GPT-5 model family. GPT-5.1 is trained to be especially proficient in:

*   Steerability and faster responses when less thinking's required
*   Code generation and coding use cases
*   Agentic workflows

Note that GPT-5.1 defaults to a new `none` reasoning setting for faster responses when less thinking's required—different from the previous `medium` default setting in GPT-5.

Nov 13

Nov 13

Feature

gpt-5.1-codex

gpt-5.1-codex-mini

v1/responses

Released `gpt-5.1-codex` and `gpt-5.1-codex-mini` to the Responses API. GPT-5.1-Codex is a version of GPT-5.1 optimized for agentic coding tasks in Codex or similar environments. Read more [here](https://platform.openai.com/docs/models/gpt-5.1-codex).

Nov 13

Feature

Released [extended prompt cache retention](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention). Extended prompt cache retention keeps cached prefixes active for longer, up to a maximum of 24 hours. Extended Prompt Caching works by offloading the key/value tensors to GPU-local storage when memory is full, significantly increasing the storage capacity available for caching.

### October, 2025

Oct 29

Feature

gpt-oss-safeguard-120b

gpt-oss-safeguard-20b

gpt-oss-safeguard-120b and gpt-oss-safeguard-20b are safety reasoning models built-upon gpt-oss. Read more [here](https://huggingface.co/collections/openai/gpt-oss-safeguard).

Oct 24

Feature

Released [Enterprise Key Management (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). Enterprise Key Management (EKM) allows you to encrypt your customer content at OpenAI using keys managed by your own external Key Management System (KMS).

Oct 24

Feature

Oct 6

Oct 1

Feature

Released [IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist). IP allowlisting restricts API access to only the IP addresses or ranges you specify.

### September, 2025

Sep 26

Feature

v1/responses

Added support for image and file as a [tool call output](https://platform.openai.com/docs/docs/guides/function-calling#how-it-works) in Responses API.

Sep 23

Feature

gpt-5-codex

v1/responses

Launched special-purpose model [gpt-5-codex](https://platform.openai.com/api/docs/models/gpt-5-codex), built and optimized for use with the [Codex CLI](https://github.com/openai/codex).

### August, 2025

Aug 28

Aug 21

Feature

v1/responses

Added support for [connectors](https://platform.openai.com/api/docs/guides/tools-connectors-mcp) to the Responses API. Connectors are OpenAI-maintained MCP wrappers for popular services like Google apps, Dropbox, and more that can be used to give model read access to data stored in those services.

Aug 20

Feature

v1/conversations

v1/responses

v1/assistants

Released the Conversations API, which allows you to create and manage long-running conversations with the Responses API. See the [migration guide](https://platform.openai.com/api/docs/assistants/migration) to see a side-by-side comparison and learn how to migrate from an Assistants API integration to Responses and Conversations.

Aug 7

Feature

v1/chat/completions

v1/responses

Released GPT-5 family of models in the API, including [`gpt-5`](https://platform.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://platform.openai.com/api/docs/models/gpt-5-mini), and [`gpt-5-nano`](https://platform.openai.com/api/docs/models/gpt-5-nano).

Introduced the `minimal`[reasoning effort](https://platform.openai.com/api/docs/guides/reasoning) value to optimize for fast responses in GPT-5 models (which support reasoning).

Introduced `custom`[tool call](https://platform.openai.com/api/docs/guides/function-calling#custom-tools) type, which allows for freeform inputs to and outputs from the model when tool calling.

### June, 2025

Jun 27

Feature

Launched support for [Priority processing](https://platform.openai.com/docs/guides/priority-processing). Priority processing delivers significantly lower and more consistent latency compared to Standard processing while keeping pay-as-you-go flexibility.

Jun 24

Jun 13

Feature

v1/responses

[New reusable prompts](https://platform.openai.com/chat/edit) are now available in the dashboard and [Responses API](https://platform.openai.com/api/docs/api-reference/responses/create). Via API, you can now reference templates created in the dashboard via the `prompt` parameter (with a prompt `id`, optional `version`) and supply dynamic `variables` that can include strings, images, or file inputs. Reusable prompts are not available in Chat Completions. [Learn more](https://platform.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

Jun 10

Feature

o3-pro

v1/responses

v1/batch

Released [o3-pro](https://platform.openai.com/api/docs/models/o3-pro), a version of the [o3](https://platform.openai.com/api/docs/models/o3) reasoning model that uses more compute to answer hard problems with better reasoning and consistency. [Prices for the o3 model have also been reduced](https://platform.openai.com/api/docs/pricing) for all API requests, including batch and flex processing.

Jun 4

Feature

v1/fine_tuning

Added fine-tuning support with [direct preference optimization](https://platform.openai.com/api/docs/guides/direct-preference-optimization) for the models `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, and `gpt-4.1-nano-2025-04-14`.

Jun 3

Feature

v1/chat/completions

v1/realtime

### May, 2025

May 20

May 20

Feature

v1/responses

v1/chat/completions

Added support for using `strict` mode for tool schemas when using parallel tool calling with non-fine-tuned models. Added new [schema features](https://platform.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas), including string validation for `email` and other patterns and specifying ranges for numbers and arrays.

May 15

Feature

codex-mini-latest

v1/responses

v1/chat/completions

Launched [codex-mini-latest](https://platform.openai.com/api/docs/models/codex-mini-latest) in the API, optimized for use with the [Codex CLI](https://github.com/openai/codex).

May 7

### April, 2025

Apr 30

Feature

Apr 23

Feature

v1/images/generations

v1/images/edits

Added a new image generation model, `gpt-image-1`. This model sets a new standard for image generation, with improved quality and instruction following.

Updated the Image Generation and Edit endpoints to support new parameters specific to the `gpt-image-1` model.

Apr 16

Feature

v1/chat/completions

v1/responses

Added two new o-series reasoning models, `o3` and `o4-mini`. They set a new standard for math, science, and coding, visual reasoning tasks, and technical writing.

Launched Codex, our code generation CLI tool.

Apr 14

Feature

gpt-4.1

gpt-4.1-mini

gpt-4.1-nano

v1/responses

v1/chat/completions

v1/fine_tuning

Added [`gpt-4.1`](https://platform.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://platform.openai.com/api/docs/models/gpt-4.1-mini), and [`gpt-4.1-nano`](https://platform.openai.com/api/docs/models/gpt-4.1-nano) models to the API. These new models feature improved instruction following, coding, and a larger context window (up to 1M tokens). `gpt-4.1` and `gpt-4.1-mini` are available for supervised fine-tuning. Announced deprecation of [`gpt-4.5-preview`](https://platform.openai.com/api/docs/deprecations).

### March, 2025

Mar 20

Update

v1/audio

Added `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, and `whisper-1` models to the Audio API.

Mar 19

Feature

o1-pro

v1/responses

v1/batch

Released [o1-pro](https://platform.openai.com/api/docs/models/o1-pro), a version of the [o1](https://platform.openai.com/api/docs/models/o1) reasoning model that uses more compute to answer hard problems with better reasoning and consistency.

Mar 11

Feature

gpt-4o-search-preview

gpt-4o-mini-search-preview

computer-use-preview

v1/chat/completions

v1/assistants

v1/responses

Released several new models and tools and a new API for agentic workflows:

*   Released the [Responses API](https://platform.openai.com/api/docs/guides/responses-vs-chat-completions), a new API for creating and using agents and tools.
*   Released a set of built-in tools for the Responses API: [web search](https://platform.openai.com/api/docs/guides/tools-web-search), [file search](https://platform.openai.com/api/docs/guides/tools-file-search), and [computer use](https://platform.openai.com/api/docs/guides/tools-computer-use).
*   Released the [Agents SDK](https://platform.openai.com/api/docs/guides/agents), an orchestration framework for designing, building, and deploying agents.
*   Announced new models: `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
*   Announced plans to bring all [Assistants API](https://platform.openai.com/api/docs/assistants) features to the easier to use [Responses API](https://platform.openai.com/api/docs/guides/responses-vs-chat-completions), with an anticipated sunset date for Assistants in 2026 (after achieving full feature parity).

Mar 3

Feature

v1/fine_tuning/jobs

Added `metadata` field support to fine-tuning jobs.

### February, 2025

Feb 27

Feature

GPT-4.5

v1/chat/completions

v1/assistants

v1/batch

Released a research preview of [GPT-4.5](https://platform.openai.com/api/docs/models/gpt-4-5)—our largest and most capable chat model yet. GPT-4.5's high "EQ" and understanding of user intent make it better at creative tasks and agentic planning.

Feb 25

Feature

Launched the [API Usage Dashboard Update](https://help.openai.com/en/articles/10478918-api-usage-dashboard). This update addresses requests for additional data filters, such as project selection, date picker, and fine-grained intervals. There’s also better support for viewing usage across different products and service tiers.

Feb 5

Feature

Introducing data residency in Europe. Read more [here](https://platform.openai.com/docs/guides/your-data).

### January, 2025

Jan 31

Feature

o3-mini

o3-mini-2025-01-31

v1/chat/completions

Launched [o3-mini](https://platform.openai.com/api/docs/models/o3-mini), a new small reasoning model that is optimized for science, math, and coding tasks.

Jan 21

Feature

o1

Expanded access to [o1 model](https://platform.openai.com/docs/models/o1). The o1 series of models are trained with reinforcement learning to perform complex reasoning.

### December, 2024

Dec 18

Feature

Launched [Admin API Key Rotations](https://platform.openai.com/api/docs/api-reference/admin-api-keys), enabling customers to programmatically rotate their admin api keys.

Updated [Admin API Invites](https://platform.openai.com/api/docs/api-reference/invite), enabling customers to programmatically invite users to projects at the same time they are invited to organizations.

Dec 17

Dec 4

Feature

Launched [Usage API](https://platform.openai.com/api/docs/api-reference/usage), enabling customers to programmatically query activities and spending across OpenAI APIs.

### November, 2024

Nov 20

Update

v1/chat/completions

Released [gpt-4o-2024-11-20](https://platform.openai.com/api/docs/models/gpt-4o), our newest model in the gpt-4o series.

Nov 4

Feature

v1/chat/completions

Released [Predicted Outputs](https://platform.openai.com/api/docs/guides/predicted-outputs), which greatly reduces latency for model responses where much of the response is known ahead of time. This is most common when regenerating the content of documents and code files with only minor changes.

### October, 2024

Oct 30

Oct 17

Oct 1

Feature

v1/realtime

v1/chat/completions

v1/fine_tuning

Released several new features at [OpenAI DevDay in San Francisco](https://openai.com/devday/):

[Realtime API](https://platform.openai.com/api/docs/guides/realtime): Build fast speech-to-speech experiences into your applications using a WebSockets interface.

[Model distillation](https://platform.openai.com/api/docs/guides/distillation): Platform for fine-tuning cost-efficient models with your outputs from a large frontier model.

[Image fine-tuning](https://platform.openai.com/api/docs/guides/fine-tuning#vision): Fine-tune GPT-4o with images and text to improve vision capabilities.

[Evals](https://platform.openai.com/api/docs/guides/evals): Create and run custom evaluations to measure model performance on specific tasks.

[Prompt caching](https://platform.openai.com/api/docs/guides/prompt-caching): Discounts and faster processing times on recently seen input tokens.

[Generate in playground](https://platform.openai.com/chat/edit): Easily generate prompts, function definitions, and structured output schemas in the playground using the Generate button.

### September, 2024

Sep 26

Feature

omni-moderation-latest

v1/moderations

Released [new `omni-moderation-latest` moderation model](https://platform.openai.com/api/docs/guides/moderation), which supports both images and text (for some categories), supports two new text-only harm categories, and has more accurate scores.

Sep 12

Feature

o1-preview

o1-mini

v1/chat/completions

Released [o1-preview and o1-mini](https://platform.openai.com/api/docs/guides/reasoning), new large language models trained with reinforcement learning to perform complex reasoning tasks.

### August, 2024

Aug 29

Feature

v1/assistants

Aug 20

Aug 15

Aug 6

Aug 1

Update

Launched [Admin and Audit Log APIs](https://platform.openai.com/api/docs/api-reference/administration), allowing customers to programmatically administer their organization and monitor changes using the audit logs. Audit logging must be enabled within [settings](https://platform.openai.com/docs/settings/organization/general).

### July, 2024

Jul 24

Update

Launched [self-serve SSO configuration](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers), allowing Enterprise customers on custom and unlimited billing to set up authentication against their desired IDP.

Jul 23

Jul 18

Update

Released [GPT-4o mini](https://platform.openai.com/api/docs/models/gpt-4o-mini), our affordable an intelligent small model for fast, lightweight tasks.

Jul 17

Update

Released [Uploads](https://platform.openai.com/api/docs/api-reference/uploads) to upload large files in multiple parts.

### June, 2024

Jun 6

Jun 3

Update

### May, 2024

May 15

Update

Added support for [archiving projects](https://platform.openai.com/projects) . Only organization owners can access this functionality.

Added support for [setting cost limits](https://platform.openai.com/settings/organization/general) on a per-project basis for pay as you go customers.

May 13

Update

Released [GPT-4o](https://platform.openai.com/api/docs/models/gpt-4o) in the API. GPT-4o is our fastest and most affordable flagship model.

May 9

Update

May 7

Update

May 6

May 2

Update

Added [a new endpoint](https://platform.openai.com/api/docs/api-reference/messages/deleteMessage) to delete a message from a thread in the Assistants API.

### April, 2024

Apr 29

Apr 17

Apr 16

Update

Introduced [project based hierarchy](https://platform.openai.com/settings/organization/general) for organizing work by projects, including the ability to create [API keys](https://platform.openai.com/api/docs/api-reference/authentication) and manage rate and cost limits on a per-project basis (cost limits available only for Enterprise customers).

Apr 15

Update

Apr 9

Apr 4

Apr 1

### March, 2024

Mar 29

Mar 14

Update

Added support for [streaming](https://platform.openai.com/api/docs/assistants/overview) in the Assistants API

### February, 2024

Feb 9

Update

Feb 1

Update

### January, 2024

Jan 25

Update

Released embedding V3 models and an updated GPT-4 Turbo preview

Added [`dimensions` parameter](https://platform.openai.com/api/docs/api-reference/embeddings/create#embeddings-create-dimensions) to the Embeddings API

### December, 2023

Dec 20

Dec 15

Update

Dec 14

### November, 2023

Nov 30

Update

Nov 6

Update

### October, 2023

Oct 16

Oct 6
