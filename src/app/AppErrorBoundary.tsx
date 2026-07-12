import { Component, ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erreur de rendu Habit Tracker", error, info);
  }

  private reload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="app-error-boundary" role="alert">
        <section>
          <h1>L’application a rencontré une erreur.</h1>
          <p>
            Tes données locales ne sont pas supprimées. Recharge la page pour
            relancer l’interface.
          </p>
          <button type="button" onClick={this.reload}>
            Recharger
          </button>
        </section>
      </main>
    );
  }
}
