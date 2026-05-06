---
title: Bringing Voices to AgentScope
date: 2026-01-29
author: Bingchen Qian and Dawei Gao
excerpt: Our roadmap to realtime, voice-enabled agents that talk, act, and collaborate — bringing dynamic AI interactions to life.
hero: images/blog-finance-voices.png
category: Engineering
---

Voice interaction represents a significant shift in how we conceptualize and build agent systems. In this post, we'll share our vision for voice agents within AgentScope — design philosophy, current progress, and the roadmap toward truly interactive, realtime AI.

## The Voice Agent

Voice agent is a fantastic direction. Compared with our current text-based ReAct agent, it is remarkable in user-interaction, and takes tone and attitude into the conversation. And thanks to rapid progress in voice model APIs, we can now actually build them.

> We're actively integrating more voice APIs into AgentScope, and we welcome contributions — especially for advanced voice capabilities.

## Our Vision

At the core of AgentScope is a fundamental belief: an agent should be an independent entity that exists autonomously from the environment or specific applications, rather than a task-bound script. This philosophy is the North Star for our voice agents.

To realize this, we are doubling down on three key areas, even where current technology faces significant hurdles:

- **Multi-agent Supports.** Let's be honest: the world does not consist solely of "a user" and "an assistant" — even if that has become the industry's favorite shortcut. We want voice agents to collaborate with others (agents or humans), rather than being trapped in a narrow, one-on-one loop.
- **Environment Interaction.** A voice agent shouldn't be a "speaking toy" limited to verbal exchange. Inheriting the DNA of our `ReActAgent`, our voice agents are designed to act. They must be able to use tools, call APIs, and influence their environment, bridging the gap between conversation and execution.
- **Production-Grade Deployment.** The true value of a voice agent is in production. We are focused on the engineering challenges — latency, reliability, and error handling — that determine whether an agent is a curiosity or a functional tool in the real world.

## Roadmap: Rome Wasn't Built in a Day

Designing a voice agent is a study in managing trade-offs. While the long-term goal is seamless, human-like interaction, the reality is that different technical architectures offer vastly different levels of production-readiness.

In AgentScope, we have structured the evolution of voice into three distinct stages:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     TTS      │ →  │  Omni Model  │ →  │   Realtime   │
│Text-to-Speech│    │  Multimodal  │    │ Realtime Omni│
└──────────────┘    └──────────────┘    └──────────────┘
 Async Synthesis      Sync Response       Bidirectional
                                           Streaming
```

Each stage represents a fundamental shift in how the agent handles the information loop — moving from traditional asynchronous synthesis toward bidirectional, realtime streaming.

### Stage 1. Text-to-Speech

While "omni" models represent the future, Text-to-Speech (TTS) remains the most robust and production-ready foundation for voice agents today. However, we still face the following bottlenecks in production:

- **Latency** is the obvious problem. Traditional TTS models often wait for a complete sentence or paragraph before beginning synthesis, leading to a disjointed user experience.
- **Content-filtering** is the subtle problem. Not everything an agent generates should be spoken aloud. Code blocks? Special symbols? Generated reports? Your TTS agent shouldn't drone through a hundred lines of Python, or read out an entire document it just created.

For latency, we integrate realtime TTS models (such as DashScope's realtime TTS API). By feeding the LLM's text stream directly into the TTS engine as it's generated, we drastically reduce the "Time to First Sound" — so the agent begins speaking almost as soon as it begins thinking.

For context-filtering, we tested OpenAI, Gemini, and DashScope TTS APIs. Some offer basic filtering — markdown code blocks get caught, for instance — but it's inconsistent. What we need is configurable pre-processing before text hits the TTS layer. Filter code blocks. Strip metadata. Handle structured outputs intelligently. We're building that filtering layer now ([tracking issue](https://github.com/agentscope-ai/agentscope/issues/773)).

**Try it yourself:**

```python
import asyncio
import os

from agentscope.agent import ReActAgent, UserAgent
from agentscope.formatter import DashScopeChatFormatter
from agentscope.model import DashScopeChatModel
from agentscope.tts import DashScopeRealtimeTTSModel

async def main() -> None:
    agent = ReActAgent(
        name="Friday",
        sys_prompt="You are a helpful assistant named Friday.",
        model=DashScopeChatModel(
            api_key=os.environ.get("DASHSCOPE_API_KEY"),
            model_name="qwen3-max",
            stream=True,
        ),
        formatter=DashScopeChatFormatter(),
        tts_model=DashScopeRealtimeTTSModel(
            model_name="qwen3-tts-flash-realtime",
            api_key=os.environ.get("DASHSCOPE_API_KEY"),
            voice="Cherry",
        ),
    )
    user = UserAgent("User")

    msg = None
    while True:
        msg = await user(msg)
        if msg.get_text_content() == "exit":
            break
        msg = await agent(msg)

asyncio.run(main())
```

**Go further:** building a multi-agent werewolf game with TTS capabilities ([source](https://github.com/agentscope-ai/agentscope/tree/main/examples/game/werewolves)).

![Werewolf game with TTS](../videos/blog-voices/werewolf-tts.mp4)

### Stage 2. Omni Models

Compared to TTS, omni models (such as gpt-audio, Qwen3-omni) offer end-to-end multimodal understanding. They don't just "read" text — they perceive and generate audio natively, capturing the emotional prosody and subtle cues that are often lost in translation.

We have integrated these premier Omni models into the existing ReAct agent ecosystem. For developers, moving from a text-based agent to a voice-native agent is as simple as a configuration change. Our implementation ensures the Omni-powered `ReActAgent` retains its full suite of advanced capabilities: realtime interruption, high-level reasoning (planning, RAG, tool use), and short/long-term memory.

```python
import asyncio
import os

from agentscope.agent import ReActAgent, UserAgent
from agentscope.formatter import OpenAIChatFormatter
from agentscope.model import OpenAIChatModel

async def main() -> None:
    agent = ReActAgent(
        name="Friday",
        sys_prompt="You are a helpful assistant",
        model=OpenAIChatModel(
            model_name="qwen3-omni-flash",
            client_kwargs={
                "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
            },
            api_key=os.getenv("DASHSCOPE_API_KEY"),
            stream=True,
            generate_kwargs={
                "modalities": ["text", "audio"],
                "audio": {"voice": "Cherry", "format": "wav"},
            },
        ),
        formatter=OpenAIChatFormatter(),
    )
    user = UserAgent("Bob")

    msg = None
    while True:
        msg = await user(msg)
        if msg.get_text_content() == "exit":
            break
        msg = await agent(msg)

asyncio.run(main())
```

### Stage 3. Realtime

[Realtime Agent](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/realtime_voice_agent) · [Multi-Agent Realtime Conversation](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_realtime)

To build a truly production-ready voice agent, we must move beyond the traditional turn-based ReAct loop. In AgentScope, the leap to **Realtime** is about architecting a system capable of bidirectional, continuous, and multi-agent communication.

Our goal: combine the fluidity of streaming audio with the core strengths of AgentScope — multi-agent collaboration, tool-use, and robust deployment.

#### The Realtime Architecture: A Three-Layer Abstraction

We have dismantled the monolithic agent structure in favor of a layered, event-driven architecture. This ensures that the agent remains responsive even while performing complex reasoning or tool-calling.

- **The Model Layer (`RealtimeModel`)** acts as a protocol adapter. It provides a unified abstraction, the `ModelEvent`, which normalizes different Realtime APIs (OpenAI, DashScope, Gemini) into a consistent schema.
- **The Agent Layer (`RealtimeAgent`)** operates on a bidirectional asynchronous architecture. It simultaneously manages incoming events (storing them in memory and feeding the API) and outgoing responses (parsing API output to trigger tools or update the UI).
- **The Deployment Layer** uses FastAPI and WebSockets to bridge the gap between the agent's internal logic and the end-user, managing the continuous flow of JSON and binary frames.

```
┌───────────────────────────────────────────────────────────┐
│       Deployment Layer (FastAPI / WebSocket)              │
│   (Manages User Conn:  Frontend JSON ↔ Server Events)     │
└───────────────┬───────────────────────────▲───────────────┘
          ClientEvents (JSON)         ServerEvents (JSON)
                ▼                           │
┌───────────────────────────────────────────┴───────────────┐
│               Agent Layer (RealtimeAgent)                 │
│      (Agent Logic: Event Handling ↔ State Management)     │
└───────────────┬───────────────────────────▲───────────────┘
          Data Blocks                Model Events
       (Audio/Text/Image)          (Unified Schema)
                ▼                           │
┌───────────────────────────────────────────┴───────────────┐
│               Model Layer (RealtimeModel)                 │
│   (Protocol Adapter: Request Encoding ↔ API Parsing)      │
└───────────────┬───────────────────────────▲───────────────┘
          Binary/JSON Frames          Binary/JSON Frames
                ▼                           │
┌───────────────────────────────────────────┴───────────────┐
│     Cloud AI Provider (DashScope / OpenAI / Gemini)       │
└───────────────────────────────────────────────────────────┘
```

#### Scaling to Multi-Agent: The ChatRoom Concept

While a single-agent chatbot is the baseline, AgentScope's philosophy has always centered on multi-agent systems. To bring this to the voice domain, we introduced the **ChatRoom** — an interaction layer that acts as a central hub for broadcasting and routing messages between multiple voice agents.

The `ChatRoom` handles the complexities of a multi-way dialogue:

- **Broadcasting**: every event from an agent is routed both to the frontend and to other agents in the room.
- **Parallel sessions**: each agent maintains its own independent WebSocket session with the AI provider, while the ChatRoom orchestrates collective behavior.

This architecture enables sophisticated scenarios like multi-agent debates or collaborative problem-solving. While current APIs still struggle with speaker diarization (distinguishing who is speaking in a single audio stream), the `ChatRoom` framework is already built to scale as those underlying capabilities mature.

**Go further:** Multi-agent realtime debates in English & Chinese.

**🤖 AI Threat vs. AI Optimism (en)**

![AI Threat vs AI Optimism — English realtime debate](../videos/blog-voices/debate-en.mp4)

**👥 人性本恶 vs. 人性本善 (zh)**

![人性本恶 vs 人性本善 — Chinese realtime debate](../videos/blog-voices/debate-zh.mp4)

#### The Unsolved Frontiers: Memory and Continuity

Despite these architectural leaps, realtime voice agents still face significant production hurdles that we are actively working to solve:

- **Contextual memory management.** Most realtime APIs have limited context windows for audio tokens. To maintain continuity, we implement a "compaction" strategy — summarizing the current state into text to re-initialize the connection without losing the agent's train of thought.
- **Session persistence.** WebSocket connections are inherently ephemeral and often have maximum duration limits. Designing seamless handovers for long-running conversations is a critical focus for our next iteration.

## The Path Forward

We view the development of realtime agents not as a static feature, but as a rapidly evolving frontier. The landscape of voice-native AI is shifting beneath our feet — from new breakthroughs in audio-token quantization to more robust speaker diarization models — and we are committed to staying at the forefront of these changes.

The challenges we have outlined — from managing asynchronous state in realtime streams to architecting multi-agent ChatRooms — require diverse perspectives and collective experimentation. We invite the community to join us:

- **Contribute.** Whether it's integrating a new Omni model API, optimizing the `RealtimeModel` abstraction, or refining streaming filters, your pull requests drive the framework forward.
- **Discuss.** Join our community forums to share use cases and help us define the next generation of voice-interaction patterns.
- **Experiment.** Build your own multi-agent voice scenarios using our current Stage 1 and Stage 2 implementations and tell us what's missing.

We believe the next few years will fundamentally redefine how humans and agents coexist. Looking forward to navigating this fluid, realtime future together.

---

*Originally posted on the [AgentScope Design Book](https://github.com/agentscope-ai/agentscope/discussions/1194).*
