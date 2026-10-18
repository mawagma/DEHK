import { Component, type ReactNode } from "react";

type State = { error: Error | null };

/** Zeigt statt einer weißen Seite einen Hinweis mit Fehlermeldung (Diagnose im Prototyp). */
export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Seite konnte nicht angezeigt werden", error);
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    // Bei Seitenwechsel neuen Versuch erlauben
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="page">
        <div className="hint" role="alert">
          <div>
            <strong>Diese Seite konnte nicht angezeigt werden.</strong>
            <p>Bitte laden Sie die Seite neu. Tritt der Fehler weiter auf, senden Sie uns bitte diese Meldung:</p>
            <pre className="error-detail">{this.state.error.name}: {this.state.error.message}{"\n"}{navigator.userAgent}</pre>
            <button className="primary-button" type="button" onClick={() => window.location.reload()}>Seite neu laden</button>
          </div>
        </div>
      </section>
    );
  }
}
