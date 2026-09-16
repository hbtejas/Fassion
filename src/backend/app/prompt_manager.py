from langsmith import Client
from typing import Any
import os
import yaml

url_template = "farrosalferro/{agent}-prompt:latest"
PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "prompts")
PROMPTS_DIR = os.path.normpath(PROMPTS_DIR)


class PromptManager:

    def __init__(self, auto_load: bool = True):
        self._prompts: dict[str, Any] = {}
        self._use_local = False
        try:
            self.client = Client()
        except Exception:
            self.client = None
            self._use_local = True
        if auto_load:
            self.load_all()

    def _load_local_prompt(self, agent: str) -> str:
        """Load a prompt template from the local prompts/ directory."""
        path = os.path.join(PROMPTS_DIR, f"{agent}.yaml")
        if not os.path.exists(path):
            raise FileNotFoundError(f"Local prompt file not found: {path}")
        with open(path, "r") as f:
            data = yaml.safe_load(f)
        return data["prompt"]

    def load_all(self) -> None:
        agents = ["agent", "descriptor", "recommender", "vton"]
        if not self._use_local and self.client:
            try:
                for agent in agents:
                    self._prompts[agent] = self.client.pull_prompt(url_template.format(agent=agent))
                return
            except Exception:
                self._use_local = True

        # Fallback to local prompts
        for agent in agents:
            self._prompts[agent] = self._load_local_prompt(agent)

    def get_prompt(self, agent: str) -> str:
        prompt = self._prompts.get(agent)
        if prompt is None:
            raise ValueError(f"Prompt for {agent} not found")

        if self._use_local:
            # Local prompts are already plain strings
            return prompt

        try:
            return prompt.messages[0].prompt.template
        except Exception as e:
            raise ValueError(f"Failed to get prompt for {agent}: {e}")

    def refresh(self, name: str = None) -> None:
        if name:
            if self._use_local:
                self._prompts[name] = self._load_local_prompt(name)
            else:
                self._prompts[name] = self.client.pull_prompt(url_template.format(agent=name))
        else:
            self.load_all()

