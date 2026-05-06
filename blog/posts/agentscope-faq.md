---
title: AgentScope Frequently Asked Questions (FAQ)
date: 2026-02-07
author: AgentScope Team
excerpt: A clear Q&A overview of AgentScope — covering the core framework and Runtime, based on the latest 1.0+ practices.
hero: images/blog-qwenpaw-faq.png
category: FAQ
---

## AgentScope Core Framework

### Q1: Does the AgentScope Workstation still exist?

No. Starting with AgentScope 1.0, the project has fully transitioned to a code-first development model. The drag-and-drop Workstation UI is no longer maintained or recommended for new projects.

### Q2: What's the difference between `agent_base`, `react_agent_base`, and `react_agent`?

- **agent_base**: Abstract base class defining the core agent interface.
- **react_agent_base**: Implements the ReAct (Reason + Act) paradigm, handling thought-action loops.
- **react_agent**: A concrete, ready-to-use agent that extends `react_agent_base` with tool integration.

### Q3: Why do I need different Formatters for different LLMs?

LLM providers have different input format requirements (e.g., role names, tool call syntax). AgentScope uses Formatters to convert internal messages into API-compliant payloads. This ensures correctness even when vendors only partially support OpenAI-style APIs.

### Q4: What is `MultiAgentFormatter` used for?

It flattens multi-agent conversation history into a single string like `"Alice: Hello\nBob: Hi"` and sends it as a user-role message. This preserves global context but loses per-agent identity and tool semantics in the LLM's view. Best suited for summary or coordination tasks — not fine-grained collaboration.

### Q5: Does AgentScope support dynamic Pydantic models for structured output?

Yes. AgentScope supports dynamic JSON Schema generation and leverages Pydantic for validation in ReAct agents. See the [Structured Output Guide](https://docs.agentscope.io/building-blocks/agent#structured-output).

### Q6: Can I use Anthropic-style skills in AgentScope?

Yes. Place your skill definitions in a directory following AgentScope's skill structure, then register them via `toolkit.register_agent_skill()`.

### Q7: Is MCP (Model Control Protocol) supported?

Yes. AgentScope supports standard-compliant MCP for tool and service integration. See the [MCP usage tutorial](https://docs.agentscope.io/building-blocks/tool-capabilities#mcp-integration).

### Q8: Are there community examples beyond official demos?

Yes. Explore [agentscope-samples](https://github.com/agentscope-ai/agentscope-samples) for real-world use cases like Werewolf games, debates, and customer service bots built by the community.

### Q9: What's the difference between model fine-tuning and memory retrieval?

- **Fine-tuning**: Updates model weights for better task performance.
- **Memory retrieval**: Injects relevant context at inference time (e.g., via vector DBs).

They are complementary — you can even fine-tune a model to better leverage retrieved memories.

### Q10: How does AgentScope-Java relate to Spring AI Alibaba?

- **AgentScope-Java**: The Java port of AgentScope (under active development), aligned with the Python version in design and features.
- **Spring AI Alibaba**: Will adopt AgentScope-Java as its underlying engine. If you use Spring AI Alibaba's Agentic APIs, you'll automatically gain AgentScope capabilities after upgrading — no need to integrate AgentScope-Java separately.

### Q11: Does AgentScope support automated planning like Manus?

Yes. See the [Plan with ReAct Agent example](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/plan#plan-with-react-agent). The Plan module has already been extracted as a reusable core component — see the [Plan module doc](https://docs.agentscope.io/building-blocks/agent#planning).

### Q12: Can I use AgentScope with AI coding assistants like Cursor or Claude Code?

Absolutely. AgentScope's clean codebase and tutorials are highly compatible with AI pair programmers. Pro tip: provide the GitHub repo or tutorial source as context.

---

## AgentScope Runtime

### Q13: Why use AgentScope Runtime instead of my own HTTP server + Docker setup?

Your current approach works well for single-agent, single-environment deployments. AgentScope Runtime is designed for advanced scenarios:

- Decouples business logic from execution environment via a unified protocol.
- Enables independent upgrades of the runtime engine without touching agent code.
- Supports elastic scaling of multiple agent instances (e.g., on Kubernetes).

If you only deploy fixed agents in one environment, your workflow is sufficient. Use Runtime when you need portability, scalability, or multi-platform deployment.

### Q14: What's the relationship between `AgentApp` and `Runner`?

- **AgentApp**: Defines the service interface (like FastAPI), using decorators such as `@agent_app.query(framework="agentscope")`.
- **Runner**: Implements the actual agent execution logic.

Requests to `AgentApp` are delegated to the `Runner`. The decorator-based pattern is recommended — see the [QuickStart](https://runtime.agentscope.io/en/quickstart.html).

### Q15: How does the Sandbox work? Can I validate commands in Sandbox and then run them on the host?

The Sandbox provides an isolated, secure environment for executing code, file operations, or browser actions.

**Never re-run validated operations on the host.** Instead:

- Mount read-only host directories into the sandbox for data access.
- Let agents write to a dedicated sandbox workspace.
- Use sandbox outputs (e.g., downloaded files) directly downstream.

The goal: zero risk to the host system.

### Q16: Will Runtime simplify K8s deployment?

Yes. Starting with v1.0.2, AgentScope Runtime will support CLI-based deployment, reducing boilerplate for Kubernetes and other platforms. The aim is to let you deploy the same agent artifact across ModelStudio, AgentRun, K8s, etc., without code changes.

---

## Resources

**Official Documentation**

- [AgentScope](https://docs.agentscope.io/)
- [AgentScope-Runtime](https://runtime.agentscope.io/en/intro.html)

**Community**

- [Discord](https://discord.gg/eYMpfnkG8h)
- [GitHub](https://github.com/agentscope-ai/agentscope)

**Products**

- [AgentScope](https://github.com/agentscope-ai/agentscope)
- [AgentScope-Java](https://github.com/agentscope-ai/agentscope-java)
- [AgentScope-Runtime](https://github.com/agentscope-ai/agentscope-runtime)
- [AgentScope-Runtime-Java](https://github.com/agentscope-ai/agentscope-runtime-java)
- [AgentScope-Studio](https://github.com/agentscope-ai/agentscope-studio)
