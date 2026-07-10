import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BarChart3,
  CalendarDays,
  Check,
  Clock,
  Download,
  Edit3,
  Eye,
  EyeOff,
  Flame,
  LayoutDashboard,
  Pause,
  Plus,
  RotateCcw,
  Settings,
  Target,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './styles.css';
import { Habit, HabitStatus, UserSettings } from './types';
import { categories, defaultSettings } from './data/demoData';
import { AppData, demoData, loadData, resetData, saveData, validateImport } from './lib/storage';
import * as S from './lib/stats';

type Page = 'Dashboard' | 'Aujourd’hui' | 'Mois' | 'Habitudes' | 'Statistiques' | 'Paramètres';

type PageSpec = {
  name: Page;
  icon: React.ElementType;
};

const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const moisLong = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const chartColors = ['#0B3D2E', '#1F6B4E', '#B98A3B', '#C96A3A', '#D96C5F', '#6E8177', '#EADCC4'];
const pageSpecs: PageSpec[] = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Aujourd’hui', icon: Check },
  { name: 'Mois', icon: CalendarDays },
  { name: 'Habitudes', icon: Plus },
  { name: 'Statistiques', icon: BarChart3 },
  { name: 'Paramètres', icon: Settings },
];

const todayIso = () => new Date().toISOString().slice(0, 10);

function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [page, setPage] = useState<Page>('Dashboard');

  useEffect(() => saveData(data), [data]);

  const setSettings = (patch: Partial<UserSettings>) => {
    setData((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  };

  const cycle = (habitId: string, date: string) => {
    setData((current) => {
      const status = S.logFor(current.logs, habitId, date);
      const nextStatus = S.statusCycle[(S.statusCycle.indexOf(status) + 1) % S.statusCycle.length];
      return { ...current, logs: S.setLog(current.logs, habitId, date, nextStatus) };
    });
  };

  return (
    <div className="app-shell">
      <nav className="sidebar" aria-label="Navigation principale">
        <div className="brand">
          <Flame />
          <div>
            Discipline
            <span>Dashboard</span>
          </div>
        </div>
        {pageSpecs.map(({ name, icon: Icon }) => (
          <button className={page === name ? 'active' : ''} onClick={() => setPage(name)} key={name} type="button">
            <Icon />
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <main>
        {page === 'Dashboard' && <Dashboard data={data} setSettings={setSettings} />}
        {page === 'Aujourd’hui' && <Today data={data} cycle={cycle} setSettings={setSettings} />}
        {page === 'Mois' && <Month data={data} cycle={cycle} setSettings={setSettings} />}
        {page === 'Habitudes' && <Habits data={data} setData={setData} setSettings={setSettings} />}
        {page === 'Statistiques' && <Stats data={data} setSettings={setSettings} />}
        {page === 'Paramètres' && <Params data={data} setData={setData} setSettings={setSettings} />}
      </main>
    </div>
  );
}

function Header({ data, setSettings, title = 'TRACKER D’HABITUDES' }: { data: AppData; setSettings: (patch: Partial<UserSettings>) => void; title?: string }) {
  return (
    <section className="hero-card">
      <div className="hero-copy">
        <p className="eyebrow">Discipline & Productivité</p>
        <h1>{title}</h1>
        <p className="quote">Ce que tu répètes chaque jour façonne la personne que tu deviens.</p>
      </div>
      <div className="hero-controls">
        <label>
          Année
          <input type="number" value={data.settings.anneeActive} onChange={(event) => setSettings({ anneeActive: Number(event.target.value) })} />
        </label>
        <label>
          Mois actif
          <select value={data.settings.moisActif} onChange={(event) => setSettings({ moisActif: Number(event.target.value) })}>
            {moisLong.map((label, index) => (
              <option value={index} key={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

function CommercialBadges() {
  return (
    <div className="marketing-badges" aria-label="Capacités du tracker">
      <span>12 mois</span>
      <span>30 habitudes quotidiennes</span>
      <span>15 habitudes hebdomadaires</span>
      <span>Suivi local</span>
    </div>
  );
}

function Kpis({ data }: { data: AppData }) {
  const { habits, logs, settings } = data;
  const currentMonth = S.calculateMonthScore(habits, logs, settings.anneeActive, settings.moisActif, settings);
  const doneLogs = logs.filter((log) => log.status === 'done').length;
  const kpis = [
    { label: 'Score global', value: `${S.calculateYearScore(habits, logs, settings.anneeActive, settings)}%`, icon: TrendingUp, note: 'moyenne des mois suivis' },
    { label: 'Score du mois', value: `${currentMonth}%`, icon: CalendarDays, note: moisLong[settings.moisActif] },
    { label: 'Taux de réussite', value: `${S.calculateSuccessRate(habits, logs, settings)}%`, icon: Target, note: 'hors jours de repos' },
    { label: 'Anti-procrastination', value: `${S.calculateAntiProcrastinationIndex(habits, logs, settings)}%`, icon: Flame, note: 'focus + tâches pénibles' },
    { label: 'Jours disciplinés', value: S.calculateDisciplinedDays(habits, logs, settings.anneeActive, settings), icon: Check, note: 'jours à 70% ou plus' },
    { label: 'Série actuelle', value: `${S.calculateCurrentStreak(habits, logs, settings)} j`, icon: Clock, note: `meilleure : ${S.calculateBestStreak(habits, logs, settings)} j` },
    { label: 'Habitudes complétées', value: doneLogs, icon: Plus, note: 'actions accomplies' },
    { label: 'Habitudes actives', value: habits.filter((habit) => habit.active).length, icon: Eye, note: 'quotidiennes + hebdo' },
  ];

  return (
    <section className="kpi-grid">
      {kpis.map(({ label, value, icon: Icon, note }) => (
        <article className="premium-card kpi-card" key={label}>
          <div className="kpi-icon">
            <Icon />
          </div>
          <span>{label}</span>
          <strong>{value}</strong>
          <small>{note}</small>
        </article>
      ))}
    </section>
  );
}

function Dashboard({ data, setSettings }: { data: AppData; setSettings: (patch: Partial<UserSettings>) => void }) {
  const monthly = useMemo(
    () => mois.map((label, index) => ({ mois: label, score: S.calculateMonthScore(data.habits, data.logs, data.settings.anneeActive, index, data.settings) })),
    [data],
  );
  const categoryStats = useMemo(() => S.calculateCategoryStats(data.habits, data.logs, data.settings), [data]);
  const statusStats = useMemo(() => S.calculateStatusStats(data.logs), [data.logs]);
  const topHabits = useMemo(() => S.calculateTopHabits(data.habits, data.logs, data.settings), [data]);
  const fragileHabits = useMemo(() => S.calculateFragileHabits(data.habits, data.logs, data.settings), [data]);

  return (
    <>
      <Header data={data} setSettings={setSettings} />
      <CommercialBadges />
      <Kpis data={data} />
      <section className="dashboard-layout">
        <AnnualMatrix data={data} />
        <div className="dashboard-side">
          <ChartCard title="Progression mensuelle">
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#0B3D2E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0B3D2E" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#D9D6CE" strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#0B3D2E" fill="url(#scoreGradient)" strokeWidth={3} />
            </AreaChart>
          </ChartCard>
          <ChartCard title="Statuts">
            <PieChart>
              <Pie data={statusStats} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {statusStats.map((entry, index) => (
                  <Cell key={entry.status} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartCard>
        </div>
      </section>
      <section className="chart-grid">
        <ChartCard title="Score par mois">
          <BarChart data={monthly}>
            <CartesianGrid stroke="#D9D6CE" strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score" fill="#C96A3A" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Répartition par catégorie">
          <PieChart>
            <Pie data={categoryStats} dataKey="total" nameKey="categorie" innerRadius={55} outerRadius={88} paddingAngle={3}>
              {categoryStats.map((entry, index) => (
                <Cell key={entry.categorie} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
        <ChartCard title="Top 10 habitudes">
          <BarChart layout="vertical" data={topHabits} margin={{ left: 18, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="nom" type="category" width={132} />
            <Tooltip />
            <Bar dataKey="score" fill="#1F6B4E" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Habitudes fragiles">
          <BarChart layout="vertical" data={fragileHabits} margin={{ left: 18, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="nom" type="category" width={132} />
            <Tooltip />
            <Bar dataKey="score" fill="#D96C5F" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ChartCard>
      </section>
      <AntiProcrastination data={data} />
    </>
  );
}

function AnnualMatrix({ data }: { data: AppData }) {
  const rates = S.calculateHabitMonthlyRates(data.habits, data.logs, data.settings.anneeActive, data.settings);

  return (
    <section className="premium-card annual-matrix-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow compact">Vue annuelle</p>
          <h2>Matrice annuelle des habitudes</h2>
        </div>
        <span className="matrix-legend">Vert = solide · Orange = fragile · Gris = non suivi</span>
      </div>
      <div className="annual-matrix" style={{ gridTemplateColumns: `minmax(230px, 1.4fr) repeat(12, minmax(58px, 1fr))` }}>
        <strong>Habitude</strong>
        {mois.map((label) => (
          <strong key={label}>{label}</strong>
        ))}
        {rates.map((habit) => (
          <React.Fragment key={habit.id}>
            <span>
              {habit.nom}
              <small>{habit.categorie}</small>
            </span>
            {habit.values.map((value, index) => (
              <em className={`heat-cell ${heatClass(value)}`} key={`${habit.id}-${index}`}>
                {value < 0 ? '—' : `${value}%`}
              </em>
            ))}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function heatClass(value: number) {
  if (value < 0) return 'heat-empty';
  if (value < 45) return 'heat-low';
  if (value < 65) return 'heat-mid';
  if (value < 85) return 'heat-good';
  return 'heat-great';
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <section className="premium-card chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={245}>
        {children}
      </ResponsiveContainer>
    </section>
  );
}

function AntiProcrastination({ data }: { data: AppData }) {
  const top = S.calculateTopHabits(data.habits, data.logs, data.settings).find((habit) => /deep|prioritaire|projet|inbox|admin/i.test(habit.nom));
  const fragile = S.calculateFragileHabits(data.habits, data.logs, data.settings)[0];
  const priorityDays = data.logs.filter((log) => log.habitId === 'd4' && log.status === 'done').length;

  return (
    <section className="anti-panel">
      <div>
        <p className="eyebrow compact">Bloc spécial</p>
        <h2>Indice anti-procrastination</h2>
        <p>Un score concentré sur la tâche prioritaire, le deep work, le zéro scrolling et les habitudes qui évitent le report chronique.</p>
      </div>
      <strong>{S.calculateAntiProcrastinationIndex(data.habits, data.logs, data.settings)}%</strong>
      <ul>
        <li>Meilleure habitude productivité : {top?.nom ?? 'à construire'}</li>
        <li>Habitude à reprendre : {fragile?.nom ?? 'aucune alerte'}</li>
        <li>Jours avec tâche prioritaire accomplie : {priorityDays}</li>
      </ul>
    </section>
  );
}

function StatusButton({ status, onClick }: { status: HabitStatus; onClick: () => void }) {
  const Icon = status === 'done' ? Check : status === 'partial' ? Clock : status === 'missed' ? X : status === 'rest' ? Pause : Clock;
  return (
    <button className={`status-button ${status}`} onClick={onClick} type="button">
      <Icon />
      {S.statusLabels[status]}
    </button>
  );
}

function Today({ data, cycle, setSettings }: { data: AppData; cycle: (habitId: string, date: string) => void; setSettings: (patch: Partial<UserSettings>) => void }) {
  const [filter, setFilter] = useState<'Toutes' | 'Quotidiennes' | 'Hebdomadaires'>('Quotidiennes');
  const date = todayIso();
  const dateFr = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr });
  const habits = data.habits.filter((habit) => {
    if (!habit.active) return false;
    if (filter === 'Quotidiennes') return habit.frequence === 'quotidienne';
    if (filter === 'Hebdomadaires') return habit.frequence === 'hebdomadaire';
    return true;
  });

  return (
    <>
      <Header data={data} setSettings={setSettings} title="AUJOURD’HUI" />
      <section className="today-summary premium-card">
        <div>
          <p className="eyebrow compact">Saisie rapide</p>
          <h2>{dateFr}</h2>
          <p>Un clic fait tourner le statut : non saisi → accompli → partiel → manqué → repos.</p>
        </div>
        <div className="today-score">
          <span>Score du jour</span>
          <strong>{S.calculateDayScore(data.habits, data.logs, date, data.settings)}%</strong>
        </div>
      </section>
      <div className="filter-row">
        {(['Quotidiennes', 'Hebdomadaires', 'Toutes'] as const).map((label) => (
          <button className={filter === label ? 'selected' : ''} onClick={() => setFilter(label)} key={label} type="button">
            {label}
          </button>
        ))}
      </div>
      <section className="habit-card-grid">
        {habits.map((habit) => (
          <HabitStatusCard habit={habit} date={date} data={data} cycle={cycle} key={habit.id} />
        ))}
      </section>
    </>
  );
}

function HabitStatusCard({ habit, date, data, cycle }: { habit: Habit; date: string; data: AppData; cycle: (habitId: string, date: string) => void }) {
  const status = S.logFor(data.logs, habit.id, date);
  return (
    <article className="premium-card habit-card">
      <div>
        <span className="category-pill">{habit.categorie}</span>
        <h3>{habit.nom}</h3>
        <p>{habit.objectif} · {habit.frequence} · priorité {habit.priorite}</p>
      </div>
      <StatusButton status={status} onClick={() => cycle(habit.id, date)} />
    </article>
  );
}

function Month({ data, cycle, setSettings }: { data: AppData; cycle: (habitId: string, date: string) => void; setSettings: (patch: Partial<UserSettings>) => void }) {
  const [selectedDay, setSelectedDay] = useState(() => {
    const now = new Date();
    return now.getMonth() === data.settings.moisActif ? now.getDate() : 1;
  });
  const year = data.settings.anneeActive;
  const month = data.settings.moisActif;
  const days = new Date(year, month + 1, 0).getDate();
  const activeHabits = data.habits.filter((habit) => habit.active);
  const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  return (
    <>
      <Header data={data} setSettings={setSettings} title="VUE MENSUELLE" />
      <section className="premium-card month-toolbar">
        <label>
          Mois
          <select value={month} onChange={(event) => setSettings({ moisActif: Number(event.target.value) })}>
            {moisLong.map((label, index) => (
              <option value={index} key={label}>{label}</option>
            ))}
          </select>
        </label>
        <label>
          Jour mobile
          <select value={selectedDay} onChange={(event) => setSelectedDay(Number(event.target.value))}>
            {Array.from({ length: days }, (_, index) => (
              <option value={index + 1} key={index + 1}>{index + 1}</option>
            ))}
          </select>
        </label>
        <strong>{moisLong[month]} {year}</strong>
      </section>

      <section className="month-grid" style={{ gridTemplateColumns: `220px repeat(${days}, 38px) 70px` }}>
        <b>Habitude</b>
        {Array.from({ length: days }, (_, index) => <b key={index + 1}>{index + 1}</b>)}
        <b>Score</b>
        {activeHabits.map((habit) => {
          const monthLogs = data.logs.filter((log) => log.habitId === habit.id && log.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`));
          return (
            <React.Fragment key={habit.id}>
              <span>{habit.nom}</span>
              {Array.from({ length: days }, (_, index) => {
                const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
                const status = S.logFor(data.logs, habit.id, date);
                return (
                  <button className={`status-dot ${status}`} title={`${habit.nom} · ${S.statusLabels[status]}`} onClick={() => cycle(habit.id, date)} type="button" key={date}>
                    {statusSymbol(status)}
                  </button>
                );
              })}
              <strong>{S.calculateSuccessRate([habit], monthLogs, data.settings)}%</strong>
            </React.Fragment>
          );
        })}
      </section>

      <section className="mobile-month-list">
        <div className="section-heading">
          <h2>{selectedDay} {moisLong[month]}</h2>
          <span>{activeHabits.length} habitudes actives</span>
        </div>
        <div className="habit-card-grid">
          {activeHabits.map((habit) => (
            <HabitStatusCard habit={habit} date={currentDate} data={data} cycle={cycle} key={habit.id} />
          ))}
        </div>
      </section>
    </>
  );
}

function statusSymbol(status: HabitStatus) {
  if (status === 'done') return '✓';
  if (status === 'partial') return '◐';
  if (status === 'missed') return '×';
  if (status === 'rest') return 'Ⅱ';
  return '·';
}

function Habits({ data, setData, setSettings }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; setSettings: (patch: Partial<UserSettings>) => void }) {
  const [filter, setFilter] = useState('Toutes');
  const filteredHabits = data.habits.filter((habit) => filter === 'Toutes' || habit.categorie === filter);

  const updateHabit = (habitId: string, patch: Partial<Habit>) => {
    setData((current) => ({
      ...current,
      habits: current.habits.map((habit) => (habit.id === habitId ? { ...habit, ...patch } : habit)),
    }));
  };

  const addHabit = () => {
    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      nom: 'Nouvelle habitude',
      categorie: 'Autre',
      frequence: 'quotidienne',
      objectif: '1 fois',
      priorite: 'normale',
      active: true,
      couleur: '#1F6B4E',
      dateCreation: todayIso(),
    };
    setData((current) => ({ ...current, habits: [...current.habits, newHabit] }));
  };

  return (
    <>
      <Header data={data} setSettings={setSettings} title="HABITUDES" />
      <section className="premium-card habit-toolbar">
        <button className="primary-button" onClick={addHabit} type="button"><Plus /> Ajouter une habitude</button>
        <label>
          Filtrer
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>Toutes</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
      </section>
      <section className="editor-grid">
        {filteredHabits.map((habit) => (
          <article className={`premium-card habit-editor ${habit.active ? '' : 'disabled'}`} key={habit.id}>
            <div className="editor-title">
              <Edit3 />
              <input value={habit.nom} onChange={(event) => updateHabit(habit.id, { nom: event.target.value })} aria-label="Nom de l’habitude" />
            </div>
            <div className="editor-fields">
              <label>Catégorie<select value={habit.categorie} onChange={(event) => updateHabit(habit.id, { categorie: event.target.value as Habit['categorie'] })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label>Fréquence<select value={habit.frequence} onChange={(event) => updateHabit(habit.id, { frequence: event.target.value as Habit['frequence'] })}><option value="quotidienne">Quotidienne</option><option value="hebdomadaire">Hebdomadaire</option></select></label>
              <label>Objectif<input value={habit.objectif} onChange={(event) => updateHabit(habit.id, { objectif: event.target.value })} /></label>
              <label>Priorité<select value={habit.priorite} onChange={(event) => updateHabit(habit.id, { priorite: event.target.value as Habit['priorite'] })}><option value="faible">Faible</option><option value="normale">Normale</option><option value="haute">Haute</option></select></label>
            </div>
            <button className="ghost-button" onClick={() => updateHabit(habit.id, { active: !habit.active })} type="button">
              {habit.active ? <EyeOff /> : <Eye />}
              {habit.active ? 'Désactiver' : 'Réactiver'}
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

function Stats({ data, setSettings }: { data: AppData; setSettings: (patch: Partial<UserSettings>) => void }) {
  const monthly = mois.map((label, index) => ({
    mois: label,
    score: S.calculateMonthScore(data.habits, data.logs, data.settings.anneeActive, index, data.settings),
  }));
  const antiMonthly = mois.map((label, index) => ({
    mois: label,
    anti: S.calculateAntiProcrastinationIndex(
      data.habits,
      data.logs.filter((log) => log.date.startsWith(`${data.settings.anneeActive}-${String(index + 1).padStart(2, '0')}`)),
      data.settings,
    ),
  }));

  return (
    <>
      <Header data={data} setSettings={setSettings} title="STATISTIQUES" />
      <section className="chart-grid stats-grid">
        <ChartCard title="Évolution du score">
          <LineChart data={monthly}>
            <CartesianGrid stroke="#D9D6CE" strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#0B3D2E" strokeWidth={3} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Évolution anti-procrastination">
          <LineChart data={antiMonthly}>
            <CartesianGrid stroke="#D9D6CE" strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="anti" stroke="#C96A3A" strokeWidth={3} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Catégories">
          <BarChart data={S.calculateCategoryStats(data.habits, data.logs, data.settings)}>
            <XAxis dataKey="categorie" hide />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score" fill="#1F6B4E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Statuts enregistrés">
          <PieChart>
            <Pie data={S.calculateStatusStats(data.logs)} dataKey="value" nameKey="label" innerRadius={55} outerRadius={88}>
              {S.calculateStatusStats(data.logs).map((entry, index) => <Cell key={entry.status} fill={chartColors[index % chartColors.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
      </section>
      <AntiProcrastination data={data} />
    </>
  );
}

function Params({ data, setData, setSettings }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; setSettings: (patch: Partial<UserSettings>) => void }) {
  const [message, setMessage] = useState('');

  const exportJson = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    link.download = 'discipline-dashboard.json';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const importJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file
      .text()
      .then((text) => {
        const imported = JSON.parse(text);
        if (validateImport(imported)) {
          setData(imported);
          setMessage('Import réussi.');
        } else {
          setMessage('JSON invalide : structure non reconnue.');
        }
      })
      .catch(() => setMessage('Import impossible.'));
  };

  const hardReset = () => {
    const confirmation = window.prompt('Tape RESET pour confirmer la remise à zéro complète.');
    if (confirmation === 'RESET') {
      resetData();
      setData(demoData());
      setMessage('Données réinitialisées.');
    }
  };

  return (
    <>
      <Header data={data} setSettings={setSettings} title="PARAMÈTRES" />
      <section className="premium-card settings-panel">
        <label>Année active<input type="number" value={data.settings.anneeActive} onChange={(event) => setSettings({ anneeActive: Number(event.target.value) })} /></label>
        <label>Mois actif<select value={data.settings.moisActif} onChange={(event) => setSettings({ moisActif: Number(event.target.value) })}>{moisLong.map((label, index) => <option value={index} key={label}>{label}</option>)}</select></label>
        <label className="checkbox-line"><input type="checkbox" checked={data.settings.compterNonSaisisCommeManques} onChange={(event) => setSettings({ compterNonSaisisCommeManques: event.target.checked })} /> Compter les non saisis passés comme manqués</label>
        <div className="settings-actions">
          <button className="primary-button" onClick={exportJson} type="button"><Download /> Exporter JSON</button>
          <label className="file-button"><Upload /> Importer JSON<input type="file" accept="application/json" onChange={importJson} /></label>
          <button className="ghost-button" onClick={() => setData(demoData())} type="button"><RotateCcw /> Recharger la démo</button>
          <button className="danger-button" onClick={hardReset} type="button"><X /> Reset complet</button>
        </div>
        {message && <p className="settings-message">{message}</p>}
      </section>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
