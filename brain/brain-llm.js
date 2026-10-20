const DEFAULT_ENDPOINT = 'http://localhost:11434/api/chat';

export class OllamaClient {
  constructor({ endpoint = DEFAULT_ENDPOINT, model = 'llama3.2', fetchImpl = globalThis.fetch } = {}) { this.endpoint = endpoint; this.model = model; this.fetch = fetchImpl; }
  async chat(messages, options = {}) {
    if (!this.fetch) throw new Error('Fetch is unavailable in this runtime');
    const response = await this.fetch(this.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model: options.model ?? this.model, messages, stream: false, options: options.options }) });
    if (!response.ok) throw new Error(`Ollama request failed: HTTP ${response.status}`);
    return response.json();
  }
}

export class BrainLLM {
  constructor({ client, contextBuilder = x => x } = {}) { this.client = client; this.contextBuilder = contextBuilder; }
  async ask(prompt, context = {}) {
    const messages = [{ role: 'system', content: 'You are Brain LLM, the application-level AI engine. Respect runtime permissions and return structured, verifiable work.' }, { role: 'user', content: JSON.stringify({ prompt, context: this.contextBuilder(context) }) }];
    return this.client.chat(messages);
  }
}
