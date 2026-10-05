import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, MessageSquare, RefreshCw, Sparkles, Terminal } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/agent-connect")({
  head: () => ({
    meta: [
      { title: "Connect an AI Assistant — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Connect ChatGPT, Claude or Claude Code to RiyasTech Hub so your AI assistant can browse placement roadmaps, core companies and coding problems.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Connect an AI Assistant — RiyasTech Hub" },
      {
        property: "og:description",
        content:
          "Connect ChatGPT, Claude or Claude Code to RiyasTech Hub so your AI assistant can browse placement roadmaps, core companies and coding problems.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AgentConnectPage,
});

const APP_NAME = "RiyasTech Hub";
const APP_SLUG = "riyastech-hub";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-muted-foreground">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 text-[10px] font-bold text-primary">
            {i + 1}
          </span>
          <span className="min-w-0 leading-relaxed">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function ClientCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function AgentConnectPage() {
  const mcpUrl =
    typeof window === "undefined"
      ? "/mcp"
      : new URL("/mcp", window.location.origin).toString();
  const claudeLink = `https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=${encodeURIComponent(
    APP_NAME,
  )}&connectorUrl=${encodeURIComponent(mcpUrl)}`;
  const claudeCodeCommand = `claude mcp add --scope user --transport http ${APP_SLUG} '${mcpUrl.replace(/'/g, `'\\''`)}'`;

  return (
    <PageShell
      eyebrow="Agent Integrations"
      title="Connect an AI Assistant"
      description="Let ChatGPT, Claude or Claude Code browse RiyasTech Hub's placement roadmaps, core company explorer and coding problems. Connecting asks you to sign in, so only approved assistants can read the content."
    >
      {/* Server URL */}
      <section className="glass rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Your server address</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is the one thing every AI assistant needs. Copy it — you'll paste it in the steps
          below.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
          <code className="min-w-0 flex-1 break-all font-mono text-sm text-primary">{mcpUrl}</code>
          <CopyButton text={mcpUrl} label="Copy address" />
        </div>
      </section>

      {/* Connect steps */}
      <h2 className="mt-10 font-display text-xl font-bold neon-text">Connect your assistant</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ClientCard icon={<MessageSquare className="h-4 w-4" />} title="ChatGPT">
          <Steps
            items={[
              <>
                Open{" "}
                <a
                  className="text-primary underline"
                  href="https://chatgpt.com/#settings/Connectors/Advanced"
                  target="_blank"
                  rel="noreferrer"
                >
                  ChatGPT connector settings
                </a>{" "}
                and turn on Developer mode. If it's unavailable, ask your ChatGPT admin to enable
                it.
              </>,
              <>
                Open the{" "}
                <a
                  className="text-primary underline"
                  href="https://chatgpt.com/plugins#settings/Connectors?create-connector=true&redirectAfter=%2Fplugins"
                  target="_blank"
                  rel="noreferrer"
                >
                  new connector dialog
                </a>
                .
              </>,
              <>
                Enter <strong className="text-foreground">{APP_NAME}</strong> as the name and paste
                the server address above.
              </>,
              <>
                Review the details, tick "I understand and want to continue" (ChatGPT shows this for
                every custom connector), then click Create.
              </>,
              <>Sign in when asked, enable the app from the chat composer, and ask ChatGPT to use it.</>,
            ]}
          />
        </ClientCard>

        <ClientCard icon={<Sparkles className="h-4 w-4" />} title="Claude">
          <Steps
            items={[
              <>
                Open the{" "}
                <a className="text-primary underline" href={claudeLink} target="_blank" rel="noreferrer">
                  prefilled connector form
                </a>{" "}
                — the name and address are already filled in.
              </>,
              <>Review the details and click Add.</>,
              <>
                If the form doesn't open, go to Claude's Connectors page, choose "Add custom
                connector", name it <strong className="text-foreground">{APP_NAME}</strong> and
                paste the server address.
              </>,
              <>Sign in when asked, enable the connector from the chat composer, and ask Claude to use it.</>,
            ]}
          />
        </ClientCard>

        <ClientCard icon={<Terminal className="h-4 w-4" />} title="Claude Code">
          <p className="mt-3 text-sm text-muted-foreground">
            Run this one line in a terminal — that's the whole install:
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-3">
            <code className="min-w-0 flex-1 break-all font-mono text-xs text-primary">
              {claudeCodeCommand}
            </code>
            <CopyButton text={claudeCodeCommand} label="Copy command" />
          </div>
          <Steps
            items={[
              <>Run the command above in any terminal.</>,
              <>
                Start Claude Code and run <code className="font-mono text-primary">/mcp</code> to
                confirm {APP_NAME} is connected. Sign in from that menu if asked.
              </>,
              <>Ask Claude Code to use the app.</>,
            ]}
          />
        </ClientCard>

        <ClientCard icon={<MessageSquare className="h-4 w-4" />} title="Other AI assistants">
          <Steps
            items={[
              <>Open your assistant's MCP server or custom connector settings.</>,
              <>Create a remote MCP server connection.</>,
              <>
                Name it <strong className="text-foreground">{APP_NAME}</strong> and paste the server
                address above.
              </>,
              <>Finish any sign-in or approval prompts.</>,
              <>Enable the connection and ask the assistant to use the app.</>,
            ]}
          />
        </ClientCard>
      </div>

      {/* Refresh steps */}
      <h2 className="mt-10 flex items-center gap-2 font-display text-xl font-bold neon-text">
        <RefreshCw className="h-5 w-5 text-primary" />
        After the app changes
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        A connected assistant remembers the tool list from when you connected. When RiyasTech Hub
        ships updates, refresh the connection to get the latest tools.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ClientCard icon={<MessageSquare className="h-4 w-4" />} title="ChatGPT">
          <Steps
            items={[
              <>Open ChatGPT's Plugins page and select {APP_NAME}.</>,
              <>Scroll to "Information" and click Refresh.</>,
              <>
                ChatGPT can't update an existing connector's address — if it changed, delete the
                connector and repeat the connect steps with the latest address.
              </>,
              <>Start a new chat and ask ChatGPT to use the app.</>,
            ]}
          />
        </ClientCard>

        <ClientCard icon={<Sparkles className="h-4 w-4" />} title="Claude">
          <Steps
            items={[
              <>Open the Connectors page and select {APP_NAME}.</>,
              <>Refresh or update the connector's tools.</>,
              <>
                Claude can't update an existing connector's address — if it changed, remove the
                connector and repeat the connect steps with the latest address.
              </>,
              <>Ask Claude to use the app.</>,
            ]}
          />
        </ClientCard>

        <ClientCard icon={<Terminal className="h-4 w-4" />} title="Claude Code">
          <Steps
            items={[
              <>Start a new Claude Code session — it loads the latest tools when it connects.</>,
              <>
                If the address changed, run{" "}
                <code className="font-mono text-primary">claude mcp remove {APP_SLUG}</code>, then
                run the install command again with the latest address.
              </>,
              <>Ask Claude Code to use the app.</>,
            ]}
          />
        </ClientCard>

        <ClientCard icon={<MessageSquare className="h-4 w-4" />} title="Other AI assistants">
          <Steps
            items={[
              <>Open your assistant's MCP server or connector settings.</>,
              <>Select the connection you created for {APP_NAME}.</>,
              <>Refresh the tool list, reload the server, or reconnect it.</>,
              <>If the address changed, paste the latest address from above.</>,
              <>Start a new chat or session and ask the assistant to use the app.</>,
            ]}
          />
        </ClientCard>
      </div>
    </PageShell>
  );
}
