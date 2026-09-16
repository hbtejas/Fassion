from langsmith import traceable, get_current_run_tree
from src.backend.app.models.schemas import AgentResponse, State
from jinja2 import Template
import instructor
from litellm import completion
from langchain_core.messages import convert_to_openai_messages
from src.backend.app.utils.utils import format_ai_message
from src.backend.app.config import settings
from src.backend.app.dependencies import deps


@traceable(
    name="agent_node",
    run_type="llm",
    metadata={
        "ls_provider": "openai",
        "ls_model_name": settings.llm_model
    },
)
def agent_node(state: State) -> dict:

    try:
        prompt_template = deps.prompt_manager.get_prompt("agent")
    except Exception:
        # Fallback: load from local prompts directory
        import yaml
        import os
        agent_prompt_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "prompts", "agent.yaml")
        agent_prompt_path = os.path.normpath(agent_prompt_path)
        with open(agent_prompt_path, "r") as file:
            prompt_template = yaml.safe_load(file)["prompt"]

    template = Template(prompt_template)

    prompt = template.render(available_tools=state.available_tools)

    conversations = []
    messages = state.messages

    for message in messages:
        msg = convert_to_openai_messages(message)
        if isinstance(msg, dict):
            if msg.get("role") == "tool":
                conversations.append({
                    "role": "user",
                    "content": f"[Tool Result]: {msg.get('content')}"
                })
            elif msg.get("role") == "assistant" and "gemini" in settings.llm_model:
                conversations.append({
                    "role": "assistant",
                    "content": msg.get("content") or ""
                })
            else:
                conversations.append(msg)
        else:
            conversations.append(msg)

    mode = instructor.Mode.MD_JSON if "gemini" in settings.llm_model else instructor.Mode.TOOLS
    client = instructor.from_litellm(completion, mode=mode)
    response, raw_response = client.chat.completions.create_with_completion(
        model=settings.llm_model,
        response_model=AgentResponse,
        messages=[{
            "role": "system",
            "content": prompt
        }, *conversations],
    )

    ai_message = format_ai_message(response)
    for image in (response.images or []):
        state.images.append(image)

    current_run = get_current_run_tree()

    if current_run and hasattr(raw_response, "usage") and raw_response.usage:
        current_run.metadata["usage_metadata"] = {
            "input_tokens": getattr(raw_response.usage, "prompt_tokens", 0),
            "output_tokens": getattr(raw_response.usage, "completion_tokens", 0),
            "total_tokens": getattr(raw_response.usage, "total_tokens", 0)
        }

    return {
        "messages": [ai_message],
        "tool_calls": response.tool_calls,
        "iteration": state.iteration + 1,
        "answer": response.answer,
        "final_answer": response.final_answer,
        "images": state.images,
        "analysis": response.analysis or state.analysis,
        "products": (state.products or []) + (response.products or []),
    }
