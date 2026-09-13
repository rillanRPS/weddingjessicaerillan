import { useEffect, useState, type FormEvent } from "react";
import { Clock3, Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "./Reveal";

type GuestbookMessage = { id: string; name: string; message: string; created_at: string };
const TOKEN_KEY = "jessica-rillan-guestbook-tokens";
const DELETE_WINDOW = 10 * 60 * 1000;

function getTokens(): Record<string, string> {
  try { return JSON.parse(window.localStorage.getItem(TOKEN_KEY) || "{}"); } catch { return {}; }
}

function newToken() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36);
}

export function Guestbook() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadMessages = async () => {
    const { data, error } = await supabase.from("guestbook_messages").select("id, name, message, created_at").order("created_at", { ascending: false }).limit(60);
    if (error) { setLoadingError(true); setLoading(false); return; }
    setMessages((data || []) as GuestbookMessage[]);
    setLoadingError(false);
    setLoading(false);
  };

  useEffect(() => {
    setTokens(getTokens());
    void loadMessages();
    const refresh = window.setInterval(() => void loadMessages(), 30000);
    const clock = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { window.clearInterval(refresh); window.clearInterval(clock); };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanMessage = message.trim();
    if (!cleanName || !cleanMessage) { toast.error("Informe seu nome e escreva um recado."); return; }
    setSending(true);
    const deleteToken = newToken();
    const { data, error } = await supabase.from("guestbook_messages").insert({ name: cleanName, message: cleanMessage, delete_token: deleteToken }).select("id, name, message, created_at").single();
    setSending(false);
    if (error) { toast.error("Não conseguimos publicar seu recado agora."); return; }
    const item = data as GuestbookMessage;
    const nextTokens = { ...tokens, [item.id]: deleteToken };
    setTokens(nextTokens);
    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(nextTokens));
    setMessages((current) => [item, ...current]);
    setName("");
    setMessage("");
    toast.success("Seu recado foi deixado com carinho.");
  };

  const remove = async (id: string) => {
    const deleteToken = tokens[id];
    if (!deleteToken) return;
    setDeleting(id);
    const { data, error } = await supabase.rpc("delete_guestbook_message", { p_message_id: id, p_delete_token: deleteToken });
    setDeleting(null);
    if (error || data !== true) { toast.error("O prazo para apagar este recado terminou."); return; }
    setMessages((current) => current.filter((item) => item.id !== id));
    const nextTokens = { ...tokens };
    delete nextTokens[id];
    setTokens(nextTokens);
    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(nextTokens));
    toast.success("Seu recado foi apagado.");
  };

  return (
    <section id="recados" className="relative overflow-hidden bg-cream py-24 md:py-28">
      <div className="guestbook-orb guestbook-orb-left" aria-hidden="true" />
      <div className="guestbook-orb guestbook-orb-right" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Livro de memórias</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Deixe um recado para nós</h2>
          <div className="rule-soft mx-auto mt-6 w-24" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">Uma palavra sua tornará este dia ainda mais especial. Escreva uma lembrança, um desejo ou um carinho para guardarmos para sempre.</p>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:items-start">
          <Reveal className="guestbook-form surface p-6 sm:p-8" delay={80}>
            <div className="flex items-center gap-3 text-sage-deep"><span className="flex size-11 items-center justify-center rounded-full bg-sage/50"><Heart className="size-5" /></span><div><p className="eyebrow">Sua mensagem</p><p className="font-serif text-2xl text-foreground">Com carinho, deixe sua marca</p></div></div>
            <form className="mt-7 space-y-4" onSubmit={submit}>
              <div className="space-y-2"><label htmlFor="guestbook-name" className="text-sm font-medium text-foreground">Seu nome</label><Input id="guestbook-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} placeholder="Como podemos chamar você?" required /></div>
              <div className="space-y-2"><label htmlFor="guestbook-message" className="text-sm font-medium text-foreground">Seu recado</label><Textarea id="guestbook-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} rows={5} placeholder="Escreva uma mensagem para os noivos…" required /></div>
              <Button type="submit" className="glow-cta w-full" disabled={sending}><Send className="mr-2 size-4" />{sending ? "Publicando…" : "Publicar recado"}</Button>
              <p className="flex items-center gap-2 text-xs leading-relaxed text-muted-foreground"><Clock3 className="size-3.5 shrink-0" />Você poderá apagar seu próprio recado por até 10 minutos neste dispositivo.</p>
            </form>
          </Reveal>
          <Reveal className="min-w-0" delay={160}>
            <div className="mb-4 flex items-center justify-between gap-3"><div><p className="eyebrow">Palavras que ficam</p><p className="mt-1 font-serif text-2xl text-foreground">Recados dos nossos convidados</p></div><MessageCircle className="size-6 text-gold" aria-hidden="true" /></div>
            {loading && <div className="space-y-4" aria-label="Carregando recados"><div className="h-32 animate-pulse rounded-2xl bg-background/70" /><div className="h-32 animate-pulse rounded-2xl bg-background/70" /></div>}
            {!loading && loadingError && <div role="alert" className="rounded-2xl border border-border/70 bg-background/70 p-6 text-base text-muted-foreground">O livro de memórias estará disponível em instantes. Tente novamente.</div>}
            {!loading && !loadingError && messages.length === 0 && <div className="rounded-2xl border border-dashed border-gold/50 bg-background/60 p-8 text-center"><Heart className="mx-auto size-6 text-gold" /><p className="mt-3 font-serif text-2xl text-foreground">Seja o primeiro a escrever</p><p className="mt-2 text-base text-muted-foreground">A primeira lembrança deste mural pode ser sua.</p></div>}
            <div className="space-y-4">{messages.map((item) => { const canDelete = Boolean(tokens[item.id]) && now - new Date(item.created_at).getTime() < DELETE_WINDOW; return <article key={item.id} className="guestbook-card surface p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="font-serif text-2xl text-foreground">{item.name}</p><p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">{new Date(item.created_at).toLocaleDateString("pt-BR")}</p></div>{canDelete && <button type="button" onClick={() => void remove(item.id)} disabled={deleting === item.id} className="press inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs text-muted-foreground hover:border-destructive hover:text-destructive" aria-label={"Apagar recado de " + item.name}><Trash2 className="size-3.5" /> Apagar</button>}</div><p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">{item.message}</p>{canDelete && <p className="mt-4 text-xs text-gold-deep">Você ainda pode apagar este recado por {Math.ceil(Math.max(0, DELETE_WINDOW - (now - new Date(item.created_at).getTime())) / 60000)} min.</p>}</article>; })}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
