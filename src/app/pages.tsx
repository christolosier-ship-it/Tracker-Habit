import React, { ChangeEvent, useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CalendarDays,
  Check,
  Download,
  Edit3,
  Eye,
  EyeOff,
  Flame,
  Plus,
  RotateCcw,
  Target,
  TrendingUp,
  Upload,
  X,
  Clock,
} from "lucide-react";
import { BentoShell, SpotlightCard } from "../components/effects/premium-effects";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ThemedAreaChart } from "../components/charts/ThemedAreaChart";
import { ThemedBarChart } from "../components/charts/ThemedBarChart";
import { ThemedBarList } from "../components/charts/ThemedBarList";
import { ThemedDonutChart } from "../components/charts/ThemedDonutChart";
import { ThemedProgressRing } from "../components/charts/ThemedProgressRing";
import { StatsInsightCards } from "../components/stats/StatsInsightCards";
import { ThemedCategoryScoreBars } from "../components/stats/ThemedCategoryScoreBars";
import { ThemedMonthlyRibbon } from "../components/stats/ThemedMonthlyRibbon";
import { ThemedStatusBreakdown } from "../components/stats/ThemedStatusBreakdown";
import { ThemeCalendarCell } from "../components/theme-identity/ThemeCalendarCell";
import { ThemeKpiFrame } from "../components/theme-identity/ThemeKpiFrame";
import { ThemePreview } from "../components/theme-identity/ThemePreview";
import { AppTheme } from "../themes/theme-types";
import { defaultThemeId, themes } from "../themes/theme-registry";
import { categories } from "../data/demoData";
import {
  AppData,
  demoData,
  migrateData,
  resetData,
  validateImport,
} from "../lib/storage";
import { DashboardStats } from "../lib/dashboard-selectors";
import { buildLogIndex, readIndexedLog } from "../lib/log-index";
import { daysInMonth, formatLocalIso } from "../lib/date-utils";
import { Habit } from "../types";
import {
  FilterToday,
  formatPercent,
  monthLongLabels,
  monthShortLabels,
  statusSymbol,
} from "./constants";
import {
  AntiProcrastination,
  AppHeader,
  CycleStatus,
  HabitStatusCard,
  SetSettings,
  TremorPanel,
} from "./shared";
import * as S from "../lib/stats";

export type PageProps = {
  data: AppData;
  theme: AppTheme;
  stats: DashboardStats;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  setSettings: SetSettings;
  cycle: CycleStatus;
};

function CommercialBadges() {
  return (
    <div className="marketing-badges" aria-label="Capacités du tracker">
      <Badge variant="success">12 mois</Badge>
      <Badge variant="warm">30 habitudes quotidiennes</Badge>
      <Badge variant="default">15 habitudes hebdomadaires</Badge>
      <Badge variant="muted">LocalStorage V3</Badge>
    </div>
  );
}

function Kpis({ theme, stats }: { theme: AppTheme; stats: DashboardStats }) {
  const kpis = [
    {
      label: "Score global",
      value: stats.scoreGlobal,
      suffix: "%",
      icon: TrendingUp,
      note: "moyenne des mois suivis",
      gauge: true,
    },
    {
      label: "Score du mois",
      value: stats.currentMonth,
      suffix: "%",
      icon: CalendarDays,
      note: "mois actif",
      gauge: true,
    },
    {
      label: "Taux de réussite",
      value: stats.success,
      suffix: "%",
      icon: Target,
      note: "hors jours de repos",
      gauge: true,
    },
    {
      label: "Anti-procrastination",
      value: stats.anti,
      suffix: "%",
      icon: Flame,
      note: "focus + tâches pénibles",
      gauge: true,
    },
    {
      label: "Jours disciplinés",
      value: stats.disciplinedDays,
      suffix: "",
      icon: Check,
      note: "jours à 70% ou plus",
    },
    {
      label: "Série actuelle",
      value: stats.currentStreak,
      suffix: " j",
      icon: Clock,
      note: `meilleure : ${stats.bestStreak} j`,
    },
    {
      label: "Habitudes complétées",
      value: stats.doneLogs,
      suffix: "",
      icon: Plus,
      note: "actions accomplies",
    },
    {
      label: "Habitudes actives",
      value: stats.activeHabits,
      suffix: "",
      icon: Eye,
      note: "quotidiennes + hebdo",
    },
  ];

  return (
    <section className="kpi-grid">
      {kpis.map(({ label, value, suffix, icon: Icon, note, gauge }, index) => (
        <SpotlightCard className="kpi-card" key={label}>
          <ThemeKpiFrame
            theme={theme}
            index={index}
            label={label}
            value={value}
          >
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
                theme={theme}
                value={Number(value)}
                variant="score"
                label={label}
              />
            )}
          </ThemeKpiFrame>
        </SpotlightCard>
      ))}
    </section>
  );
}

function AnnualMatrix({
  theme,
  rates,
}: {
  theme: AppTheme;
  rates: DashboardStats["annualRates"];
}) {
  return (
    <Card className="annual-matrix-card">
      <CardHeader className="section-heading">
        <div>
          <p className="eyebrow compact">Vue annuelle</p>
          <CardTitle>Matrice annuelle des habitudes</CardTitle>
          <CardDescription>
            Une carte météo de ta discipline : solide, fragile ou non suivi.
          </CardDescription>
        </div>
        <Badge variant="warm">12 mois</Badge>
      </CardHeader>
      <CardContent>
        <div
          className={`annual-matrix themed-heatmap heatmap-${theme.charts.visual.heatmapVariant}`}
          style={{
            gridTemplateColumns:
              "minmax(230px, 1.4fr) repeat(12, minmax(58px, 1fr))",
          }}
        >
          <strong>Habitude</strong>
          {monthShortLabels.map((label) => (
            <strong key={label}>{label}</strong>
          ))}
          {rates.map((habit) => (
            <React.Fragment key={habit.id}>
              <span>
                {habit.nom}
                <small>{habit.categorie}</small>
              </span>
              {habit.values.map((value, index) => (
                <ThemeCalendarCell
                  theme={theme}
                  score={value}
                  active={value >= 65}
                  key={`${habit.id}-${index}`}
                >
                  {value < 0 ? "—" : `${value}%`}
                </ThemeCalendarCell>
              ))}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage({
  data,
  theme,
  stats,
  setSettings,
}: PageProps) {
  return (
    <>
      <AppHeader
        data={data}
        theme={theme}
        stats={stats}
        setSettings={setSettings}
      />
      <CommercialBadges />
      <Kpis theme={theme} stats={stats} />
      <BentoShell className="dashboard-layout">
        <AnnualMatrix theme={theme} rates={stats.annualRates} />
        <div className="dashboard-side">
          <TremorPanel
            title="Progression mensuelle"
            description="Score global par mois"
          >
            <ThemedAreaChart
              theme={theme}
              data={stats.monthly}
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
              theme={theme}
              variant="status"
              data={stats.statusStats}
              valueFormatter={(value: number) => `${value}`}
            />
          </TremorPanel>
        </div>
      </BentoShell>
      <section className="chart-grid">
        <TremorPanel title="Score par mois" description="Vue histogramme">
          <ThemedBarChart
            theme={theme}
            data={stats.monthly}
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
            theme={theme}
            variant="category"
            data={stats.categoryStats}
            valueFormatter={(value: number) => `${value}`}
          />
        </TremorPanel>
        <TremorPanel
          title="Top 10 habitudes"
          description="Les habitudes qui tiennent le mieux"
        >
          <ThemedBarList
            theme={theme}
            data={stats.topHabits.map((habit) => ({
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
            theme={theme}
            data={stats.fragileHabits.map((habit) => ({
              name: habit.nom,
              value: habit.score,
            }))}
            variant="fragile"
            valueFormatter={formatPercent}
          />
        </TremorPanel>
      </section>
      <AntiProcrastination theme={theme} stats={stats} />
    </>
  );
}

export function TodayPage({
  data,
  theme,
  stats,
  cycle,
  setSettings,
}: PageProps) {
  const [filter, setFilter] = useState<FilterToday>("Quotidiennes");
  const date = formatLocalIso(new Date());
  const dateFr = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
  const habits = data.habits.filter((habit) => {
    if (!habit.active) return false;
    if (filter === "Quotidiennes") return habit.frequence === "quotidienne";
    if (filter === "Hebdomadaires") return habit.frequence === "hebdomadaire";
    return true;
  });

  return (
    <>
      <AppHeader
        data={data}
        theme={theme}
        stats={stats}
        setSettings={setSettings}
        title="AUJOURD’HUI"
      />
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
        {(["Quotidiennes", "Hebdomadaires", "Toutes"] as const).map(
          (label) => (
            <Button
              variant={filter === label ? "default" : "secondary"}
              onClick={() => setFilter(label)}
              key={label}
              type="button"
            >
              {label}
            </Button>
          ),
        )}
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

export function MonthPage({
  data,
  theme,
  stats,
  cycle,
  setSettings,
}: PageProps) {
  const [selectedDay, setSelectedDay] = useState(() => {
    const now = new Date();
    return now.getMonth() === data.settings.moisActif ? now.getDate() : 1;
  });
  const year = data.settings.anneeActive;
  const month = data.settings.moisActif;
  const dayCount = daysInMonth(year, month);
  const activeHabits = useMemo(
    () => data.habits.filter((habit) => habit.active),
    [data.habits],
  );
  const logIndex = useMemo(() => buildLogIndex(data.logs), [data.logs]);
  const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

  return (
    <>
      <AppHeader
        data={data}
        theme={theme}
        stats={stats}
        setSettings={setSettings}
        title="VUE MENSUELLE"
      />
      <Card className="month-toolbar">
        <label>
          Mois
          <select
            value={month}
            onChange={(event) =>
              setSettings({ moisActif: Number(event.target.value) })
            }
          >
            {monthLongLabels.map((label, index) => (
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
            {Array.from({ length: dayCount }, (_, index) => (
              <option value={index + 1} key={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>
        <strong>
          {monthLongLabels[month]} {year}
        </strong>
      </Card>

      <section
        className="month-grid"
        style={{ gridTemplateColumns: `220px repeat(${dayCount}, 38px) 70px` }}
      >
        <b>Habitude</b>
        {Array.from({ length: dayCount }, (_, index) => (
          <b key={index + 1}>{index + 1}</b>
        ))}
        <b>Score</b>
        {activeHabits.map((habit) => (
          <React.Fragment key={habit.id}>
            <span>{habit.nom}</span>
            {Array.from({ length: dayCount }, (_, index) => {
              const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`;
              const status = readIndexedLog(logIndex, habit.id, date);
              return (
                <ThemeCalendarCell
                  theme={theme}
                  status={status}
                  title={`${habit.nom} · ${S.statusLabels[status]}`}
                  onClick={() => cycle(habit.id, date)}
                  key={date}
                >
                  {statusSymbol(status)}
                </ThemeCalendarCell>
              );
            })}
            <strong>
              {S.calculateHabitMonthScore(
                habit,
                data.logs,
                year,
                month,
                data.settings,
              )}
              %
            </strong>
          </React.Fragment>
        ))}
      </section>

      <section className="mobile-month-list">
        <div className="section-heading mobile-heading">
          <h2>
            {selectedDay} {monthLongLabels[month]}
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

export function HabitsPage({
  data,
  theme,
  stats,
  setData,
  setSettings,
}: PageProps) {
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
      dateCreation: formatLocalIso(new Date()),
    };
    setData((current) => ({
      ...current,
      habits: [...current.habits, newHabit],
    }));
  };

  return (
    <>
      <AppHeader
        data={data}
        theme={theme}
        stats={stats}
        setSettings={setSettings}
        title="HABITUDES"
      />
      <Card className="habit-toolbar">
        <Button onClick={addHabit} type="button">
          <Plus /> Ajouter une habitude
        </Button>
        <label>
          Filtrer
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
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

export function StatsPage({
  data,
  theme,
  stats,
  setSettings,
}: PageProps) {
  return (
    <>
      <AppHeader
        data={data}
        theme={theme}
        stats={stats}
        setSettings={setSettings}
        title="STATISTIQUES"
      />
      <StatsInsightCards
        theme={theme}
        monthly={stats.monthly}
        categoryStats={stats.categoryStats}
      />
      <ThemedMonthlyRibbon theme={theme} monthly={stats.monthly} />
      <section className="chart-grid stats-grid">
        <TremorPanel title="Évolution du score" description="Mois par mois">
          <ThemedAreaChart
            theme={theme}
            data={stats.monthly}
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
            theme={theme}
            data={stats.antiMonthly}
            index="mois"
            categories={["anti"]}
            variant="antiProcrastination"
            valueFormatter={formatPercent}
          />
        </TremorPanel>
        <TremorPanel
          title="Score par catégorie"
          description="Performance par famille d’habitudes"
        >
          <ThemedCategoryScoreBars theme={theme} data={stats.categoryStats} />
        </TremorPanel>
        <TremorPanel
          title="Statuts enregistrés"
          description="Répartition des statuts saisis"
        >
          <ThemedStatusBreakdown theme={theme} data={stats.statusStats} />
        </TremorPanel>
      </section>
      <AntiProcrastination theme={theme} stats={stats} />
    </>
  );
}

export function SettingsPage({
  data,
  theme,
  stats,
  setData,
  setSettings,
}: PageProps) {
  const [message, setMessage] = useState("");

  const exportJson = () => {
    const link = document.createElement("a");
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    link.href = url;
    link.download = "discipline-dashboard.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file
      .text()
      .then((text) => {
        const imported: unknown = JSON.parse(text);
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
      <AppHeader
        data={data}
        theme={theme}
        stats={stats}
        setSettings={setSettings}
        title="PARAMÈTRES"
      />
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
          {themes.map((candidateTheme) => {
            const active = data.settings.themeId === candidateTheme.id;
            return (
              <button
                className={`theme-card ${active ? "active" : ""}`}
                onClick={() => setSettings({ themeId: candidateTheme.id })}
                type="button"
                key={candidateTheme.id}
                style={
                  {
                    "--preview-bg": candidateTheme.tokens.background,
                    "--preview-surface": candidateTheme.tokens.surface,
                    "--preview-text": candidateTheme.tokens.text,
                    "--preview-primary": candidateTheme.tokens.primary,
                    "--preview-secondary": candidateTheme.tokens.secondary,
                    "--preview-accent": candidateTheme.tokens.accent,
                    "--preview-border": candidateTheme.tokens.border,
                  } as React.CSSProperties
                }
              >
                <ThemePreview theme={candidateTheme} active={active} />
                <div className="theme-card-copy">
                  <strong>{candidateTheme.name}</strong>
                  <span>{candidateTheme.description}</span>
                  <small>{candidateTheme.personality}</small>
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
            {monthLongLabels.map((label, index) => (
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
