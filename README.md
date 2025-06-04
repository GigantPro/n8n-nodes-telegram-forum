# n8n-nodes-telegram-forum

> Create and manage Telegram forum topics (message threads) inside your n8n workflows (and expose them as tools for AI Agents).

This community node lets you call Telegram’s Bot API `createForumTopic` method to spin up new forum threads inside a supergroup. It works both as a regular workflow node and—thanks to `usableAsTool: true`—as a tool that AI Agent nodes can invoke.


## Table of Contents

1. [Installation](#installation)  
2. [Credentials](#credentials)  
3. [Environment Variables](#environment-variables)  
4. [Operations](#operations)  
5. [Using as a Tool](#using-as-a-tool)  
6. [Compatibility](#compatibility)  
7. [Resources](#resources)  
8. [License](#license)  
9. [Author](#author)

---

## Installation

There are two common ways to install this node:

### 1. From npm (public registry)

```bash
npm install n8n-nodes-telegram-forum
# or with yarn
yarn add n8n-nodes-telegram-forum
````

Once installed, copy its compiled files (`dist/`) into your n8n instance’s custom-nodes folder:

```bash
mkdir -p ~/.n8n/custom/nodes/telegram-forum
cp -R node_modules/n8n-nodes-telegram-forum/dist/* ~/.n8n/custom/nodes/telegram-forum/
```

Then restart n8n (`n8n start` or your system/service manager).

### 2. Local development

If you cloned or downloaded this repo:

1. In the project root, install dependencies and build:

   ```bash
   npm install
   npm run build
   ```
2. Copy `dist/` to `~/.n8n/custom/nodes/telegram-forum`:

   ```bash
   mkdir -p ~/.n8n/custom/nodes/telegram-forum
   cp -R dist/* ~/.n8n/custom/nodes/telegram-forum/
   ```
3. Restart n8n.

> **Tip:** If you use Docker, mount your local `dist/` as `/home/node/.n8n/custom/nodes/telegram-forum` inside the container.

---

## Credentials

Before you can create forum topics, you’ll need a valid **Telegram Bot API** credential in n8n:

1. Go to **Settings → Credentials → New Credential** and choose **Telegram API**.
2. Enter your **Bot Token** (obtained from BotFather).
3. Make sure this bot is an **administrator** in the target supergroup with the **“can\_manage\_topics”** permission enabled.

Without a valid token and proper chat permissions, any call to `createForumTopic` will fail.

---

## Environment Variables

To allow AI Agents in n8n to use this node as a tool, set the following environment variable:

```bash
export N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

* **If you run n8n natively** (e.g. via `n8n start` or systemd/PM2), add that line to your shell profile (e.g. `~/.bashrc` or `~/.zshrc`) before restarting.
* **If you use Docker Compose**, include:

  ```yaml
  environment:
    - N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
  ```

  in your `docker-compose.yml` under the n8n service.

> **Why?**
> n8n by default only exposes built-in nodes as tools for AI Agents. This flag allows community-contributed nodes (like ours) to appear in the **Tools** pane of any Agent‐type node.

---

## Operations

This node implements exactly one operation:

### Create Forum Topic

* **Node Label:** `Telegram: Create Forum Topic`

* **What it does:** Calls `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/createForumTopic` under the hood.

* **Inputs:**

  1. **Chat ID** (string, required) – The numeric (or “-100…”-prefixed) ID of a Telegram supergroup that has **Forum (Topics)** enabled.
  2. **Title** (string, required) – The name/headline of the new topic (cannot be empty).
  3. **Icon Custom Emoji ID** (string, optional) – If you want a custom emoji icon for this topic, specify its ID.

* **Output:**
  A JSON object exactly as returned by Telegram’s Bot API, for example:

  ```jsonc
  {
    "ok": true,
    "result": {
      "message_thread_id": 123456789,
      "name": "My New Topic",
      "icon_custom_emoji_id": null,
      "is_closed": false,
      "is_hidden": false
    }
  }
  ```

1. **Drag** the node onto your workflow.
2. **Configure** the three properties (Chat ID, Title, Icon Custom Emoji ID).
3. **Execute** – The node will return Telegram’s response in its output.

---

## Using as a Tool

Thanks to `"usableAsTool": true` in our `node.json`, this node appears in the **Tools** list inside any AI Agent or Tools Agent node, provided you set `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true`.

1. Ensure your environment variable is set (see [Environment Variables](#environment-variables) above).
2. Restart n8n so it reloads custom nodes.
3. Create or open a workflow and add an **AI Agent** node (or any agent node that supports tools).
4. In the Agent’s **Tools** configuration, tick **“Telegram: Create Forum Topic”** to make it available.
5. Now the Agent can issue:

   ```json
   {
     "tool": "telegramForumTopic",
     "parameters": {
       "chatId": "-1001234567890",
       "title": "Agent-Created Topic",
       "iconCustomEmojiId": ""
     }
   }
   ```

   and n8n will run the node on its behalf.
6. The response (JSON from Telegram) will be fed back into the Agent.

> **Tip:** If you rename the node label or change its internal `name`, update the `"tool": "<internalName>"` accordingly.

---

## Compatibility

* **n8n version:** Tested on **1.80.0** and later. Should work on any n8n ≥1.75.0.
* **Node.js version:** ≥14.x (ideally Node 18 or later).
* **Telegram Bot API version:** `createForumTopic` is available since Bot API 6.2 (September 2022).
* **Telegram Chat type:** The target chat must be a **supergroup** with **“Forum (Topics)”** enabled. Otherwise, Telegram returns an error.

> **Common Errors:**
>
> * `400: Bad Request: chat not found` → Wrong Chat ID or bot not a member/administrator.
> * `400: Bad Request: message_thread has no creator` → Chat isn’t a forum or topic threads aren’t enabled.
> * `400: Bad Request: title must be non-empty` → You passed an empty string for `title`.

---

## Resources

* **Telegram Bot API docs (createForumTopic)**
  [https://core.telegram.org/bots/api#createforumtopic](https://core.telegram.org/bots/api#createforumtopic)
* **n8n Community Nodes Guide**
  [https://docs.n8n.io/integrations/community-nodes/](https://docs.n8n.io/integrations/community-nodes/)
* **AI Agents & Tools in n8n**
  [https://docs.n8n.io/integrations/builtin/nodes/Core/Agent/](https://docs.n8n.io/integrations/builtin/nodes/Core/Agent/)

---

## License

MIT © [GigantPro](mailto:pochtagigantpro@gmail.com)

---

## Author

**GigantPro**
Email: [pochtagigantpro@gmail.com](mailto:pochtagigantpro@gmail.com)
GitHub: [https://github.com/GigantPro](https://github.com/GigantPro)

> Happy automating! 🚀
> — *GigantPro*

```

**How to apply:**

1. In your repo, replace the existing `README.md` with the content above.  
2. Ensure your `src/node.json` (and therefore `dist/node.json`) has English labels/descriptions exactly as shown here.  
3. Rebuild (`npm install && npm run build`) so that `dist/` picks up any changes.  
4. Copy updated `dist/` into `~/.n8n/custom/nodes/telegram-forum` and restart n8n.  

You will now have a polished, English-language README that mirrors the structure and style of the official n8n-nodes-mcp README, complete with Installation, Credentials, Environment Variables, Operations, Using as a Tool, Compatibility, Resources, License, and Author sections.
::contentReference[oaicite:0]{index=0}
```
