import { useMemo, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Edit3,
  Eye,
  FileText,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth.tsx';

type SessionStatus = 'confirmed' | 'pending' | 'completed';
type Priority = 'high' | 'medium' | 'low';
type ClientStatus = 'active' | 'inactive' | 'high risk';
type CalendarMode = 'week' | 'month';
type SessionView = 'list' | 'calendar';

interface Client {
  id: string;
  name: string;
  age: number;
  status: ClientStatus;
  risk: Priority;
  lastSession: string;
  nextSession: string;
  focus: string;
  phone: string;
}

interface Session {
  id: string;
  client: string;
  date: string;
  day: string;
  time: string;
  status: SessionStatus;
  type: string;
}

interface Request {
  id: string;
  client: string;
  reason: string;
  priority: Priority;
  requested: string;
}

interface Message {
  id: string;
  client: string;
  preview: string;
  time: string;
  unread: boolean;
}

interface Note {
  id: string;
  client: string;
  title: string;
  summary: string;
  updated: string;
  progress: string;
}

const clients: Client[] = [
  {
    id: 'c1',
    name: 'Mekdes A.',
    age: 24,
    status: 'active',
    risk: 'medium',
    lastSession: 'Jun 3, 2026',
    nextSession: 'Jun 7, 2026',
    focus: 'Anxiety management and sleep routine',
    phone: '+251 91 000 1122',
  },
  {
    id: 'c2',
    name: 'Dawit K.',
    age: 31,
    status: 'high risk',
    risk: 'high',
    lastSession: 'Jun 2, 2026',
    nextSession: 'Today',
    focus: 'Crisis stabilization and support planning',
    phone: '+251 91 000 1844',
  },
  {
    id: 'c3',
    name: 'Sara T.',
    age: 19,
    status: 'active',
    risk: 'low',
    lastSession: 'May 29, 2026',
    nextSession: 'Jun 10, 2026',
    focus: 'Transition stress and confidence building',
    phone: '+251 91 000 2450',
  },
  {
    id: 'c4',
    name: 'Henok B.',
    age: 28,
    status: 'inactive',
    risk: 'low',
    lastSession: 'May 18, 2026',
    nextSession: 'Follow-up pending',
    focus: 'Maintenance plan and relapse prevention',
    phone: '+251 91 000 3109',
  },
];

const sessions: Session[] = [
  { id: 's1', client: 'Dawit K.', date: 'Today', day: 'Fri', time: '10:30 AM', status: 'confirmed', type: 'Therapy session' },
  { id: 's2', client: 'Mekdes A.', date: 'Jun 7', day: 'Sun', time: '2:00 PM', status: 'pending', type: 'Follow-up' },
  { id: 's3', client: 'Sara T.', date: 'Jun 10', day: 'Wed', time: '9:00 AM', status: 'confirmed', type: 'Counseling' },
  { id: 's4', client: 'Henok B.', date: 'Jun 12', day: 'Fri', time: '4:30 PM', status: 'completed', type: 'Review session' },
];

const requests: Request[] = [
  { id: 'r1', client: 'Liya M.', reason: 'Panic symptoms after exams and trouble sleeping.', priority: 'high', requested: '18 min ago' },
  { id: 'r2', client: 'Samuel N.', reason: 'Requesting support with grief and family pressure.', priority: 'medium', requested: '1 hr ago' },
  { id: 'r3', client: 'Betelhem W.', reason: 'Needs approval for a first counseling appointment.', priority: 'low', requested: 'Yesterday' },
];

const messages: Message[] = [
  { id: 'm1', client: 'Mekdes A.', preview: 'I completed the breathing exercise yesterday evening.', time: '9:12 AM', unread: true },
  { id: 'm2', client: 'Dawit K.', preview: 'Can we start ten minutes earlier today?', time: '8:40 AM', unread: true },
  { id: 'm3', client: 'Sara T.', preview: 'Thank you, the worksheet helped me organize my thoughts.', time: 'Yesterday', unread: false },
];

const notes: Note[] = [
  {
    id: 'n1',
    client: 'Dawit K.',
    title: 'Safety plan review',
    summary: 'Updated coping contacts, grounding sequence, and next-session check-in goals.',
    updated: 'Today, 11:20 AM',
    progress: 'Stabilizing',
  },
  {
    id: 'n2',
    client: 'Mekdes A.',
    title: 'Sleep routine tracking',
    summary: 'Client reported two nights of improved sleep after reducing late caffeine.',
    updated: 'Yesterday',
    progress: 'Improving',
  },
  {
    id: 'n3',
    client: 'Sara T.',
    title: 'Confidence worksheet',
    summary: 'Discussed academic pressure triggers and practiced reframing statements.',
    updated: 'Jun 1, 2026',
    progress: 'Steady',
  },
];

const timeline = [
  { icon: Check, title: 'Session completed', detail: 'Dawit K. therapy session marked complete', time: '35 min ago' },
  { icon: Edit3, title: 'Notes added', detail: 'Private note created for Mekdes A.', time: '2 hrs ago' },
  { icon: Activity, title: 'Client update', detail: 'Sara T. completed a weekly check-in', time: 'Yesterday' },
  { icon: ShieldCheck, title: 'System notification', detail: 'Privacy review passed for assigned-client access', time: 'Jun 3' },
];

const statusVariant: Record<SessionStatus | ClientStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  confirmed: 'success',
  pending: 'warning',
  completed: 'default',
  active: 'success',
  inactive: 'default',
  'high risk': 'danger',
};

const priorityVariant: Record<Priority, 'success' | 'warning' | 'danger'> = {
  high: 'danger',
  medium: 'warning',
  low: 'success',
};

const pageTitles: Record<string, string> = {
  dashboard: 'Professional Dashboard',
  clients: 'Clients',
  sessions: 'Sessions',
  messages: 'Messages',
  calendar: 'Calendar',
  notes: 'Notes',
};

const sectionFromPath = (pathname: string) => {
  const section = pathname.split('/')[2] || 'dashboard';
  return pageTitles[section] ? section : 'dashboard';
};

const ProfessionalDashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const section = sectionFromPath(location.pathname);
  const displayName = user?.email ? user.email.split('@')[0] : 'professional';

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Link to="/professional" className="text-slate-700 hover:text-emerald-700">Professional</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{pageTitles[section]}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {pageTitles[section]}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            A calm clinical workspace for assigned care, secure sessions, and private notes.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3 py-2 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">Dr. {displayName}</p>
            <p className="text-xs font-medium text-slate-500">Assigned-client access only</p>
          </div>
        </div>
      </div>

      {section === 'dashboard' && <DashboardHome />}
      {section === 'clients' && <ClientsPage />}
      {section === 'sessions' && <SessionsPage />}
      {section === 'messages' && <MessagesPage />}
      {section === 'calendar' && <CalendarPage />}
      {section === 'notes' && <NotesPage />}
    </div>
  );
};

const DashboardHome = () => {
  const stats = [
    { label: 'Active Clients', value: 3, icon: Users, tone: 'emerald' },
    { label: 'Upcoming Sessions', value: 4, icon: Calendar, tone: 'sky' },
    { label: 'Completed Sessions', value: 28, icon: Check, tone: 'teal' },
    { label: 'Pending Requests', value: 3, icon: Clock, tone: 'amber' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Upcoming Sessions" description="Scheduled care with quick actions.">
          <div className="divide-y divide-slate-100">
            {sessions.slice(0, 3).map((session) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </div>
        </Panel>

        <Panel title="Session Requests" description="Review requests before accepting care.">
          <div className="space-y-3">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Recent Messages" description="Secure one-on-one client conversations.">
          <div className="space-y-3">
            {messages.map((message) => (
              <MessagePreview key={message.id} message={message} />
            ))}
          </div>
        </Panel>

        <Panel title="Activity Timeline" description="Recent clinical actions and system events.">
          <div className="space-y-4">
            {timeline.map((item) => (
              <div key={item.title + item.time} className="flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <span className="text-xs font-medium text-slate-500">{item.time}</span>
                  </div>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};

const SessionsPage = () => {
  const [view, setView] = useState<SessionView>('list');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="Search sessions by client or status"
          />
        </div>
        <SegmentedControl
          value={view}
          options={[
            { label: 'List', value: 'list' },
            { label: 'Calendar', value: 'calendar' },
          ]}
          onChange={(value) => setView(value as SessionView)}
        />
      </div>

      {view === 'list' ? (
        <Panel title="All Scheduled Sessions" description="Accept, reschedule, complete, and document sessions.">
          <div className="divide-y divide-slate-100">
            {sessions.map((session) => (
              <SessionRow key={session.id} session={session} showFullActions />
            ))}
          </div>
        </Panel>
      ) : (
        <CalendarGrid mode="week" />
      )}
    </div>
  );
};

const ClientsPage = () => {
  const [selectedClientId, setSelectedClientId] = useState(clients[0].id);
  const selected = useMemo(() => clients.find((client) => client.id === selectedClientId) || clients[0], [selectedClientId]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Panel title="Assigned Clients" description="Only clients assigned to your care are shown.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-2 py-3">Name</th>
                <th className="px-2 py-3">Status</th>
                <th className="px-2 py-3">Last Session</th>
                <th className="px-2 py-3">Contact</th>
                <th className="px-2 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className={`cursor-pointer transition hover:bg-emerald-50/30 ${selectedClientId === client.id ? 'bg-emerald-50/60' : ''}`}
                  onClick={() => setSelectedClientId(client.id)}
                >
                  <td className="px-2 py-4">
                    <p className="font-semibold text-slate-950">{client.name}</p>
                    <p className="text-xs text-slate-500">{client.focus}</p>
                  </td>
                  <td className="px-2 py-4"><Badge variant={statusVariant[client.status]}>{client.status}</Badge></td>
                  <td className="px-2 py-4 text-slate-600">{client.lastSession}</td>
                  <td className="px-2 py-4">
                    <Button size="sm" variant="secondary" leftIcon={<MessageSquare className="h-4 w-4" />}>Message</Button>
                  </td>
                  <td className="px-2 py-4">
                    <Button size="sm" variant="ghost" leftIcon={<FileText className="h-4 w-4" />}>Open</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Client Profile" description="Summary, risk level, history, and notes.">
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{selected.name}</h2>
                <p className="text-sm text-slate-600">Age {selected.age} · {selected.focus}</p>
              </div>
              <Badge variant={priorityVariant[selected.risk]}>{selected.risk} risk</Badge>
            </div>
            <div className="grid gap-3 text-sm">
              <InfoRow label="Last session" value={selected.lastSession} />
              <InfoRow label="Next session" value={selected.nextSession} />
              <InfoRow label="Phone" value={selected.phone} />
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-slate-950">Session History</h3>
            <div className="space-y-2">
              {['Initial assessment completed', 'Care plan reviewed', 'Grounding practice assigned'].map((item) => (
                <div key={item} className="rounded-lg border border-slate-100 p-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-slate-950">Private Notes</h3>
            <p className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-sm text-slate-700">
              Notes are visible only to the assigned professional and admins.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
};

const MessagesPage = () => {
  const active = messages[0];

  return (
    <div className="grid min-h-[640px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card lg:grid-cols-[320px_1fr]">
      <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
        <div className="border-b border-slate-100 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              placeholder="Search clients"
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {messages.map((message) => (
            <button key={message.id} className="flex w-full gap-3 p-4 text-left transition hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-700">
                {message.client.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-slate-950">{message.client}</p>
                  {message.unread && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
                </div>
                <p className="line-clamp-1 text-sm text-slate-600">{message.preview}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-h-[520px] flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div>
            <h2 className="font-semibold text-slate-950">{active.client}</h2>
            <p className="text-xs font-medium text-emerald-700">Secure one-on-one conversation</p>
          </div>
          <Badge variant="primary">encrypted</Badge>
        </div>
        <div className="flex-1 space-y-4 bg-slate-50/60 p-4">
          <ChatBubble side="client" text="I completed the breathing exercise yesterday evening." time="9:12 AM" />
          <ChatBubble side="professional" text="That is good progress. What did you notice before and after the exercise?" time="9:14 AM" />
          <ChatBubble side="client" text="My chest felt less tight after a few minutes, and I could sleep earlier." time="9:16 AM" />
        </div>
        <div className="border-t border-slate-100 p-4">
          <div className="flex gap-3">
            <input
              className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              placeholder="Write a secure message"
            />
            <Button>Send</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const CalendarPage = () => {
  const [mode, setMode] = useState<CalendarMode>('week');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-950">Scheduling Calendar</h2>
          <p className="text-sm text-slate-600">Upcoming sessions, follow-ups, and pending appointments.</p>
        </div>
        <SegmentedControl
          value={mode}
          options={[
            { label: 'Weekly', value: 'week' },
            { label: 'Monthly', value: 'month' },
          ]}
          onChange={(value) => setMode(value as CalendarMode)}
        />
      </div>
      <CalendarGrid mode={mode} />
    </div>
  );
};

const NotesPage = () => (
  <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
    <Panel title="Client Notes" description="Private workspace for care summaries and progress tracking.">
      <div className="mb-4">
        <Button className="w-full" leftIcon={<Plus className="h-4 w-4" />}>Create Note</Button>
      </div>
      <div className="space-y-3">
        {notes.map((note) => (
          <button key={note.id} className="w-full rounded-lg border border-slate-100 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/30">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-semibold text-slate-950">{note.client}</p>
              <Badge variant="primary">{note.progress}</Badge>
            </div>
            <p className="line-clamp-1 text-sm font-medium text-slate-700">{note.title}</p>
            <p className="text-xs text-slate-500">{note.updated}</p>
          </button>
        ))}
      </div>
    </Panel>

    <Panel title="Session Summary" description="Only the assigned professional and admins can view these notes.">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Client</span>
            <select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
              {clients.map((client) => <option key={client.id}>{client.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Progress</span>
            <select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
              <option>Improving</option>
              <option>Steady</option>
              <option>Needs attention</option>
              <option>Stabilizing</option>
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Session notes</span>
          <textarea
            rows={8}
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            defaultValue="Client practiced grounding routine and identified two reliable support contacts. Continue monitoring sleep and anxiety intensity before next session."
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" leftIcon={<RefreshCw className="h-4 w-4" />}>Update Draft</Button>
          <Button leftIcon={<Check className="h-4 w-4" />}>Save Note</Button>
        </div>
      </div>
    </Panel>
  </div>
);

const StatCard = ({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: number; tone: string }) => {
  const tones: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
    teal: 'bg-teal-50 text-teal-700 ring-teal-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};

const Panel = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => (
  <section className="rounded-xl border border-slate-200 bg-white shadow-card">
    <div className="border-b border-slate-100 px-5 py-4">
      <h2 className="font-semibold text-slate-950">{title}</h2>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
    <div className="p-5">{children}</div>
  </section>
);

const SessionRow = ({ session, showFullActions = false }: { session: Session; showFullActions?: boolean }) => (
  <div className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between">
    <div className="flex gap-3">
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700">
        <span className="text-xs font-semibold">{session.day}</span>
        <span className="text-[11px] font-medium">{session.date}</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-950">{session.client}</p>
          <Badge variant={statusVariant[session.status]}>{session.status}</Badge>
        </div>
        <p className="text-sm text-slate-600">{session.type} · {session.time}</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="secondary" leftIcon={<Eye className="h-4 w-4" />}>View</Button>
      {session.status !== 'completed' && <Button size="sm" leftIcon={<Stethoscope className="h-4 w-4" />}>Start</Button>}
      {showFullActions && (
        <>
          <Button size="sm" variant="ghost" leftIcon={<RefreshCw className="h-4 w-4" />}>Reschedule</Button>
          <Button size="sm" variant="ghost" leftIcon={<FileText className="h-4 w-4" />}>Notes</Button>
          <Button size="sm" variant="ghost" leftIcon={<Check className="h-4 w-4" />}>Complete</Button>
        </>
      )}
    </div>
  </div>
);

const RequestCard = ({ request }: { request: Request }) => (
  <div className="rounded-lg border border-slate-100 p-4">
    <div className="mb-2 flex items-start justify-between gap-3">
      <div>
        <p className="font-semibold text-slate-950">{request.client}</p>
        <p className="text-xs font-medium text-slate-500">{request.requested}</p>
      </div>
      <Badge variant={priorityVariant[request.priority]}>{request.priority}</Badge>
    </div>
    <p className="mb-4 line-clamp-2 text-sm text-slate-600">{request.reason}</p>
    <div className="flex gap-2">
      <Button size="sm" leftIcon={<Check className="h-4 w-4" />}>Accept</Button>
      <Button size="sm" variant="secondary" leftIcon={<X className="h-4 w-4" />}>Reject</Button>
    </div>
  </div>
);

const MessagePreview = ({ message }: { message: Message }) => (
  <div className="flex items-start gap-3 rounded-lg border border-slate-100 p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
      {message.client.slice(0, 1)}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-slate-950">{message.client}</p>
        <span className="text-xs font-medium text-slate-500">{message.time}</span>
      </div>
      <p className="line-clamp-1 text-sm text-slate-600">{message.preview}</p>
    </div>
    {message.unread && <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-600" />}
  </div>
);

const SegmentedControl = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) => (
  <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        className={`h-8 rounded-md px-3 text-sm font-semibold transition ${
          value === option.value ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const CalendarGrid = ({ mode }: { mode: CalendarMode }) => {
  const days = mode === 'week'
    ? ['Fri 5', 'Sat 6', 'Sun 7', 'Mon 8', 'Tue 9', 'Wed 10', 'Thu 11']
    : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className={`grid gap-3 ${mode === 'week' ? 'md:grid-cols-7' : 'md:grid-cols-4'}`}>
        {days.map((day, index) => (
          <div key={day} className="min-h-[180px] rounded-lg border border-slate-100 bg-slate-50/70 p-3">
            <p className="mb-3 text-sm font-semibold text-slate-700">{day}</p>
            <div className="space-y-2">
              {sessions
                .filter((_, sessionIndex) => (mode === 'week' ? sessionIndex === index - 2 || (index === 0 && sessionIndex === 0) : sessionIndex % 4 === index))
                .map((session) => (
                  <button key={session.id} className="w-full rounded-lg border border-emerald-100 bg-white p-2 text-left shadow-sm transition hover:border-emerald-300">
                    <p className="text-xs font-semibold text-slate-950">{session.client}</p>
                    <p className="text-[11px] text-slate-500">{session.time}</p>
                    <Badge className="mt-2" variant={statusVariant[session.status]}>{session.status}</Badge>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-800">{value}</span>
  </div>
);

const ChatBubble = ({ side, text, time }: { side: 'client' | 'professional'; text: string; time: string }) => (
  <div className={`flex ${side === 'professional' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[82%] rounded-xl px-4 py-3 text-sm shadow-sm ${
      side === 'professional'
        ? 'bg-emerald-600 text-white'
        : 'border border-slate-200 bg-white text-slate-700'
    }`}>
      <p>{text}</p>
      <p className={`mt-1 text-xs ${side === 'professional' ? 'text-emerald-100' : 'text-slate-500'}`}>{time}</p>
    </div>
  </div>
);

export default ProfessionalDashboardPage;
