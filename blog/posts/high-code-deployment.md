---
title: Deployment in a High-code Manner
date: 2025-11-07
author: Dawei Gao
excerpt: Master production-ready agent deployment with AgentScope — manage state, orchestrate sub-agents, and stream interactions seamlessly.
hero: images/blog-high-code.png
category: Engineering
---

We'd like to use the "Design Book of AgentScope" as a space to share and discuss ideas about the design choices behind AgentScope. In this first post, we'll demonstrate how to deploy agents using a high-code approach, with a focus on:

- **Multi-agent** systems
- **Custom agent classes**
- **State management** in agent systems

We'll use a routing agent as our example — a typical multi-agent system that routes user requests to different sub-agents based on request content.

> [AgentScope-Runtime](https://github.com/agentscope-ai/agentscope-runtime) provides a one-stop solution for single-agent deployment and secure tool sandboxing. This post focuses primarily on multi-agent and custom agent deployment.

## Key Questions to Ask

Before diving into deployment, it's helpful to think through a few key questions about your system:

**Q: How will you handle incoming requests?** *(by thread, by process, by async task, etc.)*

This affects the design of your agent system. For example, in Flask, each request is handled in a new thread, with both the server and requests running in a single Python process. In such cases, thread-safety becomes critical — you need to be careful about using global variables, as different requests may interfere with each other.

**Q: Is your application multi-tenant or single-tenant?**

This determines how you'll manage and isolate state across different users. AgentScope provides application-level state management, which we'll discuss later.

> Application-level state management can encompass multiple agents, including custom agent classes inheriting from `AgentBase` or `ReActAgentBase` — not just the official `ReActAgent` class.

**Q: How will you send messages to the frontend?**

This decides what your endpoint function should return. If messages need to be streamed back through the request endpoint, your endpoint should return a generator. Alternatively, you can send messages directly to the frontend or a pub/sub system (like Redis), in which case the endpoint function can simply return a basic "200 OK".

**Q: How will you expose agents to users?**

| Approach | Advantages | Disadvantages |
|----------|-----------|---------------|
| Expose sub-agents to users | Clearly shows the multi-agent system at work and how sub-agents complete subtasks | May confuse users — *"Can I interact with sub-agents directly, or only through the main agent?"* |
| Only expose the main agent | Focused, clear, and easier to understand | Still need to show sub-agents' progress to avoid users feeling like nothing is happening |

This choice will determine how you handle sub-agent messages — by exposing the sub-agent directly to the user, or as tool results from a function like `create_worker`.

> When using sub-agents as tools, remember to compress their execution logs in the tool results. Otherwise, lengthy results will bloat the main agent's context, undermining the context isolation benefit of multi-agent architecture.

## State Management

A common misconception is that only memory constitutes an agent's state. That's not necessarily true. In AgentScope, a `PlanNotebook` instance, a `Toolkit` instance, or even custom attributes can all be part of the state.

**Example 1: Planning state.** AgentScope's planning capability, supported by `PlanNotebook`, allows agents to request additional information from users during execution. Plan execution spans multiple user requests, requiring state across them.

**Example 2: Toolkit state.** When using group-wise management or meta tools in AgentScope, the toolkit tracks activated tool groups, which must also persist across requests.

**Example 3: Custom attributes.** Imagine you want to surprise users on their 100th conversation. You'd add a counter to track conversations and trigger the surprise at 100:

```python
class MyAgent(AgentBase):
    def __init__(self, *args, **kwargs):
        super().__init__()
        self.counter = 0  # conversation counter

    def reply(self, *args, **kwargs):
        self.counter += 1
        if self.counter == 100:
            # trigger the surprise
            ...
```

This counter is clearly part of the state that needs to persist.

These examples illustrate why AgentScope provides the `StateModule` class. It handles state in two ways:

1. **Nested StateModules.** If an attribute is itself a `StateModule` instance, it's automatically included in the parent's state. For example, if a `ReActAgent` has a `plan_notebook` attribute (also a `StateModule` subclass), the notebook's state is automatically saved/loaded with the agent.
2. **Primitive types.** For regular attributes like integers or floats, use `register_state()` to include them, optionally with custom save/load logic.

This mechanism enables AgentScope to seamlessly support custom agent implementations. As long as your custom agent inherits from `AgentBase` or `ReActAgentBase`, its state will be automatically managed without extra effort from developers.

### Using Session Modules

```python
@app.route("/chat", method=["POST"])
def chat_endpoint():
    session_id = request.json.get("session_id")

    sessions = JSONSession(save_dir="...")

    agent1 = ReActAgent(...)
    agent2 = ReActAgent(...)

    sessions.load_session_state(
        session_id=session_id,
        agent1=agent1,
        agent2=agent2,
    )

    # application logic ...

    sessions.save_session_state(
        session_id=session_id,
        agent1=agent1,
        agent2=agent2,
    )
```

In practice you can create a custom session class by inheriting from `SessionBase` — for example, to load/save state from a cloud database.

## Frontend Display

There are two approaches to displaying sub-agent messages.

### Approach 1: Expose sub-agents to users

When you want users to see sub-agents in action, stream their messages directly to the frontend. AgentScope provides `stream_printing_messages` to collect printing messages from multiple agents and yield them in order.

> Printing messages are messages generated by calling an agent's `self.print()` function.

The key idea is to use a shared `asyncio.Queue` to collect messages from both the main agent and any dynamically created sub-agents:

```python
from agentscope.tool import ToolResponse
from agentscope.agent import ReActAgent
import asyncio

def create_worker(task_description: str, queue: asyncio.Queue) -> ToolResponse:
    sub_agent = ReActAgent(...)
    sub_agent.set_console_output_enabled(False)
    sub_agent.set_msg_queue_enabled(True, queue=queue)
    ...
```

```python
@app.route("/chat", methods=["POST"])
def chat_endpoint():
    queue = asyncio.Queue()

    toolkit = Toolkit()
    toolkit.register_tool_function(
        create_worker,
        preset_kwargs={"queue": queue},
    )

    agent = ReActAgent(..., toolkit=toolkit)

    async for msg, last in stream_printing_messages(
        agents=[agent],
        coroutine_task=agent(Msg("user", "...", "user")),
        queue=queue,
    ):
        yield msg
```

The beauty of this approach is that even though only the main agent is passed to `stream_printing_messages`, messages from all sub-agents are automatically captured through the shared queue.

### Approach 2: Hide sub-agents from users

Treat sub-agent printing messages as tool results. This keeps the user interface clean and focused on the main agent. First, prepare a function to convert and compress sub-agent messages into text blocks:

```python
def _convert_to_text_block(msgs):
    blocks = []
    for m in msgs:
        for block in m.get_content_blocks():
            if block["type"] == "text":
                blocks.append(block)
            elif block["type"] == "tool_use":
                blocks.append(TextBlock(
                    type="text",
                    text=f"Calling tool {block['name']} ...",
                ))
            elif block["type"] == "tool_result":
                blocks.append(TextBlock(
                    type="text",
                    text=f"Tool {block['name']} returned result: {block['output'][:50]} ...",
                ))
    return blocks
```

Then implement the tool function that yields streaming tool responses:

```python
async def create_worker(task_description):
    sub_agent = ReActAgent(...)
    sub_agent.set_console_output_enabled(False)

    msgs = OrderedDict()
    async for msg, _ in stream_printing_messages(
        agents=[sub_agent],
        coroutine_task=sub_agent(Msg("user", task_description, "user")),
    ):
        msgs[msg.id] = msg
        yield ToolResponse(
            content=_convert_to_text_block(list(msgs.values())),
            stream=True,
            is_last=False,
        )
```

> **Trade-off:** this method sacrifices visibility — users cannot see the full details of sub-agent execution. However, this may be exactly what you want. Similar to how GitHub Copilot works, simply informing users that "the agent is working on a subtask" is often sufficient.

## Wrapping Up

We've walked through the key considerations for deploying multi-agent systems with AgentScope: from clarifying your requirements upfront, to managing state across custom agents, to choosing how to present agent activities to users.

These design choices don't have universal "right" answers — they depend on your specific use case and user needs. AgentScope aims to provide the flexibility to support different approaches while handling the complex parts (like state management and message streaming) for you.

We'd love to hear about your experiences. What challenges have you encountered? What design decisions worked well for your use case?

---

*Originally posted on the [AgentScope Design Book](https://github.com/agentscope-ai/agentscope/discussions/908).*
