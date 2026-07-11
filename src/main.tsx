import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import "./styles.css";
import {
  BentoShell,
  AmbientBackground,
  SpotlightCard,
} from "./components/effects/premium-effects";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Habit, HabitStatus, UserSettings } from "./types";
import { categories, defaultSettings } from "./data/demoData";
import {
  AppData,
  demoData,
  loadData,
  resetData,
  saveData,
  validateImport,
  migrateData,
} from "./lib/storage";
import { applyThemeStyle } from "./themes/apply-theme";
import { defaultThemeId, resolveTheme, themes } from "./themes/theme-registry";
import { ThemedAreaChart } from "./components/charts/ThemedAreaChart";
import { ThemedBarChart } from "./components/charts/ThemedBarChart";
import { ThemedDonutChart } from "./components/charts/ThemedDonutChart";
import { ThemedBarList } from "./components/charts/ThemedBarList";
import { ThemedProgressRing } from "./components/charts/ThemedProgressRing";
import * as S from "./lib/stats";

type Page =
  | "Dashboard"
  | "Aujourd’hui"
  | "Mois"
  | "Habitudes"
  | "Statistiques"
  | "Paramètres";
type FilterToday = "Quotidiennes" | "Hebdomadaires" | "Toutes";

type PageSpec = {
  name: Page;
  icon: React.ElementType;
};

const mois = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];
const moisLong = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const pageSpecs: PageSpec[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Aujourd’hui", icon: Check },
  { name: "Mois", icon: CalendarDays },
  { name: "Habitudes", icon: Plus },
  { name: "Statistiques", icon: BarChart3 },
  { name: "Paramètres", icon: Settings },
];

const todayIso = () => new Date().toISOString().slice(0, 10);
const formatPercent = (value: number) => `${Math.round(value)}%`;

function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [page, setPage] = useState<Page>("Dashboard");
  const activeTheme = resolveTheme(data.settings.themeId);

  useEffect(() => saveData(data), [data]);

  const setSettings = (patch: Partial<UserSettings>) => {
    setData((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }));
  };

  const cycle = (habitId: string, date: string) => {
    setData((current) => {
      const status = S.logFor(current.logs, habitId, date);
      const nextStatus =
        S.statusCycle[
          (S.statusCycle.indexOf(status) + 1) % S.statusCycle.length
        ];
      return {
        ...current,
        logs: S.setLog(current.logs, habitId, date, nextStatus),
      };
    });
  };

  return (
    <div
      className="app-shell"
      data-theme={activeTheme.id}
      data-theme-style={activeTheme.effects.backgroundStyle}
      style={applyThemeStyle(activeTheme)}
    >
      <AmbientBackground />
      <nav className="sidebar" aria-label="Navigation principale">
        <div className="brand">
          <Flame />
          <div>
            Discipline
            <span>Dashboard</span>
          </div>
        </div>
        {pageSpecs.map(({ name, icon: Icon }) => (
          <button
            className={page === name ? "active" : ""}
            onClick={() => setPage(name)}
            key={name}
            type="button"
          >
            <Icon />
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <main>
        {page === "Dashboard" && (
          <Dashboard data={data} setSettings={setSettings} />
        )}
        {page === "Aujourd’hui" && (
          <Today data={data} cycle={cycle} setSettings={setSettings} />
        )}
        {page === "Mois" && (
          <Month data={data} cycle={cycle} setSettings={setSettings} />
        )}
        {page === "Habitudes" && (
          <Habits data={data} setData={setData} setSettings={setSettings} />
        )}
        {page === "Statistiques" && (
          <Stats data={data} setSettings={setSettings} />
        )}
        {page === "Paramètres" && (
          <Params data={data} setData={setData} setSettings={setSettings} />
        )}
      </main>
    </div>
  );
}

function Header({
  data,
  setSettings,
  title = "TRACKER D’HABITUDES",
}: {
  data: AppData;
  setSettings: (patch: Partial<UserSettings>) => void;
  title?: string;
}) {
  return (
    <motion.section
      className="hero-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="hero-copy">
        <p className="eyebrow">Discipline & Productivité</p>
        <h1>{title}</h1>
        <p className="quote">
          Ce que tu répètes chaque jour façonne la personne que tu deviens.
        </p>
      </div>
      <div className="hero-controls">
        <label>
          Année
          <input
            type="number"
            value={data.settings.anneeActive}
            onChange={(event) =>
              setSettings({ anneeActive: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Mois actif
          <select
            value={data.settings.moisActif}
            onChange={(event) =>
              setSettings({ moisActif: Number(event.target.value) })
            }
          >
            {moisLong.map((label, index) => (
              <option value={index} key={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </motion.section>
  );
}

function CommercialBadges() {
  return (
    <div className="marketing-badges" aria-label="Capacités du tracker">
      <Badge variant="success">12 mois</Badge>
      <Badge variant="warm">30 habitudes quotidiennes</Badge>
      <Badge variant="default">15 habitudes hebdomadaires</Badge>
      <Badge variant="muted">LocalStorage V1</Badge>
    </div>
  );
}

function Kpis({ data }: { data: AppData }) {
  const { habits, logs, settings } = data;
  const scoreGlobal = S.calculateYearScore(
    habits,
    logs,
    settings.anneeActive,
    settings,
  );
  const currentMonth = S.calculateMonthScore(
    habits,
    logs,
    settings.anneeActive,
    settings.moisActif,
    settings,
  );
  const success = S.calculateSuccessRate(habits, logs, settings);
  const anti = S.calculateAntiProcrastinationIndex(habits, logs, settings);
  const doneLogs = logs.filter((log) => log.status === "done").length;
  const kpis = [
    {
      label: "Score global",
      value: scoreGlobal,
      suffix: "%",
      icon: TrendingUp,
      note: "moyenne des mois suivis",
      gauge: true,
    },
    {
      label: "Score du mois",
      value: currentMonth,
      suffix: "%",
      icon: CalendarDays,
      note: moisLong[settings.moisActif],
      gauge: true,
    },
    {
      label: "Taux de réussite",
      value: success,
      suffix: "%",
      icon: Target,
      note: "hors jours de repos",
      gauge: true,
    },
    {
      label: "Anti-procrastination",
      value: anti,
      suffix: "%",
      icon: Flame,
      note: "focus + tâches pénibles",
      gauge: true,
    },
    {
      label: "Jours disciplinés",
      value: S.calculateDisciplinedDays(
        habits,
        logs,
        settings.anneeActive,
        settings,
      ),
      suffix: "",
      icon: Check,
      note: "jours à 70% ou plus",
    },
    {
      label: "Série actuelle",
      value: S.calculateCurrentStreak(habits, logs, settings),
      suffix: " j",
      icon: Clock,
      note: `meilleure : ${S.calculateBestStreak(habits, logs, settings)} j`,
    },
    {
      label: "Habitudes complétées",
      value: doneLogs,
      suffix: "",
      icon: Plus,
      note: "actions accomplies",
    },
    {
      label: "Habitudes actives",
      value: habits.filter((habit) => habit.active).length,
      suffix: "",
      icon: Eye,
      note: "quotidiennes + hebdo",
    },
  ];

  return (
    <section className="kpi-grid">
      {kpis.map(({ label, value, suffix, icon: Icon, note, gauge }) => (
        <SpotlightCard className="kpi-card" key={label}>
          <div className="kpi-content">
            <div className="kpi-icon">
              <Icon />
            </div>
            <span>{label}</span>
            <strong>
              {value}
              {suffix}
            </strong>
            <small>{note}</small>
          </div>
          {gauge && (
            <ThemedProgressRing
              theme={resolveTheme(data.settings.themeId)}
              value={Number(value)}
              variant="score"
              label={label}
            />
          )}
        </SpotlightCard>
      ))}
    </section>
  );
}

function Dashboard({
  data,
  setSettings,
}: {
  data: AppData;
  setSettings: (patch: Partial<UserSettings>) => void;
}) {
  const monthly = useMemo(
    () =>
      mois.map((label, index) => ({
        mois: label,
        score: S.calculateMonthScore(
          data.habits,
          data.logs,
          data.settings.anneeActive,
          index,
          data.settings,
        ),
      })),
    [data],
  );
  const categoryStats = useMemo(
    () => S.calculateCategoryStats(data.habits, data.logs, data.settings),
    [data],
  );
  const statusStats = useMemo(
    () => S.calculateStatusStats(data.logs),
    [data.logs],
  );
  const topHabits = useMemo(
    () => S.calculateTopHabits(data.habits, data.logs, data.settings),
    [data],
  );
  const fragileHabits = useMemo(
    () => S.calculateFragileHabits(data.habits, data.logs, data.settings),
    [data],
  );

  return (
    <>
      <Header data={data} setSettings={setSettings} />
      <CommercialBadges />
      <Kpis data={data} />
      <BentoShell className="dashboard-layout">
        <AnnualMatrix data={data} />
        <div className="dashboard-side">
          <TremorPanel
            title="Progression mensuelle"
            description="Score global par mois"
          >
            <ThemedAreaChart
              theme={resolveTheme(data.settings.themeId)}
              data={monthly}
              index="mois"
              categories={["score"]}
              variant="score"
              valueFormatter={formatPercent}
            />
          </TremorPanel>
          <TremorPanel
            title="Statuts"
            description="Accompli, partiel, manqué, repos"
          >
            <ThemedDonutChart
              theme={resolveTheme(data.settings.themeId)}
              variant="status"
              data={statusStats}
              valueFormatter={(value: number) => `${value}`}
            />
          </TremorPanel>
        </div>
      </BentoShell>
      <section className="chart-grid">
        <TremorPanel title="Score par mois" description="Vue histogramme">
          <ThemedBarChart
            theme={resolveTheme(data.settings.themeId)}
            data={monthly}
            index="mois"
            categories={["score"]}
            variant="score"
            valueFormatter={formatPercent}
          />
        </TremorPanel>
        <TremorPanel
          title="Répartition par catégorie"
          description="Volume de suivis enregistrés"
        >
          <ThemedDonutChart
            theme={resolveTheme(data.settings.themeId)}
            variant="category"
            data={categoryStats}
            valueFormatter={(value: number) => `${value}`}
          />
        </TremorPanel>
        <TremorPanel
          title="Top 10 habitudes"
          description="Les habitudes qui tiennent le mieux"
        >
          <ThemedBarList
            theme={resolveTheme(data.settings.themeId)}
            data={topHabits.map((habit) => ({
              name: habit.nom,
              value: habit.score,
            }))}
            variant="topHabits"
            valueFormatter={formatPercent}
          />
        </TremorPanel>
        <TremorPanel
          title="Habitudes fragiles"
          description="À reprendre sans drame, mais sans brouillard"
        >
          <ThemedBarList
            theme={resolveTheme(data.settings.themeId)}
            data={fragileHabits.map((habit) => ({
              name: habit.nom,
              value: habit.score,
            }))}
            variant="fragile"
            valueFormatter={formatPercent}
          />
        </TremorPanel>
      </section>
      <AntiProcrastination data={data} />
    </>
  );
}

function TremorPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="chart-card tremor-panel">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function AnnualMatrix({ data }: { data: AppData }) {
  const rates = S.calculateHabitMonthlyRates(
    data.habits,
    data.logs,
    data.settings.anneeActive,
    data.settings,
  );

  return (
    <Card className="annual-matrix-card">
      <CardHeader className="section-heading">
        <div>
          <p className="eyebrow compact">Vue annuelle</p>
          <CardTitle>Matrice annuelle des habitudes</CardTitle>
          <CardDescription>
            Une vraie carte météo de ta discipline : vert = solide, orange =
            fragile, gris = non suivi.
          </CardDescription>
        </div>
        <Badge variant="warm">12 mois</Badge>
      </CardHeader>
      <CardContent>
        <div
          className={`annual-matrix themed-heatmap heatmap-${resolveTheme(data.settings.themeId).charts.visual.heatmapVariant}`}
          style={{
            gridTemplateColumns: `minmax(230px, 1.4fr) repeat(12, minmax(58px, 1fr))`,
          }}
        >
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
                <em
                  className={`heat-cell themed-heat-cell ${heatClass(value)}`}
                  key={`${habit.id}-${index}`}
                >
                  {value < 0 ? "—" : `${value}%`}
                </em>
              ))}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function heatClass(value: number) {
  if (value < 0) return "heat-empty";
  if (value < 45) return "heat-low";
  if (value < 65) return "heat-mid";
  if (value < 85) return "heat-good";
  return "heat-great";
}

function AntiProcrastination({ data }: { data: AppData }) {
  const top = S.calculateTopHabits(data.habits, data.logs, data.settings).find(
    (habit) => /deep|prioritaire|projet|inbox|admin/i.test(habit.nom),
  );
  const fragile = S.calculateFragileHabits(
    data.habits,
    data.logs,
    data.settings,
  )[0];
  const priorityDays = data.logs.filter(
    (log) => log.habitId === "d4" && log.status === "done",
  ).length;
  const anti = S.calculateAntiProcrastinationIndex(
    data.habits,
    data.logs,
    data.settings,
  );

  return (
    <section className="anti-panel">
      <div>
        <p className="eyebrow compact">Bloc spécial</p>
        <h2>Indice anti-procrastination</h2>
        <p>
          Un score concentré sur la tâche prioritaire, le deep work, le zéro
          scrolling et les habitudes qui évitent le report chronique.
        </p>
      </div>
      <ThemedProgressRing
        theme={resolveTheme(data.settings.themeId)}
        value={anti}
        variant="antiProcrastination"
        size="lg"
        label="Indice anti-procrastination"
      />
      <ul>
        <li>Meilleure habitude productivité : {top?.nom ?? "à construire"}</li>
        <li>Habitude à reprendre : {fragile?.nom ?? "aucune alerte"}</li>
        <li>Jours avec tâche prioritaire accomplie : {priorityDays}</li>
      </ul>
    </section>
  );
}

function StatusButton({
  status,
  onClick,
}: {
  status: HabitStatus;
  onClick: () => void;
}) {
  const Icon =
    status === "done"
      ? Check
      : status === "partial"
        ? Clock
        : status === "missed"
          ? X
          : status === "rest"
            ? Pause
            : Clock;
  return (
    <Button
      className={`status-button ${status}`}
      onClick={onClick}
      type="button"
      variant="status"
    >
      <Icon />
      {S.statusLabels[status]}
    </Button>
  );
}

function Today({
  data,
  cycle,
  setSettings,
}: {
  data: AppData;
  cycle: (habitId: string, date: string) => void;
  setSettings: (patch: Partial<UserSettings>) => void;
}) {
  const [filter, setFilter] = useState<FilterToday>("Quotidiennes");
  const date = todayIso();
  const dateFr = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
  const habits = data.habits.filter((habit) => {
    if (!habit.active) return false;
    if (filter === "Quotidiennes") return habit.frequence === "quotidienne";
    if (filter === "Hebdomadaires") return habit.frequence === "hebdomadaire";
    return true;
  });

  return (
    <>
      <Header data={data} setSettings={setSettings} title="AUJOURD’HUI" />
      <Card className="today-summary">
        <div>
          <p className="eyebrow compact">Saisie rapide</p>
          <h2>{dateFr}</h2>
          <p>
            Un clic fait tourner le statut : non saisi → accompli → partiel →
            manqué → repos.
          </p>
        </div>
        <div className="today-score">
          <span>Score du jour</span>
          <strong>
            {S.calculateDayScore(data.habits, data.logs, date, data.settings)}%
          </strong>
        </div>
      </Card>
      <div className="filter-row">
        {(["Quotidiennes", "Hebdomadaires", "Toutes"] as const).map((label) => (
          <Button
            variant={filter === label ? "default" : "secondary"}
            onClick={() => setFilter(label)}
            key={label}
            type="button"
          >
            {label}
          </Button>
        ))}
      </div>
      <section className="habit-card-grid">
        {habits.map((habit) => (
          <HabitStatusCard
            habit={habit}
            date={date}
            data={data}
            cycle={cycle}
            key={habit.id}
          />
        ))}
      </section>
    </>
  );
}

function HabitStatusCard({
  habit,
  date,
  data,
  cycle,
}: {
  habit: Habit;
  date: string;
  data: AppData;
  cycle: (habitId: string, date: string) => void;
}) {
  const status = S.logFor(data.logs, habit.id, date);
  return (
    <Card className="habit-card">
      <div>
        <Badge
          variant={
            status === "done"
              ? "success"
              : status === "missed"
                ? "danger"
                : "default"
          }
        >
          {habit.categorie}
        </Badge>
        <h3>{habit.nom}</h3>
        <p>
          {habit.objectif} · {habit.frequence} · priorité {habit.priorite}
        </p>
      </div>
      <StatusButton status={status} onClick={() => cycle(habit.id, date)} />
    </Card>
  );
}

function Month({
  data,
  cycle,
  setSettings,
}: {
  data: AppData;
  cycle: (habitId: string, date: string) => void;
  setSettings: (patch: Partial<UserSettings>) => void;
}) {
  const [selectedDay, setSelectedDay] = useState(() => {
    const now = new Date();
    return now.getMonth() === data.settings.moisActif ? now.getDate() : 1;
  });
  const year = data.settings.anneeActive;
  const month = data.settings.moisActif;
  const days = new Date(year, month + 1, 0).getDate();
  const activeHabits = data.habits.filter((habit) => habit.active);
  const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

  return (
    <>
      <Header data={data} setSettings={setSettings} title="VUE MENSUELLE" />
      <Card className="month-toolbar">
        <label>
          Mois
          <select
            value={month}
            onChange={(event) =>
              setSettings({ moisActif: Number(event.target.value) })
            }
          >
            {moisLong.map((label, index) => (
              <option value={index} key={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Jour mobile
          <select
            value={selectedDay}
            onChange={(event) => setSelectedDay(Number(event.target.value))}
          >
            {Array.from({ length: days }, (_, index) => (
              <option value={index + 1} key={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>
        <strong>
          {moisLong[month]} {year}
        </strong>
      </Card>

      <section
        className="month-grid"
        style={{ gridTemplateColumns: `220px repeat(${days}, 38px) 70px` }}
      >
        <b>Habitude</b>
        {Array.from({ length: days }, (_, index) => (
          <b key={index + 1}>{index + 1}</b>
        ))}
        <b>Score</b>
        {activeHabits.map((habit) => {
          const monthLogs = data.logs.filter(
            (log) =>
              log.habitId === habit.id &&
              log.date.startsWith(
                `${year}-${String(month + 1).padStart(2, "0")}`,
              ),
          );
          return (
            <React.Fragment key={habit.id}>
              <span>{habit.nom}</span>
              {Array.from({ length: days }, (_, index) => {
                const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`;
                const status = S.logFor(data.logs, habit.id, date);
                return (
                  <button
                    className={`status-dot ${status}`}
                    title={`${habit.nom} · ${S.statusLabels[status]}`}
                    onClick={() => cycle(habit.id, date)}
                    type="button"
                    key={date}
                  >
                    {statusSymbol(status)}
                  </button>
                );
              })}
              <strong>
                {S.calculateSuccessRate([habit], monthLogs, data.settings)}%
              </strong>
            </React.Fragment>
          );
        })}
      </section>

      <section className="mobile-month-list">
        <div className="section-heading mobile-heading">
          <h2>
            {selectedDay} {moisLong[month]}
          </h2>
          <Badge variant="warm">{activeHabits.length} habitudes actives</Badge>
        </div>
        <div className="habit-card-grid">
          {activeHabits.map((habit) => (
            <HabitStatusCard
              habit={habit}
              date={currentDate}
              data={data}
              cycle={cycle}
              key={habit.id}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function statusSymbol(status: HabitStatus) {
  if (status === "done") return "✓";
  if (status === "partial") return "◐";
  if (status === "missed") return "×";
  if (status === "rest") return "Ⅱ";
  return "·";
}

function Habits({
  data,
  setData,
  setSettings,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  setSettings: (patch: Partial<UserSettings>) => void;
}) {
  const [filter, setFilter] = useState("Toutes");
  const filteredHabits = data.habits.filter(
    (habit) => filter === "Toutes" || habit.categorie === filter,
  );

  const updateHabit = (habitId: string, patch: Partial<Habit>) => {
    setData((current) => ({
      ...current,
      habits: current.habits.map((habit) =>
        habit.id === habitId ? { ...habit, ...patch } : habit,
      ),
    }));
  };

  const addHabit = () => {
    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      nom: "Nouvelle habitude",
      categorie: "Autre",
      frequence: "quotidienne",
      objectif: "1 fois",
      priorite: "normale",
      active: true,
      couleur: "#1F6B4E",
      dateCreation: todayIso(),
    };
    setData((current) => ({
      ...current,
      habits: [...current.habits, newHabit],
    }));
  };

  return (
    <>
      <Header data={data} setSettings={setSettings} title="HABITUDES" />
      <Card className="habit-toolbar">
        <Button onClick={addHabit} type="button">
          <Plus /> Ajouter une habitude
        </Button>
        <label>
          Filtrer
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option>Toutes</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      </Card>
      <section className="editor-grid">
        {filteredHabits.map((habit) => (
          <Card
            className={`habit-editor ${habit.active ? "" : "disabled"}`}
            key={habit.id}
          >
            <div className="editor-title">
              <Edit3 />
              <input
                value={habit.nom}
                onChange={(event) =>
                  updateHabit(habit.id, { nom: event.target.value })
                }
                aria-label="Nom de l’habitude"
              />
            </div>
            <div className="editor-fields">
              <label>
                Catégorie
                <select
                  value={habit.categorie}
                  onChange={(event) =>
                    updateHabit(habit.id, {
                      categorie: event.target.value as Habit["categorie"],
                    })
                  }
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                Fréquence
                <select
                  value={habit.frequence}
                  onChange={(event) =>
                    updateHabit(habit.id, {
                      frequence: event.target.value as Habit["frequence"],
                    })
                  }
                >
                  <option value="quotidienne">Quotidienne</option>
                  <option value="hebdomadaire">Hebdomadaire</option>
                </select>
              </label>
              <label>
                Objectif
                <input
                  value={habit.objectif}
                  onChange={(event) =>
                    updateHabit(habit.id, { objectif: event.target.value })
                  }
                />
              </label>
              <label>
                Priorité
                <select
                  value={habit.priorite}
                  onChange={(event) =>
                    updateHabit(habit.id, {
                      priorite: event.target.value as Habit["priorite"],
                    })
                  }
                >
                  <option value="faible">Faible</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                </select>
              </label>
            </div>
            <Button
              variant="secondary"
              onClick={() => updateHabit(habit.id, { active: !habit.active })}
              type="button"
            >
              {habit.active ? <EyeOff /> : <Eye />}
              {habit.active ? "Désactiver" : "Réactiver"}
            </Button>
          </Card>
        ))}
      </section>
    </>
  );
}

function Stats({
  data,
  setSettings,
}: {
  data: AppData;
  setSettings: (patch: Partial<UserSettings>) => void;
}) {
  const monthly = mois.map((label, index) => ({
    mois: label,
    score: S.calculateMonthScore(
      data.habits,
      data.logs,
      data.settings.anneeActive,
      index,
      data.settings,
    ),
  }));
  const antiMonthly = mois.map((label, index) => ({
    mois: label,
    anti: S.calculateAntiProcrastinationIndex(
      data.habits,
      data.logs.filter((log) =>
        log.date.startsWith(
          `${data.settings.anneeActive}-${String(index + 1).padStart(2, "0")}`,
        ),
      ),
      data.settings,
    ),
  }));

  return (
    <>
      <Header data={data} setSettings={setSettings} title="STATISTIQUES" />
      <section className="chart-grid stats-grid">
        <TremorPanel title="Évolution du score" description="Mois par mois">
          <ThemedAreaChart
            theme={resolveTheme(data.settings.themeId)}
            data={monthly}
            index="mois"
            categories={["score"]}
            variant="score"
            valueFormatter={formatPercent}
          />
        </TremorPanel>
        <TremorPanel
          title="Évolution anti-procrastination"
          description="Productivité + anti-report"
        >
          <ThemedAreaChart
            theme={resolveTheme(data.settings.themeId)}
            data={antiMonthly}
            index="mois"
            categories={["anti"]}
            variant="antiProcrastination"
            valueFormatter={formatPercent}
          />
        </TremorPanel>
        <TremorPanel
          title="Catégories"
          description="Score par famille d’habitudes"
        >
          <ThemedBarChart
            theme={resolveTheme(data.settings.themeId)}
            data={S.calculateCategoryStats(
              data.habits,
              data.logs,
              data.settings,
            )}
            index="categorie"
            categories={["score"]}
            variant="category"
            valueFormatter={formatPercent}
          />
        </TremorPanel>
        <TremorPanel title="Statuts enregistrés" description="Volume global">
          <ThemedDonutChart
            theme={resolveTheme(data.settings.themeId)}
            variant="status"
            data={S.calculateStatusStats(data.logs)}
            valueFormatter={(value: number) => `${value}`}
          />
        </TremorPanel>
      </section>
      <AntiProcrastination data={data} />
    </>
  );
}

function Params({
  data,
  setData,
  setSettings,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  setSettings: (patch: Partial<UserSettings>) => void;
}) {
  const [message, setMessage] = useState("");

  const exportJson = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    link.download = "discipline-dashboard.json";
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
          setData(migrateData(imported));
          setMessage("Import réussi.");
        } else {
          setMessage("JSON invalide : structure non reconnue.");
        }
      })
      .catch(() => setMessage("Import impossible."));
  };

  const hardReset = () => {
    const confirmation = window.prompt(
      "Tape RESET pour confirmer la remise à zéro complète.",
    );
    if (confirmation === "RESET") {
      resetData();
      setData(demoData());
      setMessage("Données réinitialisées.");
    }
  };

  return (
    <>
      <Header data={data} setSettings={setSettings} title="PARAMÈTRES" />

      <Card className="appearance-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow compact">Apparence</p>
            <h2>Choisir un style</h2>
            <p>Change l’ambiance de ton tracker selon ton humeur.</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setSettings({ themeId: defaultThemeId })}
            type="button"
          >
            <RotateCcw /> Réinitialiser le thème
          </Button>
        </div>
        <div className="theme-gallery">
          {themes.map((theme) => {
            const active = data.settings.themeId === theme.id;
            const colors = [
              theme.tokens.primary,
              theme.tokens.secondary,
              theme.tokens.accent,
              theme.tokens.accent2,
              theme.tokens.success,
            ];
            return (
              <button
                className={`theme-card ${active ? "active" : ""}`}
                data-preview-style={theme.effects.backgroundStyle}
                onClick={() => setSettings({ themeId: theme.id })}
                type="button"
                key={theme.id}
                style={
                  {
                    "--preview-bg": theme.tokens.background,
                    "--preview-surface": theme.tokens.surface,
                    "--preview-text": theme.tokens.text,
                    "--preview-primary": theme.tokens.primary,
                    "--preview-secondary": theme.tokens.secondary,
                    "--preview-accent": theme.tokens.accent,
                    "--preview-border": theme.tokens.border,
                  } as React.CSSProperties
                }
              >
                <div className="theme-preview">
                  <span className="preview-emoji">{theme.previewEmoji}</span>
                  <div className="preview-kpi">
                    <strong>87%</strong>
                    <small>streak</small>
                  </div>
                  <div className="preview-grid">
                    {Array.from({ length: 12 }, (_, index) => (
                      <i key={index} />
                    ))}
                  </div>
                  <div className="preview-badge">+12 j</div>
                </div>
                <div className="theme-card-copy">
                  <strong>{theme.name}</strong>
                  <span>{theme.description}</span>
                  <small>{theme.personality}</small>
                </div>
                <div className="theme-swatches">
                  {colors.map((color) => (
                    <i style={{ background: color }} key={color} />
                  ))}
                </div>
                <span className="theme-action">
                  {active ? "Actif" : "Appliquer"}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
      <Card className="settings-panel">
        <label>
          Année active
          <input
            type="number"
            value={data.settings.anneeActive}
            onChange={(event) =>
              setSettings({ anneeActive: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Mois actif
          <select
            value={data.settings.moisActif}
            onChange={(event) =>
              setSettings({ moisActif: Number(event.target.value) })
            }
          >
            {moisLong.map((label, index) => (
              <option value={index} key={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="checkbox-line">
          <input
            type="checkbox"
            checked={data.settings.compterNonSaisisCommeManques}
            onChange={(event) =>
              setSettings({
                compterNonSaisisCommeManques: event.target.checked,
              })
            }
          />{" "}
          Compter les non saisis passés comme manqués
        </label>
        <div className="settings-actions">
          <Button onClick={exportJson} type="button">
            <Download /> Exporter JSON
          </Button>
          <label className="file-button">
            <Upload /> Importer JSON
            <input
              type="file"
              accept="application/json"
              onChange={importJson}
            />
          </label>
          <Button
            variant="secondary"
            onClick={() => setData(demoData())}
            type="button"
          >
            <RotateCcw /> Recharger la démo
          </Button>
          <Button variant="danger" onClick={hardReset} type="button">
            <X /> Reset complet
          </Button>
        </div>
        {message && <p className="settings-message">{message}</p>}
      </Card>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
