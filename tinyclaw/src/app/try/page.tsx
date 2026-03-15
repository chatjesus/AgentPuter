import DemoChat from "@/components/DemoChat";

export const metadata = {
  title: "Try OpenClaw Free — TinyClaw",
  description: "Talk to a live OpenClaw AI agent. No sign-up required. 10 free messages.",
};

export default function TryPage() {
  return <DemoChat inline={false} />;
}
